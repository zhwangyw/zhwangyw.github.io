export type Note = {
  t: string;
  cat: string;
  date: string;
  status: string;
  pri: string;
  tags: string[];
  grad: string;
  sug: string;
};

export const notes: Note[] = [
  { t: "学习路线-PyTorch", cat: "技能", date: "2026-08-03", status: "在读", pri: "高", tags: ["PyTorch", "路线"], grad: "grad-klein", sug: "把路线图中的「8 月底 MNIST」拆成周粒度任务。" },
  { t: "深度学习速查卡", cat: "技能", date: "2026-08-02", status: "未读", pri: "中", tags: ["速查", "理论"], grad: "grad-cyan", sug: "建议转成可检索的 Wiki 条目，加入面试八股清单。" },
  { t: "面试八股清单", cat: "技能", date: "2026-08-01", status: "未读", pri: "中", tags: ["求职", "八股"], grad: "grad-original", sug: "按「机器学习/深度学习/计算机基础」三类整理。" },
  { t: "技能地图", cat: "技能", date: "2026-07-31", status: "在读", pri: "高", tags: ["技能", "图谱"], grad: "grad-chrome", sug: "与三年时间线对齐，标记每个阶段的里程碑。" },
  { t: "文献工作流", cat: "文献", date: "2026-07-30", status: "未读", pri: "中", tags: ["文献", "Zotero"], grad: "grad-klein", sug: "把 Zotero 管道说明整理成操作手册。" },
  { t: "论文清单", cat: "文献", date: "2026-07-29", status: "未读", pri: "高", tags: ["文献", "偏振"], grad: "grad-cyan", sug: "标出 5 篇必读综述，按优先级排序。" },
  { t: "课题-偏振成像", cat: "课题", date: "2026-07-28", status: "已读", pri: "高", tags: ["课题", "偏振"], grad: "grad-original", sug: "已读，提炼为 Wiki 条目并补充 baseline 复现计划。" },
  { t: "赛博导师-Hermes", cat: "课题", date: "2026-07-27", status: "在读", pri: "中", tags: ["Agent", "导师"], grad: "grad-chrome", sug: "记录 Hermes 的配置流程，沉淀为可复用教程。" },
];
