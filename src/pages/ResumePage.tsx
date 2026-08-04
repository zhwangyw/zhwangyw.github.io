import { site } from "../data/site";

export default function ResumePage() {
  const exportWord = () => {
    const html =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>简历-' +
      site.handle +
      "</title></head><body>" +
      "<h1>" +
      site.handle +
      "</h1><p>AI 与光电交叉 · 合肥 · 合工大 AI 硕士 2026 级（2029.6 毕业）</p>" +
      "<h2>教育背景</h2><p>" +
      site.education.map((e) => "<b>" + e.k + "</b> " + e.v).join("<br/>") +
      "</p><h2>研究方向</h2><p>深度学习 + 光学应用（偏振成像）</p>" +
      "<h2>技能</h2><p>" +
      site.skills.join(" · ") +
      "</p><h2>求职时间线</h2><p>" +
      site.timeline.map((t) => t.d + " " + t.t).join(" · ") +
      "</p><h2>链接</h2><p>GitHub: " +
      site.github +
      " · 邮箱: " +
      site.email +
      "</p></body></html>";
    const blob = new Blob(["\ufeff" + html], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "简历-" + site.handle + ".doc";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="page">
      <p className="eyebrow">resume</p>
      <h1>{site.handle}</h1>
      <p className="sub">AI 与光电交叉 · 合肥 · 合工大 AI 硕士 2026 级（2029.6 毕业）</p>
      <div className="resume-actions">
        <button className="btn btn-primary" onClick={() => window.print()}>
          导出 PDF
        </button>
        <button className="btn btn-ghost" onClick={exportWord}>
          导出 Word
        </button>
      </div>
      <div className="resume-grid">
        <div className="glass resume-panel">
          <h3>教育背景</h3>
          {site.education.map((e) => (
            <div className="resume-row" key={e.k}>
              <span className="k">{e.k}</span>
              <span className="v">
                <b>{e.v.split(" · ")[0]}</b> · {e.v.split(" · ").slice(1).join(" · ")}
              </span>
            </div>
          ))}
        </div>
        <div className="glass resume-panel">
          <h3>技能</h3>
          <div style={{ marginTop: 4 }}>
            {site.skills.map((s) => (
              <span className="skill-chip" key={s}>
                {s}
              </span>
            ))}
          </div>
          <h3 style={{ marginTop: 20 }}>链接</h3>
          <div className="resume-row">
            <span className="k">GitHub</span>
            <span className="v">{site.github}</span>
          </div>
          <div className="resume-row">
            <span className="k">邮箱</span>
            <span className="v">{site.email}</span>
          </div>
        </div>
        <div className="glass resume-panel" style={{ gridColumn: "1 / -1" }}>
          <h3>求职时间线</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 6 }}>
            {site.timeline.map((t) => (
              <div className="stat" key={t.d}>
                <div className="label">{t.d}</div>
                <div className="value" style={{ fontSize: 15 }}>
                  {t.t}
                </div>
              </div>
            ))}
          </div>
          <p className="sub" style={{ margin: "14px 0 0" }}>
            简历初稿计划 2028.2 定稿，当前版本为持续更新的信息骨架。
          </p>
        </div>
        <div className="glass resume-panel" style={{ gridColumn: "1 / -1" }}>
          <h3>简历开源方案（规划）</h3>
          <div className="oss-row">
            <b>Reactive Resume</b>
            <span>开源简历生成器，支持多模板与 JSON 数据源，计划接入一键导出。</span>
          </div>
          <div className="oss-row">
            <b>OpenResume</b>
            <span>隐私优先的本地简历构建器，支持 PDF 导出。</span>
          </div>
          <div className="oss-row">
            <b>自托管方案</b>
            <span>正式版将把本页数据导出为标准化简历 JSON，再生成 PDF / Word。</span>
          </div>
        </div>
      </div>
    </div>
  );
}
