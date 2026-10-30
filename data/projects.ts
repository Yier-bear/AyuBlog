export type Project = {
  id: string;
  name: string;
  description: string;
  icon: string;
  githubUrl: string;
  tags: string[];
};

export const projectsData: Project[] = [
  { id: "ayu-ai-workbench", name: "AI 产品工作台", description: "将需求洞察、Prompt 实验、原型验证和用户反馈组织在同一个 AI 产品工作流中。", icon: "✦", githubUrl: "https://github.com/Yier-bear", tags: ["AI Product", "Workflow", "UX"] },
  { id: "toc-community", name: "TOC 产品社区", description: "面向产品人和创作者的开放想法社区，让不完整的产品判断也能被公开讨论和继续生长。", icon: "◌", githubUrl: "https://github.com/Yier-bear", tags: ["Community", "Content", "Product"] },
  { id: "agent-research", name: "Agent 体验研究", description: "围绕授权、过程反馈、失败恢复与信任，整理 Agent 产品的交互模式和评估框架。", icon: "◒", githubUrl: "https://github.com/Yier-bear", tags: ["Agent", "Research", "AI UX"] },
  { id: "interview-notes", name: "产品面经整理器", description: "按能力模型沉淀案例、问题和复盘，让面试准备从背答案变成组织自己的产品判断。", icon: "⌁", githubUrl: "https://github.com/Yier-bear", tags: ["Knowledge", "Career", "Prototype"] },
];
