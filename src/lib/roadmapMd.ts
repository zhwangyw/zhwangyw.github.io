import type { RoadItem } from "./store";

export const pctOf = (it: RoadItem) =>
  it.tasks.length ? Math.round((it.tasks.filter((t) => t.done).length / it.tasks.length) * 100) : 0;

export const PHASES = [
  { p: 1, tag: "阶段一 · 2026.8", t: "PyTorch 打基础" },
  { p: 2, tag: "阶段二 · 2026.9-11", t: "深度学习理论" },
  { p: 3, tag: "阶段三 · 2026.12", t: "偏振成像课题" },
  { p: 4, tag: "阶段四 · 2027+", t: "求职准备" },
];

export function buildRoadmapMd(roadmap: RoadItem[]) {
  const lines = [
    "---",
    'title: "学习路线图"',
    'date: "' + new Date().toISOString().slice(0, 10) + '"',
    'tags: ["路线图"]',
    'summary: "由知识星空导出，可导入 DeepTutor / Obsidian。"',
    "---",
    "",
    "# 学习路线图",
    "",
    "## 当前进度",
  ];
  roadmap.forEach((it) => {
    lines.push("", "### " + it.t + "（" + pctOf(it) + "%）");
    if (it.style.label) lines.push("> 标签：" + it.style.label);
    if (!it.tasks.length) lines.push("- [ ] 未拆分：请添加子任务或用 AI 生成");
    it.tasks.forEach((t) => lines.push("- [" + (t.done ? "x" : " ") + "] " + t.text));
  });
  lines.push("", "## 阶段计划");
  PHASES.forEach((ph) => {
    const items = roadmap.filter((it) => it.phase === ph.p);
    const avg = items.length ? Math.round(items.reduce((s, it) => s + pctOf(it), 0) / items.length) : 0;
    lines.push("- " + ph.tag + " " + ph.t + "：" + avg + "%");
  });
  return lines.join("\n");
}

export function buildRoadmapJson(roadmap: RoadItem[]) {
  return JSON.stringify(
    {
      version: 2,
      exportedAt: new Date().toISOString(),
      items: roadmap.map((it) => ({
        title: it.t,
        phase: it.phase,
        progress: pctOf(it),
        tasks: it.tasks.map((t) => ({ text: t.text, done: t.done })),
        style: it.style,
      })),
    },
    null,
    2
  );
}
