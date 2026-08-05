import type { LinkCard } from "../lib/store";

export const initialLinkCards: LinkCard[] = [
  {
    t: "AI 时代的信息焦虑",
    platform: "抖音",
    link: "https://v.douyin.com/example/",
    points: ["视频讲了信息焦虑的来源", "核心建议：建立信息过滤机制", "把输入先沉淀为笔记，再决定消化优先级"],
  },
  {
    t: "DeepTutor：终身陪伴的个性化 AI 辅导系统（港大开源）",
    platform: "抖音",
    link: "https://www.douyin.com/video/7667183222379302187",
    points: [
      "港大 HKUDS 开源，GitHub 30.2k 星，定位「终身陪伴的 AI 学习辅导师」",
      "代理原生学习工作空间：辅导解题、测验生成、研究可视化、精通练习五模合一",
      "多引擎知识库：跨 LlamaIndex 或关联 Obsidian vault，检索可追溯证据",
      "六大核心能力：连贯学习、专属知识库与精准检索、个性化适配、路径规划、学习输出辅助、高可扩展性",
    ],
  },
];
