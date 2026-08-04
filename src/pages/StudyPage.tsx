import { useState } from "react";
import { CardModal, LinkGeneratorModal } from "../components/Modals";
import Markdown from "../components/Markdown";
import { entries } from "../lib/content";
import { useStore } from "../lib/store";

const TABS = [
  { id: "roadmap", label: "路线图" },
  { id: "mistakes", label: "错题本" },
  { id: "weekly", label: "周复盘" },
  { id: "links", label: "链接卡片" },
] as const;

export default function StudyPage() {
  const { toast, roadmap, setRoadmap, linkCards, setLinkCards } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("roadmap");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editT, setEditT] = useState("");
  const [editPct, setEditPct] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const total = roadmap.length ? Math.round(roadmap.reduce((s, x) => s + x.pct, 0) / roadmap.length) : 0;
  const md = (slug: string) => entries.find((e) => e.category === "study" && e.slug === slug);

  const saveEdit = () => {
    if (editIdx == null) return;
    const v = editT.trim();
    const p = Math.max(0, Math.min(100, Number(editPct) || 0));
    if (v) setRoadmap(roadmap.map((it, i) => (i === editIdx ? { t: v, pct: p } : it)));
    setEditIdx(null);
  };
  const removeItem = (i: number) => {
    if (!confirm("删除这条进度？")) return;
    setRoadmap(roadmap.filter((_, j) => j !== i));
  };

  const mistakes = md("mistakes");
  const weekly = md("weekly-2026-w32");

  return (
    <div className="page">
      <p className="eyebrow">study</p>
      <h1>学习进度</h1>
      <p className="sub">按钮切换视图：路线图 / 错题本 / 周复盘 / 链接卡片。</p>
      <div className="btn-row" style={{ marginTop: 18 }}>
        {TABS.map((t) => (
          <button key={t.id} className={"tab" + (tab === t.id ? " is-active" : "")} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "roadmap" && (
        <>
          <div className="glass progress-card" style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <h3>主线：PyTorch 实战 → 深度学习理论 → 偏振成像 → 求职</h3>
              <button
                className="btn btn-ghost"
                style={{ padding: "8px 14px", fontSize: 13 }}
                onClick={() => setRoadmap([...roadmap, { t: "新任务（点编辑修改）", pct: 0 }])}
              >
                ＋ 添加任务
              </button>
            </div>
            <div className="progress-bar">
              <i style={{ width: total + "%" }} />
            </div>
            <p className="sub" style={{ margin: 0 }}>
              主线进度 {total}%（{roadmap.length} 项平均值 · 点「编辑」可修改每项完成度）
            </p>
            <div>
              {roadmap.map((item, i) => (
                <div className="road-item" key={i}>
                  {editIdx === i ? (
                    <div className="road-head">
                      <input className="edit-title" value={editT} onChange={(e) => setEditT(e.target.value)} autoFocus />
                      <input
                        className="edit-pct"
                        type="number"
                        min={0}
                        max={100}
                        value={editPct}
                        onChange={(e) => setEditPct(Number(e.target.value))}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      />
                      <span className="pct num">%</span>
                    </div>
                  ) : (
                    <div className="road-head">
                      <b>{item.t}</b>
                      <span className="pct num">{item.pct}%</span>
                    </div>
                  )}
                  <div className="bar">
                    <i style={{ width: item.pct + "%" }} />
                  </div>
                  <div className="acts">
                    <button className="mini-btn" onClick={() => setRoadmap(roadmap.map((it, j) => (j === i ? { ...it, pct: 100 } : it)))}>
                      完成
                    </button>
                    <button
                      className="mini-btn"
                      onClick={() => {
                        setEditIdx(i);
                        setEditT(item.t);
                        setEditPct(item.pct);
                      }}
                    >
                      编辑
                    </button>
                    <button className="mini-btn danger" onClick={() => removeItem(i)}>
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="phase-grid">
            {[
              { tag: "阶段一 · 2026.8", t: "PyTorch 打基础", d: "小土堆教程 + MNIST GPU 实战：张量、自动求导、nn.Module、训练循环。", pct: 40 },
              { tag: "阶段二 · 2026.9-11", t: "深度学习理论", d: "d2l 中文版：线性回归 → MLP → CNN → RNN / Transformer。", pct: 0 },
              { tag: "阶段三 · 2026.12", t: "偏振成像课题", d: "阅读导师方向论文，复现 baseline：偏振图像 + 深度学习。", pct: 0 },
              { tag: "阶段四 · 2027+", t: "求职准备", d: "LeetCode 每日 1-2 题，八股与实习投递贯穿全程。", pct: 5 },
            ].map((p) => (
              <div className="glass phase-card" key={p.t}>
                <div className="tag">{p.tag}</div>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
                <div className="phase-pct num">{p.pct}%</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "mistakes" && (
        <div className="glass progress-card" style={{ marginTop: 16 }}>
          <h3>错题本</h3>
          {mistakes ? <Markdown>{mistakes.markdown}</Markdown> : <p className="sub">暂无数据，运行 npm run sync 同步错题本。</p>}
        </div>
      )}

      {tab === "weekly" && (
        <div className="glass progress-card" style={{ marginTop: 16 }}>
          <h3>周复盘</h3>
          {weekly ? <Markdown>{weekly.markdown}</Markdown> : <p className="sub">暂无数据。</p>}
        </div>
      )}

      {tab === "links" && (
        <div className="glass progress-card" style={{ marginTop: 16 }}>
          <h3>链接卡片</h3>
          <p className="sub">从视频链接生成的学习摘要卡片，点击链接可回到原视频。</p>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowLink(true)}>
              ＋ 从链接生成学习卡片
            </button>
            <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowCard(true)}>
              ＋ 手动添加卡片
            </button>
          </div>
          <div style={{ marginTop: 14 }}>
            {linkCards.length === 0 && <p className="sub" style={{ margin: 0 }}>暂无卡片。</p>}
            {linkCards.map((c, i) => (
              <div className="link-card-item" key={i}>
                <b style={{ fontSize: 13.5 }}>{c.t}</b> <span className="tag-pill">{c.platform}</span>
                {c.points.map((p, j) => (
                  <div key={j} style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
                    · {p}
                  </div>
                ))}
                {c.link && (
                  <a className="gen-link" href={c.link} target="_blank" rel="noreferrer">
                    打开原视频
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showLink && <LinkGeneratorModal onClose={() => setShowLink(false)} />}
      {showCard && <CardModal onClose={() => setShowCard(false)} />}
    </div>
  );
}
