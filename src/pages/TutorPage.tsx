import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  { t: "填回博客", d: "在「设置」→ DeepTutor 接入里填写公网地址，本站即可内嵌加载" },
];

export default function TutorPage() {
  const { settings, roadmap, toast } = useStore();
  const [tab, setTab] = useState<"intro" | "app">("intro");
  const [frameLoaded, setFrameLoaded] = useState(false);
  const url = (settings.deeptutorUrl || "").trim();
  useEffect(() => {
    setFrameLoaded(false);
  }, [url]);
  const total = roadmap.length ? Math.round(roadmap.reduce((s, it) => s + pctOf(it), 0) / roadmap.length) : 0;
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
        DeepTutor：港大 HKUDS 开源的终身个性化 AI 辅导系统（GitHub 30.2k 星）。说明与应用分开展示，避免互相挤占空间。
      </p>

      <div className="btn-row" style={{ marginTop: 18 }}>
        <button className={"tab" + (tab === "intro" ? " is-active" : "")} onClick={() => setTab("intro")}>
          说明
        </button>
        <button className={"tab" + (tab === "app" ? " is-active" : "")} onClick={() => setTab("app")}>
          应用
        </button>
      </div>

      {tab === "intro" && (
        <div className="tutor-grid" style={{ marginTop: 16 }}>
          <div>
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
          </div>
        </div>
      )}

      {tab === "app" && (
        <div className="glass tutor-card" style={{ marginTop: 16 }}>
          <div className="panel-head-row">
            <h3>DeepTutor 在线辅导</h3>
            {url && (
              <a className="btn btn-ghost" href={url} target="_blank" rel="noreferrer">
                新窗口打开
              </a>
            )}
          </div>
          {url ? (
            <div className="tutor-shell">
              {!frameLoaded && (
                <div className="tutor-loading">
                  <span className="spinner" />
                  <span>正在加载 DeepTutor…</span>
                </div>
              )}
              <iframe
                className={"tutor-frame tutor-frame-xl" + (frameLoaded ? "" : " is-loading")}
                src={url}
                title="DeepTutor 在线辅导"
                onLoad={() => setFrameLoaded(true)}
              />
              <p className="setting-note">
                若下方空白，可能是对方站点禁止 iframe 嵌入，请点「新窗口打开」直接使用。
              </p>
            </div>
          ) : (
            <div>
              <p className="sub" style={{ fontSize: 13 }}>
                DeepTutor 需要自托管后端与 LLM API Key，纯静态博客无法直接运行它。完成「说明」里的三步后，把服务地址填进设置，这里就会变成可用的在线辅导窗。
              </p>
              <Link className="btn btn-primary" style={{ marginTop: 12 }} to="/settings">
                去设置填写 DeepTutor 地址
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
