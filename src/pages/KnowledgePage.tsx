import { useState } from "react";
import CardRing3D from "../components/CardRing3D";
import EditableIntro from "../components/EditableIntro";
import StatCard from "../components/StatCard";
import { notes, type Note } from "../data/notes";

const DAYS = [
  { d: "07-29", n: true },
  { d: "07-30", n: true },
  { d: "07-31", n: true },
  { d: "08-01", n: true },
  { d: "08-02", n: true },
  { d: "08-03", n: true },
  { d: "08-04", n: true, today: true },
  { d: "08-05" },
  { d: "08-06" },
  { d: "08-07" },
];

export default function KnowledgePage() {
  const [view, setView] = useState<"dashboard" | "ring" | "list">("dashboard");
  const [sel, setSel] = useState<Note>(notes[0]);

  return (
    <div className="page">
      <p className="eyebrow">knowledge</p>
      <h1>知识库工作台</h1>
      <EditableIntro page="knowledge" defaultText="未读识别 · 阅读推进 · 知识沉淀。按钮切换视图：仪表盘 / 3D 卡片环 / 笔记列表。" />
      <div className="btn-row" style={{ marginTop: 18 }}>
        {(
          [
            ["dashboard", "仪表盘"],
            ["ring", "3D 卡片环"],
            ["list", "笔记列表"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} className={"tab" + (view === id ? " is-active" : "")} onClick={() => setView(id)}>
            {label}
          </button>
        ))}
      </div>

      {view === "dashboard" && (
        <>
          <div className="stat-row" style={{ marginTop: 16 }}>
            <StatCard k="TODAY · 今日新增" v="2" d={<>较昨日 <span className="delta up">+20%</span></>} />
            <StatCard k="INBOX · 精选笔记" v="8" d={<>较昨日 <span className="delta up">+8%</span></>} />
            <StatCard k="ARCHIVE · 已读沉淀" v="5" d={<>较昨日 <span className="delta up">+15%</span></>} />
            <StatCard k="BACKLOG · 长期未读" v="1" d={<>较昨日 <span className="delta warn">+40%</span></>} />
          </div>
          <div className="kb-grid">
            <div className="kb-center">
              <div className="glass queue">
                <div className="queue-head">
                  <h3>阅读队列</h3>
                  <span className="sub" style={{ fontSize: 12 }}>
                    全部笔记 · 我负责的 · 我参与的
                  </span>
                </div>
                <div className="queue-group">
                  <h4>今日新增 2</h4>
                  <div className="queue-item">
                    <span className="dot unread" />
                    <span className="t">AI 时代的信息焦虑</span>
                    <span className="m">未读 · 今天 10:00</span>
                  </div>
                  <div className="queue-item">
                    <span className="dot unread" />
                    <span className="t">Obsidian 阅读工作流</span>
                    <span className="m">未读 · 今天 14:00</span>
                  </div>
                  <div className="queue-item">
                    <span className="dot reading" />
                    <span className="t">知识吸收的闭环设计</span>
                    <span className="m">在读 · 昨天 09:30</span>
                  </div>
                </div>
                <div className="queue-group">
                  <h4>长期积压 1</h4>
                  <div className="queue-item">
                    <span className="dot unread" />
                    <span className="t">Agent Memory 架构</span>
                    <span className="m">已积压 92 天</span>
                  </div>
                </div>
                <div className="queue-group">
                  <h4>待沉淀 3</h4>
                  <div className="queue-item">
                    <span className="dot reading" />
                    <span className="t">PyTorch 张量速查</span>
                    <span className="m">在读 · 提炼摘要中</span>
                  </div>
                  <div className="queue-item">
                    <span className="dot done" />
                    <span className="t">偏振成像入门</span>
                    <span className="m">已读 · 待建 Wiki 条目</span>
                  </div>
                </div>
              </div>
              <div className="glass timeline">
                <h3>阅读时间轴</h3>
                <div className="tl-strip">
                  {DAYS.map((day) => (
                    <div key={day.d} className={"tl-day" + (day.today ? " is-today" : "") + (day.n ? " has-note" : "")}>
                      <span>{day.d}</span>
                      <b>{day.d.slice(3)}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DetailPanel note={sel} />
          </div>
        </>
      )}

      {view === "ring" && (
        <div style={{ marginTop: 16 }}>
          <CardRing3D items={notes} onSelect={setSel} />
        </div>
      )}

      {view === "list" && (
        <div className="note-grid" style={{ marginTop: 16 }}>
          {notes.map((n) => (
            <article className="glass note-card" key={n.t} onClick={() => setSel(n)}>
              <div className={"card-glow " + n.grad} />
              <h3>{n.t}</h3>
              <p className="sub" style={{ fontSize: 12, margin: "4px 0 8px" }}>
                {n.cat} · {n.status}
              </p>
              {n.tags.map((t) => (
                <span className="tag-pill" key={t}>
                  {t}
                </span>
              ))}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailPanel({ note }: { note: Note }) {
  return (
    <aside className="glass detail">
      <div className="note-id">NOTE-0001-186</div>
      <h3>{note.t}</h3>
      <div className="meta-row">
        <span className="k">负责人</span>
        <span className="v">DY 大Y</span>
      </div>
      <div className="meta-row">
        <span className="k">所属目录</span>
        <span className="v">{note.cat}</span>
      </div>
      <div className="meta-row">
        <span className="k">首次发现</span>
        <span className="v num">{note.date}</span>
      </div>
      <div className="meta-row">
        <span className="k">当前状态</span>
        <span className="v">{note.status}</span>
      </div>
      <div className="meta-row">
        <span className="k">优先级</span>
        <span className="v">{note.pri}</span>
      </div>
      <div className="meta-row">
        <span className="k">标签</span>
        <span className="v">
          {note.tags.map((t) => (
            <span className="tag-pill" key={t}>
              {t}
            </span>
          ))}
        </span>
      </div>
      <div className="suggest">
        <b>AI 导师建议</b>
        <br />
        <span>{note.sug}</span>
      </div>
      <div className="actions">
        <button className="btn btn-ghost">编辑笔记</button>
        <button className="btn btn-primary">标为已读</button>
      </div>
    </aside>
  );
}
