import { useState, type ReactNode } from "react";
import { useStore } from "../lib/store";

export function Modal({ eyebrow, title, onClose, children }: { eyebrow: string; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="modal-backdrop open"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LinkGeneratorModal({
  context = "recipes",
  onClose,
}: {
  context?: "study" | "recipes";
  onClose: () => void;
}) {
  const { toast, recipes, setRecipes, linkCards, setLinkCards } = useStore();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{
    url: string;
    platform: string;
    title: string;
    ics: string[];
    fire: string[];
    steps: string[];
    points: string[];
  } | null>(null);

  const platform = (u: string) => {
    if (/douyin\.com|iesdouyin/i.test(u)) return { name: "抖音", cls: "platform-douyin" };
    if (/xiaohongshu\.com|xhslink|rednote/i.test(u)) return { name: "小红书", cls: "platform-xhs" };
    if (/bilibili\.com|b23\.tv/i.test(u)) return { name: "哔哩哔哩", cls: "platform-bili" };
    return { name: "其他平台", cls: "platform-other" };
  };
  const pf = platform(url);

  const generate = () => {
    if (!url.trim()) {
      setStatus("请先粘贴视频链接");
      return;
    }
    setStatus("正在解析视频内容（AI 提取中）…");
    setResult(null);
    window.setTimeout(() => {
      setStatus("");
      setResult({
        url: url.trim(),
        platform: pf.name,
        title: pf.name === "小红书" ? "低脂番茄炒蛋（教程）" : pf.name === "哔哩哔哩" ? "番茄炒蛋的家常做法｜新手向" : "番茄炒蛋｜新手零失败教程",
        ics: ["番茄 2 个", "鸡蛋 3 个", "小葱 1 根", "盐 / 糖 / 油"],
        fire: ["全程中火", "炒蛋约 1 分钟", "合炒约 2 分钟"],
        steps: ["热油炒蛋至凝固盛出。", "番茄炒出汁后回锅，加盐和糖调味。", "撒葱花出锅。"],
        points: ["视频主讲番茄炒蛋的控火与调味顺序", "核心：先炒蛋再合炒，避免番茄出水过多", "新手可借此练习基本刀工与火候控制"],
      });
    }, 900);
  };

  const saveToRecipe = () => {
    if (!result) return;
    setRecipes([
      ...recipes,
      {
        t: result.title,
        cat: "链接收藏",
        time: "—",
        level: "—",
        link: result.url,
        ics: result.ics,
        fire: result.fire,
        steps: result.steps,
        tip: "来自 " + result.platform + " 视频摘要",
      },
    ]);
    toast("已存入食谱");
    onClose();
  };
  const saveToStudy = () => {
    if (!result) return;
    setLinkCards([...linkCards, { t: result.title, platform: result.platform, link: result.url, points: result.points }]);
    toast("已存入学习卡片");
    onClose();
  };

  return (
    <Modal eyebrow="LINK → CARD" title="从链接生成卡片" onClose={onClose}>
      <p className="sub" style={{ fontSize: 13, marginBottom: 12 }}>
        {context === "study"
          ? "支持抖音 / 小红书 / B 站等视频链接，自动解析生成学习摘要卡片（要点 + 原链接）。"
          : "支持抖音 / 小红书 / B 站等视频链接，自动解析生成含食材、火候、步骤的菜谱卡片。"}
      </p>
      <div className="link-bar">
        <input className="link-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="粘贴视频链接，如 https://v.douyin.com/xxxx/" />
        <button className="btn btn-primary" onClick={generate}>
          生成卡片
        </button>
      </div>
      {url.trim() && !status && !result && <span className={"platform-pill " + pf.cls}>{pf.name}</span>}
      {status && (
        <div className="gen-status show">
          <span className="spinner" />
          <span>{status}</span>
        </div>
      )}
      {result && (
        <div className="gen-preview show">
          <div className="glass" style={{ padding: 16 }}>
            <p className="eyebrow">{result.platform} · AI 摘要</p>
            <h3>{result.title}</h3>
            <a className="gen-link" href={result.url} target="_blank" rel="noreferrer">
              {result.url}
            </a>
            <div className="meta-row">
              <span className="k">食材 / 材料</span>
              <span className="v">{result.ics.join(" · ")}</span>
            </div>
            <div className="meta-row">
              <span className="k">火候</span>
              <span className="v">{result.fire.join(" · ")}</span>
            </div>
            <div className="suggest" style={{ marginTop: 12 }}>
              <b>步骤摘要</b>
              <br />
              <span>{result.steps.join(" ")}</span>
            </div>
            <div className="gen-actions">
              <button className="btn btn-primary" onClick={saveToRecipe}>
                存入食谱
              </button>
              <button className="btn btn-ghost" onClick={saveToStudy}>
                存入学习卡片
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function RecipeModal({ onClose }: { onClose: () => void }) {
  const { toast, recipes, setRecipes } = useStore();
  const [form, setForm] = useState({ t: "", cat: "家常菜", time: "", level: "简单", ics: "", fire: "", steps: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    if (!form.t.trim()) {
      toast("请填写菜名");
      return;
    }
    const split = (s: string) => s.split(/[,，\n]/).map((x) => x.trim()).filter(Boolean);
    setRecipes([
      ...recipes,
      {
        t: form.t.trim(),
        cat: form.cat,
        time: form.time.trim() || "—",
        level: form.level,
        ics: split(form.ics).length ? split(form.ics) : ["待补充"],
        fire: split(form.fire),
        steps: split(form.steps).length ? split(form.steps) : ["待补充"],
        tip: "手动添加的菜谱",
      },
    ]);
    toast("菜谱已添加");
    onClose();
  };

  return (
    <Modal eyebrow="ADD RECIPE" title="手动添加菜谱" onClose={onClose}>
      <div className="form-grid">
        <div className="field">
          <label>菜名</label>
          <input value={form.t} onChange={set("t")} placeholder="如：麻婆豆腐" />
        </div>
        <div className="field">
          <label>分类</label>
          <select value={form.cat} onChange={set("cat")}>
            <option>家常菜</option>
            <option>汤羹</option>
            <option>烘焙</option>
            <option>饮品</option>
            <option>链接收藏</option>
          </select>
        </div>
        <div className="field">
          <label>用时</label>
          <input value={form.time} onChange={set("time")} placeholder="如：20 分钟" />
        </div>
        <div className="field">
          <label>难度</label>
          <select value={form.level} onChange={set("level")}>
            <option>简单</option>
            <option>中等</option>
            <option>较难</option>
          </select>
        </div>
        <div className="field full">
          <label>食材 / 材料（逗号分隔）</label>
          <input value={form.ics} onChange={set("ics")} placeholder="豆腐 1 块, 肉末 100g, 豆瓣酱 1 勺" />
        </div>
        <div className="field full">
          <label>火候（逗号分隔，可留空）</label>
          <input value={form.fire} onChange={set("fire")} placeholder="全程中火, 炒肉末 2 分钟" />
        </div>
        <div className="field full">
          <label>做法步骤（每行一步）</label>
          <textarea value={form.steps} onChange={set("steps")} placeholder={"豆腐切块焯水。\n热油炒肉末，加豆瓣酱出红油。\n下豆腐烧 5 分钟，勾芡出锅。"} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ marginTop: 6 }} onClick={save}>
        保存菜谱
      </button>
    </Modal>
  );
}

export function CardModal({ onClose }: { onClose: () => void }) {
  const { toast, linkCards, setLinkCards } = useStore();
  const [form, setForm] = useState({ t: "", platform: "", link: "", points: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    if (!form.t.trim()) {
      toast("请填写标题");
      return;
    }
    setLinkCards([
      ...linkCards,
      {
        t: form.t.trim(),
        platform: form.platform.trim() || "其他",
        link: form.link.trim(),
        points: form.points.split("\n").map((s) => s.trim()).filter(Boolean),
      },
    ]);
    toast("学习卡片已添加");
    onClose();
  };

  return (
    <Modal eyebrow="ADD CARD" title="手动添加学习卡片" onClose={onClose}>
      <div className="form-grid">
        <div className="field full">
          <label>标题</label>
          <input value={form.t} onChange={set("t")} placeholder="如：Transformer 入门视频" />
        </div>
        <div className="field">
          <label>平台</label>
          <input value={form.platform} onChange={set("platform")} placeholder="抖音 / 小红书 / B 站" />
        </div>
        <div className="field">
          <label>链接</label>
          <input value={form.link} onChange={set("link")} placeholder="https://..." />
        </div>
        <div className="field full">
          <label>要点（每行一条）</label>
          <textarea value={form.points} onChange={set("points")} placeholder={"视频主要讲了注意力机制\n核心结论：并行计算与长程依赖"} />
        </div>
      </div>
      <button className="btn btn-primary" style={{ marginTop: 6 }} onClick={save}>
        保存卡片
      </button>
    </Modal>
  );
}
