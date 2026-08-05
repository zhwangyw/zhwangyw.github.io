import { useState } from "react";
import { Link } from "react-router-dom";
import { CardModal, LinkGeneratorModal } from "../components/Modals";
import MdEditor from "../components/MdEditor";
import StyleModal from "../components/StyleModal";
import TaskModal from "../components/TaskModal";
import { entries, lastSyncAt, sourceOf } from "../lib/content";
import { ROAD_ICONS } from "../lib/icons";
import { buildRoadmapJson, buildRoadmapMd, pctOf, PHASES } from "../lib/roadmapMd";
import { newId, useStore, type RoadItem, type TaskItem } from "../lib/store";

const TABS = [
  { id: "roadmap", label: "路线图" },
  { id: "mistakes", label: "错题本" },
  { id: "weekly", label: "周复盘" },
  { id: "links", label: "链接卡片" },
] as const;

function download(name: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function StudyPage() {
  const { toast, roadmap, setRoadmap, linkCards, setLinkCards, studyDocs, setStudyDoc } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("roadmap");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [renaming, setRenaming] = useState<number | null>(null);
  const [renameT, setRenameT] = useState("");
  const [styleFor, setStyleFor] = useState<number | null>(null);
  const [tasksFor, setTasksFor] = useState<number | null>(null);
  const [tasksAutoFocus, setTasksAutoFocus] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [taskDrafts, setTaskDrafts] = useState<Record<number, string>>({});

  const md = (slug: string) => entries.find((e) => e.category === "study" && e.slug === slug);
  const mistakes = md("mistakes");
  const weekly = md("weekly-2026-w32");
  const mistakesMd = studyDocs["mistakes"] ?? mistakes?.markdown ?? "";
  const weeklyMd = studyDocs["weekly-2026-w32"] ?? weekly?.markdown ?? "";

  const total = roadmap.length ? Math.round(roadmap.reduce((s, it) => s + pctOf(it), 0) / roadmap.length) : 0;
  const patch = (i: number, fn: (it: RoadItem) => RoadItem) =>
    setRoadmap(roadmap.map((it, j) => (j === i ? fn(it) : it)));

  const commitRename = (i: number) => {
    const v = renameT.trim();
    if (v) patch(i, (it) => ({ ...it, t: v }));
    setRenaming(null);
  };

  const addTask = () => {
    const next = [
      ...roadmap,
      { id: newId(), t: "", phase: 1, tasks: [], style: { grad: "grad-klein", icon: "star", label: "", labelColor: "#72d7ff" } },
    ];
    setRoadmap(next);
    setRenameT("");
    setRenaming(next.length - 1);
  };
  const toggleTask = (i: number, id: string) =>
    patch(i, (it) => ({ ...it, tasks: it.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
  const removeTask = (i: number, id: string) =>
    patch(i, (it) => ({ ...it, tasks: it.tasks.filter((t) => t.id !== id) }));
  const addTaskTo = (i: number) => {
    const text = (taskDrafts[i] ?? "").trim();
    if (!text) return;
    patch(i, (it) => ({ ...it, tasks: [...it.tasks, { id: newId(), text, done: false }] }));
    setTaskDrafts((d) => ({ ...d, [i]: "" }));
  };

  const newMistake = () => {
    const entry =
      "\n\n## " + new Date().toISOString().slice(0, 10) + " 新错题\n\n- 题目：\n- 我的答案：\n- 正确思路：\n- 错因：\n- 重测状态：待重测\n";
    setStudyDoc("mistakes", mistakesMd + entry);
    toast("已新建错题条目，请编辑填写");
  };
  const newWeekly = () => {
    const entry =
      "\n\n## 新周复盘（" + new Date().toISOString().slice(0, 10) + "）\n\n- 本周进展：\n- 遇到的问题：\n- 下周计划：\n- 下周时间投入调整：\n";
    setStudyDoc("weekly-2026-w32", weeklyMd + entry);
    toast("已新建复盘条目，请编辑填写");
  };

  const srcBadge = (slug: string, label: string) => {
    const s = sourceOf(slug);
    if (!s) return null;
    const short = s.path.replace(/\\/g, "/").split("/").slice(-2).join("/");
    return (
      <span className="src-badge" title={s.path + "\n" + new Date(s.syncedAt).toLocaleString("zh-CN")}>
        {label} · {short}
      </span>
    );
  };

  return (
    <div className="page">
      <p className="eyebrow">study</p>
      <h1>学习进度</h1>

      <div className="btn-row" style={{ marginTop: 18 }}>
        {TABS.map((t) => (
          <button key={t.id} className={"tab" + (tab === t.id ? " is-active" : "")} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass sync-bar">
        <span>
          数据源：cyber-mentor/study{lastSyncAt ? " · 上次同步：" + new Date(lastSyncAt).toLocaleString("zh-CN") : " · 未同步"}
        </span>
        <div className="btn-row">
          <button className="mini-btn" onClick={() => download("roadmap.md", buildRoadmapMd(roadmap))}>
            导出路线图
          </button>
          <button className="mini-btn" onClick={() => download("learning-profile.json", buildRoadmapJson(roadmap))}>
            导出学习档案
          </button>
          <button className="mini-btn" onClick={() => download("mistakes.md", mistakesMd)}>
            导出错题本
          </button>
          <button className="mini-btn" onClick={() => download("weekly-2026-W32.md", weeklyMd)}>
            导出周复盘
          </button>
        </div>
      </div>
      <p className="sub" style={{ fontSize: 12, margin: "8px 0 0" }}>
        导出文件放回 F:\cyber-mentor\study 对应位置后，本地运行 npm run sync 即可回流并更新同步时间。
      </p>

      {tab === "roadmap" && (
        <>
          <div className="glass progress-card" style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <h3>主线：PyTorch 实战 → 深度学习理论 → 偏振成像 → 求职</h3>
              <div className="btn-row">
                <Link className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} to="/tutor">
                  AI 辅导
                </Link>
                <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={addTask}>
                  ＋ 添加任务
                </button>
              </div>
            </div>
            <div className="progress-bar">
              <i style={{ width: total + "%" }} />
            </div>
            <p className="sub" style={{ margin: 0 }}>
              主线进度 {total}%（各任务「已完成子任务 / 总子任务」的平均值）
            </p>
            <div style={{ marginTop: 14 }}>
              {roadmap.map((it, i) => {
                const pct = pctOf(it);
                const Icon = ROAD_ICONS[it.style.icon] ?? ROAD_ICONS.book;
                const done = it.tasks.filter((t) => t.done).length;
                return (
                  <div
                    key={it.id}
                    className="road-card"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setExpanded(i);
                    }}
                  >
                    <div className="road-top">
                      <div className={"road-ico " + it.style.grad}>
                        <Icon size={18} weight="bold" />
                      </div>
                      {renaming === i ? (
                        <input
                          className="edit-title"
                          value={renameT}
                          autoFocus
                          onChange={(e) => setRenameT(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename(i);
                            if (e.key === "Escape") setRenaming(null);
                          }}
                          onBlur={() => commitRename(i)}
                          placeholder="任务名称"
                        />
                      ) : (
                        <div className="road-title">
                          <b>{it.t || "未命名任务"}</b>
                          <div className="road-chips">
                            {it.style.label && (
                              <span
                                className="road-label"
                                style={{
                                  color: it.style.labelColor,
                                  borderColor: it.style.labelColor + "66",
                                  background: it.style.labelColor + "1a",
                                }}
                              >
                                {it.style.label}
                              </span>
                            )}
                            <span className="pct num">{pct}%</span>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        className="road-more"
                        aria-label="更多操作"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpanded(expanded === i ? null : i);
                        }}
                      >
                        ⋯
                      </button>
                    </div>
                    <div className="bar">
                      <i style={{ width: pct + "%" }} />
                    </div>
                    <div className="road-tasks">
                      {it.tasks.map((t) => (
                        <div className="road-task" key={t.id}>
                          <button
                            type="button"
                            className={"box" + (t.done ? " done" : "")}
                            onClick={() => toggleTask(i, t.id)}
                            aria-label="勾选子任务"
                          >
                            {t.done ? "✓" : ""}
                          </button>
                          <span className={t.done ? "done-text" : ""} style={{ flex: 1 }}>
                            {t.text}
                          </span>
                          <button
                            type="button"
                            className="road-task-del"
                            onClick={() => removeTask(i, t.id)}
                            aria-label="删除子任务"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className="road-task-add">
                        <input
                          value={taskDrafts[i] ?? ""}
                          onChange={(e) => setTaskDrafts((d) => ({ ...d, [i]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && addTaskTo(i)}
                          placeholder="添加子任务，回车确认"
                        />
                        <button type="button" className="mini-btn" onClick={() => addTaskTo(i)}>
                          ＋
                        </button>
                      </div>
                    </div>
                    <div className="road-meta">
                      <span>{it.tasks.length ? done + "/" + it.tasks.length + " 子任务" : "未拆分 · 用「修改进度」添加或 AI 生成"}</span>
                      {srcBadge("study/roadmap", "来自")}
                    </div>
                    {expanded === i && (
                      <div className="road-actions">
                        <button
                          type="button"
                          className="mini-btn"
                          onClick={() => {
                            setRenaming(i);
                            setRenameT(it.t);
                            setExpanded(null);
                          }}
                        >
                          重命名
                        </button>
                        <button
                          type="button"
                          className="mini-btn"
                          onClick={() => {
                            setStyleFor(i);
                            setExpanded(null);
                          }}
                        >
                          修改样式
                        </button>
                        <button
                          type="button"
                          className="mini-btn"
                          onClick={() => {
                            setTasksAutoFocus(true);
                            setTasksFor(i);
                            setExpanded(null);
                          }}
                        >
                          添加子任务
                        </button>
                        <button
                          type="button"
                          className="mini-btn"
                          onClick={() => {
                            setTasksAutoFocus(false);
                            setTasksFor(i);
                            setExpanded(null);
                          }}
                        >
                          修改进度
                        </button>
                        <button type="button" className="mini-btn danger" onClick={() => removeItem(i)}>
                          删除
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="phase-grid">
            {PHASES.map((ph) => {
              const items = roadmap.filter((it) => it.phase === ph.p);
              const avg = items.length ? Math.round(items.reduce((s, it) => s + pctOf(it), 0) / items.length) : 0;
              return (
                <div className="glass phase-card" key={ph.p}>
                  <div className="tag">{ph.tag}</div>
                  <h3>{ph.t}</h3>
                  <p>{ph.d}</p>
                  <div className="phase-pct num">{avg}%</div>
                  <div className="road-meta" style={{ marginTop: 6 }}>
                    <span>{items.length} 项任务 · 由子任务汇总</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "mistakes" && (
        <div className="glass progress-card" style={{ marginTop: 16 }}>
          <div className="panel-head-row">
            <h3>错题本</h3>
            <div className="btn-row">
              {srcBadge("study/mistakes", "来自")}
              <button className="mini-btn" onClick={newMistake}>
                ＋ 新建错题
              </button>
            </div>
          </div>
          <MdEditor content={mistakesMd} onSave={(m) => setStudyDoc("mistakes", m)} />
        </div>
      )}

      {tab === "weekly" && (
        <div className="glass progress-card" style={{ marginTop: 16 }}>
          <div className="panel-head-row">
            <h3>周复盘</h3>
            <div className="btn-row">
              {srcBadge("study/weekly-2026-w32", "来自")}
              <button className="mini-btn" onClick={newWeekly}>
                ＋ 新建复盘
              </button>
            </div>
          </div>
          <MdEditor content={weeklyMd} onSave={(m) => setStudyDoc("weekly-2026-w32", m)} />
        </div>
      )}

      {tab === "links" && (
        <div className="glass progress-card" style={{ marginTop: 16 }}>
          <h3>链接卡片</h3>
          <p className="sub">从抖音 / 小红书 / B 站视频链接生成学习摘要卡片（要点 + 原链接），也可手动添加。</p>
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

      {styleFor != null && roadmap[styleFor] && (
        <StyleModal
          initial={roadmap[styleFor].style}
          onClose={() => setStyleFor(null)}
          onSave={(s) => {
            patch(styleFor, (it) => ({ ...it, style: s }));
            setStyleFor(null);
          }}
        />
      )}
      {tasksFor != null && roadmap[tasksFor] && (
        <TaskModal
          item={roadmap[tasksFor]}
          autoFocusAdd={tasksAutoFocus}
          onClose={() => setTasksFor(null)}
          onSave={(tasks: TaskItem[]) => {
            patch(tasksFor, (it) => ({ ...it, tasks }));
            setTasksFor(null);
          }}
        />
      )}

      {showLink && <LinkGeneratorModal context="study" onClose={() => setShowLink(false)} />}
      {showCard && <CardModal onClose={() => setShowCard(false)} />}
    </div>
  );
}
