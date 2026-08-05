import { Link } from "react-router-dom";
import ConstellationMap from "../components/ConstellationMap";
import EditableIntro from "../components/EditableIntro";
import StatCard from "../components/StatCard";
import { site } from "../data/site";

export default function HomePage() {
  return (
    <div className="page">
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">home · {site.location}</p>
          <h1>{site.title}</h1>
          <EditableIntro page="home" defaultText={site.tagline + "。当前主线：PyTorch → MNIST → 偏振成像。"} />
        </div>
      </div>
      <div className="stat-row">
        <StatCard k="MAIN · 主线进度" v="30%" d="PyTorch 进行中 · 2026.8" />
        <StatCard k="BLOG · 博客文章" v="2" d="已自动归类" />
        <StatCard k="NOTES · 精选笔记" v="8" d="Obsidian 精选 · 本周 +2" />
        <StatCard k="REVIEW · 周复盘" v="1" d="2026-W32 · 待填充" />
      </div>
      <div className="kb-grid">
        <ConstellationMap />
        <aside className="glass detail">
          <div className="note-id">FOCUS · 当前焦点</div>
          <h3>小土堆 PyTorch → MNIST</h3>
          <div className="meta-row">
            <span className="k">进度</span>
            <span className="v num">40%</span>
          </div>
          <div className="meta-row">
            <span className="k">目标</span>
            <span className="v">8 月底跑通 GPU 版</span>
          </div>
          <div className="meta-row">
            <span className="k">设备</span>
            <span className="v">RTX 3060</span>
          </div>
          <div className="suggest">
            <b>AI 导师建议</b>
            <br />
            <span>今天把鱼书最后 2 章过完，明天进入 MNIST 实战。</span>
          </div>
          <div className="actions">
            <Link className="btn btn-ghost" to="/knowledge">
              进入知识库
            </Link>
            <Link className="btn btn-primary" to="/study">
              查看学习进度
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
