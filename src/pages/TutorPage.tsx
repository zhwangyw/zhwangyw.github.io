import { useState } from "react";
import { Link } from "react-router-dom";
import DeepTutorChat from "../components/DeepTutorChat";
import { buildRoadmapMd, pctOf } from "../lib/roadmapMd";
import { useStore } from "../lib/store";

const FEATURES = [
  { t: "辅导解题", d: "带引用的分步讲解，顺着你的理解水平启发式教学" },
  { t: "测验生成", d: "自动出题、难度自适应，错题沉淀进题库" },
  { t: "研究可视化", d: "知识图谱、图表与动画，把抽象概念变成看得见的结构" },
  { t: "精通练习", d: "Mastery Path 引导式学习路径，学懂一关再进下一关" },
  { t: "专属知识库", d: "上传 PDF / 教材构建 RAG 知识库，支持 LlamaIndex、GraphRAG、Obsidian" },
  { t: "高可扩展", d: "内置工具、MCP 服务与 EduHub 社区技能，也能对接 Claude Code / Codex" },
];

const STEPS = [
  {
    t: "部署 DeepTutor",
    d: "在服务器执行 pip install -U deeptutor，然后 deeptutor init && deeptutor start；或用 Docker 拉取 ghcr.io/hkuds/deeptutor",
  },
  { t: "配置大模型", d: "在 DeepTutor 的 Settings 里填入 OpenAI / DeepSeek / Gemini 等 API Key 与模型" },
  { t: "填回博客", d: "在「设置」→ DeepTutor 接入里填写 API 地址与前端地址，本站即可直连对话" },
];

const LOCAL_API = "http://127.0.0.1:8001";
const LOCAL_WEB = "http://127.0.0.1:3782";

export default function TutorPage() {
  const { settings, saveSettings, roadmap, toast } = useStore();
  const apiBase = (settings.deeptutorApi || "").trim();
  const webUrl = (settings.deeptutorUrl || "").trim();
  const [tab, setTab] = useState<"chat" | "app">("chat");
  const configured = Boolean(apiBase);
  const total = roadmap.length ? Math.round(roadmap.reduce((s, it) => s + pctOf(it), 0) / roadmap.length) : 0;

  const quickFill = () => {
    saveSettings({ deeptutorApi: LOCAL_API, deeptutorUrl: LOCAL_WEB });
  };
  const copyProfile = () => {
    navigator.clipboard
      .writeText(buildRoadmapMd(roadmap))
      .then(() => toast("路线图 Markdown 已复制，可粘贴给 DeepTutor"))
      .catch(() => toast("复制失败，请手动复制"));
  };

  return (
    <div className="page">
      <p className="eyebrow">ai tutor</p>
      <h1>AI 辅导</h1>
      <p className="sub">
        DeepTutor：港大 HKUDS 开源的终身个性化 AI 辅导系统（GitHub 30.2k 星）。代理原生学习工作空间，把辅导、测验、研究、可视化与精通练习跑在同一套引擎上。
      </p>

      <div className="tutor-grid">
        <div>
          <div className="glass tutor-card">
            <div className="panel-head-row">
              <h3>学习进度快照</h3>
              <Link className="mini-btn" to="/study">
                去学习进度
              </Link>
            </div>
            <div className="progress-bar">
              <i style={{ width: total + "%" }} />
            </div>
            <p className="sub" style={{ fontSize: 12.5, margin: "4px 0 12px" }}>
              主线进度 {total}%（{roadmap.length} 项任务平均 · 子任务量化）
            </p>
            {roadmap.slice(0, 4).map((it) => (
              <div className="mini-road" key={it.id}>
                <div className="road-head" style={{ marginBottom: 4 }}>
                  <b style={{ fontSize: 12.5 }}>{it.t}</b>
                  <span className="pct num">{pctOf(it)}%</span>
                </div>
                <div className="bar">
                  <i style={{ width: pctOf(it) + "%" }} />
                </div>
              </div>
            ))}
            <button className="mini-btn" style={{ marginTop: 10 }} onClick={copyProfile}>
              复制路线图 Markdown（可粘贴给 DeepTutor）
            </button>
          </div>

          <div className="glass tutor-card">
            <h3>六大核心能力</h3>
            {FEATURES.map((f) => (
              <div className="feature-item" key={f.t}>
                <b>{f.t}</b>
                <span>{f.d}</span>
              </div>
            ))}
          </div>

          <div className="glass tutor-card">
            <h3>接入三步</h3>
            {STEPS.map((s, i) => (
              <div className="step-card" key={s.t}>
                <span className="step-num num">{i + 1}</span>
                <div>
                  <b style={{ fontSize: 13.5 }}>{s.t}</b>
                  <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>{s.d}</div>
                </div>
              </div>
            ))}
            <Link className="btn btn-ghost" style={{ marginTop: 12 }} to="/settings">
              去设置填写地址
            </Link>
          </div>

          <div className="glass tutor-card">
            <h3>来源与链接</h3>
            <p className="sub" style={{ fontSize: 12.5, marginBottom: 8 }}>
              视频来源：THINK AI《大学生必装的开源项目！》抖音 2026-07-27
            </p>
            <div className="btn-row">
              <a className="btn btn-ghost" href="https://github.com/HKUDS/DeepTutor" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="btn btn-ghost" href="https://deeptutor.info/" target="_blank" rel="noreferrer">
                官方文档
              </a>
              <a className="btn btn-ghost" href="https://www.douyin.com/video/7667183222379302187" target="_blank" rel="noreferrer">
                原始视频
              </a>
            </div>
          </div>
        </div>

        <div>
          {configured ? (
            <>
              <div className="btn-row" style={{ marginBottom: 10 }}>
                <button className={"tab" + (tab === "chat" ? " is-active" : "")} onClick={() => setTab("chat")}>
                  对话（直连 API）
                </button>
                <button className={"tab" + (tab === "app" ? " is-active" : "")} onClick={() => setTab("app")}>
                  完整应用
                </button>
              </div>
              {tab === "chat" ? (
                <DeepTutorChat apiBase={apiBase} />
              ) : webUrl ? (
                <div className="glass tutor-card">
                  <div className="panel-head-row">
                    <h3>完整应用</h3>
                    <a className="btn btn-ghost" href={webUrl} target="_blank" rel="noreferrer">
                      新窗口打开
                    </a>
                  </div>
                  <iframe className="tutor-frame" src={webUrl} title="DeepTutor 完整应用" />
                  <p className="setting-note">若下方空白，可能是对方站点禁止 iframe 嵌入，请点「新窗口打开」。</p>
                </div>
              ) : (
                <div className="glass tutor-card">
                  <h3>完整应用</h3>
                  <p className="sub" style={{ fontSize: 13 }}>
                    尚未填写前端地址。可在设置里补上，或先使用左侧的「对话（直连 API）」。
                  </p>
                  <Link className="btn btn-primary" to="/settings">
                    去设置填写前端地址
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="glass tutor-card">
              <h3>尚未接入</h3>
              <p className="sub" style={{ fontSize: 13 }}>
                DeepTutor 需要自托管后端与 LLM API Key，纯静态博客无法直接运行它。完成左侧三步后，把服务地址填进设置，这里就会变成可用的在线辅导窗。
              </p>
              <div className="btn-row" style={{ marginTop: 12 }}>
                <Link className="btn btn-primary" to="/settings">
                  去设置填写地址
                </Link>
                <button className="btn btn-ghost" onClick={quickFill}>
                  填入本机默认地址
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
