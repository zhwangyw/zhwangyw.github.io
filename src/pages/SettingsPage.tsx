import { useStore } from "../lib/store";

const FEISHU = [
  ["fsAppId", "App ID", "cli_xxxxxxxx"],
  ["fsSecret", "App Secret", "••••••••"],
  ["fsWebhook", "机器人 Webhook", "https://open.feishu.cn/open-apis/bot/v2/hook/..."],
  ["fsTarget", "接收人（Open ID / 手机号）", "ou_xxxxxxxx"],
] as const;
const LLM = [
  ["llmBase", "Base URL", "https://api.deepseek.com/v1"],
  ["llmKey", "API Key", "sk-..."],
  ["llmModel", "模型", "deepseek-chat / qwen3:4b"],
  ["ollamaUrl", "本地 Ollama 地址（可选）", "http://127.0.0.1:11434"],
] as const;

export default function SettingsPage() {
  const { settings, saveSettings, toast } = useStore();
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => saveSettings({ [k]: e.target.value });
  const test = () => {
    const base = settings.llmBase || "";
    const key = settings.llmKey || "";
    toast(base && key ? "配置已填写，正式版将发起真实请求" : "请先填写 Base URL 与 API Key");
  };

  return (
    <div className="page">
      <p className="eyebrow">settings</p>
      <h1>设置</h1>
      <p className="sub">接入飞书与大模型 API，配置保存在浏览器本地（v1 阶段）。</p>
      <div className="settings-grid">
        <div className="glass setting-group">
          <h3>飞书接入</h3>
          {FEISHU.map(([k, label, ph]) => (
            <div className="field" key={k}>
              <label>{label}</label>
              <input type={k === "fsSecret" ? "password" : "text"} value={settings[k] || ""} onChange={set(k)} placeholder={ph} />
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => toast("飞书配置已保存")}>
            保存飞书配置
          </button>
        </div>
        <div className="glass setting-group">
          <h3>大模型 API</h3>
          {LLM.map(([k, label, ph]) => (
            <div className="field" key={k}>
              <label>{label}</label>
              <input type={k === "llmKey" ? "password" : "text"} value={settings[k] || ""} onChange={set(k)} placeholder={ph} />
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => toast("模型配置已保存")}>
            保存模型配置
          </button>
          <button className="btn btn-ghost" style={{ marginLeft: 8 }} onClick={test}>
            测试连接
          </button>
          <p className="setting-note">配置仅保存在本机 localStorage；正式版由后端加密存储，并支持飞书任务 / 提醒与 AI 摘要。</p>
        </div>
        <div className="glass setting-group">
          <h3>DeepTutor 接入</h3>
          <div className="field">
            <label>API 地址（后端，用于网页直连对话）</label>
            <input
              type="text"
              value={settings.deeptutorApi || ""}
              onChange={set("deeptutorApi")}
              placeholder="http://127.0.0.1:8001"
            />
          </div>
          <div className="field">
            <label>前端地址（完整应用 / iframe）</label>
            <input
              type="text"
              value={settings.deeptutorUrl || ""}
              onChange={set("deeptutorUrl")}
              placeholder="http://127.0.0.1:3782"
            />
          </div>
          <button className="btn btn-primary" onClick={() => toast("DeepTutor 地址已保存")}>
            保存地址
          </button>
          <p className="setting-note">
            需先在服务器自托管 DeepTutor（pip 或 Docker）并配置大模型 API Key。API 地址填后端（网页通过 WebSocket 直连），前端地址用于 iframe / 新窗口；若目标站点禁止 iframe，可改用新窗口打开。
          </p>
        </div>
      </div>
    </div>
  );
}
