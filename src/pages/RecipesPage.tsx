import { useMemo, useState } from "react";
import { LinkGeneratorModal, RecipeModal } from "../components/Modals";
import { useStore, type Recipe } from "../lib/store";

export default function RecipesPage() {
  const { recipes } = useStore();
  const cats = useMemo(() => [...new Set(recipes.map((r) => r.cat))], [recipes]);
  const [cat, setCat] = useState("");
  const [sel, setSel] = useState<Recipe | null>(null);
  const [showLink, setShowLink] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const list = cat ? recipes.filter((r) => r.cat === cat) : recipes;

  return (
    <div className="page">
      <p className="eyebrow">recipes</p>
      <h1>食谱</h1>
      <p className="sub">学做菜的菜谱库：家常菜、汤羹、烘焙、饮品。点击卡片查看做法。</p>
      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={() => setShowLink(true)}>
          ＋ 从链接生成食谱卡片
        </button>
        <button className="btn btn-ghost" onClick={() => setShowAdd(true)}>
          ＋ 手动添加菜谱
        </button>
      </div>
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
      <div className="kb-grid">
        <div className="note-grid" style={{ marginTop: 16 }}>
          {list.map((r) => (
            <article className="glass note-card" key={r.t} onClick={() => setSel(r)}>
              <div className="card-glow grad-klein" />
              <h3>{r.t}</h3>
              <p className="sub" style={{ fontSize: 12, margin: "4px 0 8px" }}>
                {r.cat} · {r.time} · {r.level}
              </p>
              {r.ics.slice(0, 3).map((i) => (
                <span className="tag-pill" key={i}>
                  {i}
                </span>
              ))}
              {r.ics.length > 3 && <span className="tag-pill">+{r.ics.length - 3}</span>}
            </article>
          ))}
        </div>
        <aside className="glass detail">
          <div className="note-id">RECIPE · 做法</div>
          {sel ? (
            <>
              <h3>{sel.t}</h3>
              <div className="meta-row">
                <span className="k">分类</span>
                <span className="v">{sel.cat}</span>
              </div>
              <div className="meta-row">
                <span className="k">用时</span>
                <span className="v num">{sel.time}</span>
              </div>
              <div className="meta-row">
                <span className="k">难度</span>
                <span className="v">{sel.level}</span>
              </div>
              <div className="meta-row">
                <span className="k">食材</span>
                <span className="v">
                  {sel.ics.map((i) => (
                    <span className="tag-pill" key={i}>
                      {i}
                    </span>
                  ))}
                </span>
              </div>
              {sel.fire && sel.fire.length > 0 && (
                <div className="meta-row">
                  <span className="k">火候</span>
                  <span className="v">{sel.fire.join(" · ")}</span>
                </div>
              )}
              {sel.link && (
                <div className="meta-row">
                  <span className="k">链接</span>
                  <span className="v">
                    <a className="gen-link" style={{ marginTop: 0 }} href={sel.link} target="_blank" rel="noreferrer">
                      打开原视频
                    </a>
                  </span>
                </div>
              )}
              <div className="meta-row" style={{ display: "block" }}>
                <span className="k">做法</span>
              </div>
              <ol className="step-list">
                {sel.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              {sel.tip && (
                <div className="suggest">
                  <b>小贴士</b>
                  <br />
                  <span>{sel.tip}</span>
                </div>
              )}
            </>
          ) : (
            <div className="suggest">
              <b>小贴士</b>
              <br />
              <span>点击左侧卡片查看详细做法。</span>
            </div>
          )}
        </aside>
      </div>
      {showLink && <LinkGeneratorModal onClose={() => setShowLink(false)} />}
      {showAdd && <RecipeModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
