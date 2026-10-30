export type AiDailyReport = {
  slug: string;
  date: string;
  project: string;
  tagline: string;
  summary: string[];
  whyItMatters: string[];
  productQuestions: string[];
  githubUrl: string;
  tags: string[];
};

export const aiDailyReports: AiDailyReport[] = [
  {
    slug: "2026-10-28-langfuse",
    date: "2026-10-28",
    project: "Langfuse",
    tagline: "把 LLM 的调用、评估、提示词与成本放进一个可运营的产品闭环。",
    summary: [
      "Langfuse 是开源的 AI 工程平台，覆盖 LLM 可观测、评估、指标和提示词管理。",
      "它能把一次 AI 回答拆成可追踪的调用链，帮助团队理解延迟、成本和失败位置。",
      "对 AI 产品经理来说，它的价值不是多一个技术面板，而是让体验问题有可复盘的数据证据。",
      "项目支持自托管，也提供与 OpenTelemetry、LangChain、OpenAI SDK 等常见工具的集成。",
    ],
    whyItMatters: [
      "AI 产品上线后，传统埋点只能看到用户点了什么，却很难说明模型为什么给出当前结果。",
      "可观测与评估系统把提示词版本、模型参数、上下文、用户反馈和输出质量关联起来，让迭代从感觉驱动转向证据驱动。",
      "它也提醒产品团队：评估不是上线前的一次考试，而应成为持续运营能力。",
    ],
    productQuestions: [
      "你的核心 AI 任务应该用什么指标衡量，而不只是看模型调用成功率？",
      "一次差评能否回溯到具体提示词、上下文与模型版本？",
      "成本、延迟和回答质量之间，产品允许用户做怎样的取舍？",
    ],
    githubUrl: "https://github.com/langfuse/langfuse",
    tags: ["LLM Evals", "Observability", "Prompt Management"],
  },
];

export const latestAiDailyReport = aiDailyReports[0];
