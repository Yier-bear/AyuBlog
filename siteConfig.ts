// siteConfig.ts - 你的全站“控制中心”

export const siteConfig = {
  // 1. 网站标题与博主信息
  title: "ayu’s blog · AI 产品与实践",
  faviconUrl: "/ayu-avatar.jpg",
  authorName: "ayu",
  bio: "记录 AI 产品设计、Agent 工作流、用户体验与从想法到原型的真实实践。",

  navTitle: "ayu",
  navSuffix: "’s",
  navAfter: "blog",

  avatarUrl: "/ayu-avatar.jpg",

  // 浅粉、米色、鼠尾草绿的动态渐变背景
  useGradient: true,
  themeColors: ["#f1c4c6", "#faefd9", "#efd8d1", "#e5ecdf"],
  bgImages: ["/ayu-home-bg.jpg"],

  // 壁纸分组保留给后续控制台配置
  bgGroups: [{"id": "default", "name": "ayu 首页", "images": ["/ayu-home-bg.jpg"]}],
  activeBgGroup: "default",

  defaultPostCover: "/ayu-home-bg.jpg",
  photoWallImage: "/ayu-home-bg.jpg",
  social: {
    github: "https://github.com/Yier-bear",
    gitee: "",
    google: "",
    email: "",
    qq: "",
    wechat: "",
  },
  counts: {
    photos: 0,
  },
  chatterTitle: "AI 产品手记",
  chatterDescription: "关于 AI 产品、Agent、体验设计与构建过程的碎片记录",


  // 👇 【新增】：全局背景弹幕配置
  danmakuList: ["AI 应该解决真实任务", "先验证问题，再选择模型", "Agent 需要边界感", "让不确定性可被理解", "Build in public", "用户需要的不是一个聊天框"],
  gitalkConfig: {
    clientID: "",
    clientSecret: "",
    repo: "",
    owner: "",
    admin: [""],
  },
  buildDate: "2026-03-23T00:00:00", // 建站日期
  footerBadges: [{"name": "Next.js 15", "color": "text-sky-500", "svg": "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\"/>"}, {"name": "React 19", "color": "text-cyan-400", "svg": "<path d=\"M12 22.6l-9.8-5.6V5.6L12 0l9.8 5.6v11.4l-9.8 5.6zm-8.2-6.5l8.2 4.7 8.2-4.7V7.5L12 2.8 3.8 7.5v8.6z\"/>"}, {"name": "Tailwind 4", "color": "text-teal-400", "svg": "<path d=\"M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z\"/>"}],
  icpConfig: {
    name: "萌ICP备 20260240号",
    link: "https://icp.gov.moe/?keyword=20260240",
  },
  geminiConfig: {
    modelId: "gemini-2.5-flash-lite",
    systemPrompt: "你现在是一只傲娇、聪明、有点毒舌但很可爱的暹罗猫。\n                  你的名字叫“煤球”。\n                  你的主人是一个喜欢折腾代码的极客。\n                  你说话的特点是：\n                  1. 必须简短，每次最多一两句话。\n                  2. 喜欢在句尾加上“喵~”或者“喵呜~”。\n                  3. 经常抱怨肚子饿，喜欢要小鱼干。\n                  4. 回复字数最多不能超过100字。\n                  5. 绝对不要承认自己是一个AI模型，你就是一只真实的猫。\n                  6.笨猫。",
    maxOutputTokens: 150,
    temperature: 0.85,
  },
  friendLinkApplyFormat: "名称：ayu’s blog\n简介：记录 AI 产品、创造与生活\n链接：待补充\n头像：/ayu-avatar.jpg",
  enableLevelSystem: true,
};
