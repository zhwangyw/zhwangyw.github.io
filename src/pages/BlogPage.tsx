import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { posts } from "../lib/content";

const RULES = [
  { cat: "技术笔记", keys: ["pytorch", "深度学习", "numpy", "cnn", "transformer", "神经网络"] },
  { cat: "知识管理", keys: ["obsidian", "知识管理", "para", "知识库", "笔记"] },
  { cat: "工具", keys: ["工具", "whisper", "转写", "ai", "faster"] },
];
const autoCat = (p: { title: string; tags: string[]; summary: string }) => {
  const text = (p.title + " " + p.tags.join(" ") + " " + p.summary).toLowerCase();
  for (const r of RULES) if (r.keys.some((k) => text.includes(k))) return r.cat;
  return "其他";
};

export default function BlogPage() {
  const items = useMemo(() => posts.map((p) => ({ ...p, cat: autoCat(p) })), []);
  const cats = useMemo(() => [...new Set(items.map((p) => p.cat))], [items]);
  const [cat, setCat] = useState("");
  const list = cat ? items.filter((p) => p.cat === cat) : items;

  return (
    <div className="page">
      <p className="eyebrow">blog</p>
      <h1>技术博客</h1>
      <p className="sub">PyTorch / 深度学习 / 偏振成像 / 学习系统。文章按内容自动归类。</p>
      <div className="btn-row" style={{ marginTop: 18 }}>
        <button className={"tab" + (!cat ? " is-active" : "")} onClick={() => setCat("")}>
          全部
        </button>
        {cats.map((c) => (
          <button key={c} className={"tab" + (cat === c ? " is-active" : "")} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="post-list" style={{ marginTop: 16 }}>
        {list.length === 0 && <p className="sub">暂无文章。运行 npm run build:content 生成内容索引。</p>}
        {!cat &&
          cats.map((c) => {
            const group = items.filter((p) => p.cat === c);
            if (!group.length) return null;
            return (
              <div key={c}>
                <h3 style={{ margin: "6px 0 10px", color: "var(--faint)", fontSize: 13, letterSpacing: "0.08em" }}>
                  {c} · {group.length} 篇
                </h3>
                {group.map((p) => (
                  <PostCard key={p.slug} {...p} />
                ))}
              </div>
            );
          })}
        {cat && list.map((p) => <PostCard key={p.slug} {...p} />)}
      </div>
    </div>
  );
}

function PostCard(p: { slug: string; title: string; date: string; summary: string; tags: string[]; cat: string }) {
  return (
    <Link to={"/blog/" + p.slug} className="glass post-card">
      <span className="date num">{p.date}</span>
      <div>
        <div style={{ marginBottom: 6 }}>
          <span className="cat-pill">{p.cat}</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.summary}</p>
        <div style={{ marginTop: 8 }}>
          {p.tags.map((t) => (
            <span className="tag-pill" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
