import type { RoadItem } from "../lib/store";

export const initialRoadmap: RoadItem[] = [
  {
    id: "r1",
    t: "鱼书《深度学习入门》",
    phase: 1,
    tasks: [
      { id: "r1t1", text: "读完第 5-6 章（CNN 与深度学习）", done: true },
      { id: "r1t2", text: "完成章末小练习", done: true },
      { id: "r1t3", text: "整理读书笔记到知识库", done: false },
    ],
    style: { grad: "grad-klein", icon: "book", label: "理论", labelColor: "#72d7ff" },
  },
  {
    id: "r2",
    t: "小土堆 PyTorch 教程 → 8 月底 MNIST GPU 实战",
    phase: 1,
    tasks: [
      { id: "r2t1", text: "看完张量与自动求导部分", done: true },
      { id: "r2t2", text: "看完 nn.Module 与 DataLoader", done: false },
      { id: "r2t3", text: "跑通 MNIST GPU 训练", done: false },
      { id: "r2t4", text: "提交代码到 GitHub", done: false },
    ],
    style: { grad: "grad-cyan", icon: "code", label: "实战", labelColor: "#3ddc84" },
  },
  {
    id: "r3",
    t: "Dive into Deep Learning（2026.9 - 11）",
    phase: 2,
    tasks: [
      { id: "r3t1", text: "线性回归与 MLP", done: false },
      { id: "r3t2", text: "CNN 与图像理解", done: false },
      { id: "r3t3", text: "RNN / Transformer", done: false },
    ],
    style: { grad: "grad-original", icon: "flask", label: "理论", labelColor: "#a56cff" },
  },
  {
    id: "r4",
    t: "偏振成像 baseline（2026.12 启动）",
    phase: 3,
    tasks: [
      { id: "r4t1", text: "读 5 篇导师方向综述", done: false },
      { id: "r4t2", text: "复现 baseline 数据管线", done: false },
      { id: "r4t3", text: "训练并评估模型", done: false },
    ],
    style: { grad: "grad-chrome", icon: "cpu", label: "课题", labelColor: "#ffd07a" },
  },
  {
    id: "r5",
    t: "LeetCode 每日 1-2 题（贯穿）",
    phase: 4,
    tasks: [
      { id: "r5t1", text: "每日 1-2 题", done: true },
      { id: "r5t2", text: "每周专项整理", done: false },
    ],
    style: { grad: "grad-blue", icon: "trend", label: "求职", labelColor: "#ff6531" },
  },
];
