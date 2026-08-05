---
title: "DeepTutor：港大开源的个人 AI 学习辅导师"
date: "2026-08-05"
tags: ["AI", "开源", "学习工具"]
summary: "介绍港大 HKUDS 开源的 DeepTutor——终身陪伴的个性化 AI 辅导系统：辅导解题、测验生成、研究可视化、精通练习，支持专属知识库与自托管。"
---

# DeepTutor：港大开源的个人 AI 学习辅导师

最近在抖音看到 THINK AI 推荐了一个「大学生必装」的开源项目，定位是**终身陪伴的 AI 学习辅导师**——香港大学数据智能实验室（HKUDS）开源的 DeepTutor，GitHub 上已经有 30.2k 星。

## 它解决了什么问题

DeepTutor 不是一个简单的问答机器人，而是一个**代理原生（agent-native）的学习工作空间**：辅导、解题、出题、研究、可视化、精通练习跑在同一套引擎上，上下文跟着学习者走，而不是散落在各个孤立工具里。

六大核心能力：

- **五模合一的连贯学习**：Chat / Quiz / Research / Visualize / Mastery Path 无缝切换
- **专属知识库与精准知识检索**：上传教材或论文构建 RAG 知识库，检索结果可追溯
- **细粒度个性化适配**：记忆分三层（L1 轨迹 / L2 摘要 / L3 综合），学习画像可见可编辑
- **引导式学习路径规划**：Mastery Path 学懂一关再进下一关
- **学习输出辅助**：Co-Writer、Book 引擎、Markdown 导出，把输入沉淀为产出
- **高可扩展性**：内置工具、MCP 服务、EduHub 社区技能，也能对接 Claude Code / Codex

## 怎么部署

DeepTutor 支持四种安装方式，最省事的是 PyPI 直接装（Python 3.11–3.13 + Node 20+）：

```bash
pip install -U deeptutor
deeptutor init   # 配置端口、LLM 供应商与模型
deeptutor start  # 启动后端 + 前端，默认 http://127.0.0.1:3782
```

或者用 Docker（镜像 `ghcr.io/hkuds/deeptutor`），一条命令跑起整个 Web 应用。部署好后在设置里填上大模型 API Key（OpenAI / DeepSeek / Gemini 等）就能开始使用。

## 和本站的关系

本站的「AI 辅导」页已经预留了接入位：完成自托管并配置好地址后，就能在博客里直接内嵌使用；部署完成前，也可以先看看学习页里生成的项目摘要卡片和原始视频。

- GitHub：[HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor)
- 官方文档：[deeptutor.info](https://deeptutor.info/)
- 视频来源：[THINK AI《大学生必装的开源项目！》](https://www.douyin.com/video/7667183222379302187)
