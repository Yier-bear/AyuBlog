export const ARTICLE_CATEGORIES = ["AI 产品", "Agent", "Design", "求职"] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

const categoryStyles: Record<ArticleCategory, { chip: string; filter: string; active: string }> = {
  "AI 产品": {
    chip: "border-[#e5b9bd] bg-[#f9e8e8] text-[#9a5f67]",
    filter: "border-[#e5b9bd] bg-[#fff8f7] text-[#9a5f67] hover:bg-[#f9e8e8]",
    active: "border-[#b9777e] bg-[#b9777e] text-white shadow-sm",
  },
  Agent: {
    chip: "border-[#b8cbd3] bg-[#e8f0f3] text-[#5f7d89]",
    filter: "border-[#b8cbd3] bg-[#f6fafb] text-[#5f7d89] hover:bg-[#e8f0f3]",
    active: "border-[#718f9b] bg-[#718f9b] text-white shadow-sm",
  },
  Design: {
    chip: "border-[#bdcdbb] bg-[#eaf1e7] text-[#617b61]",
    filter: "border-[#bdcdbb] bg-[#f7faf5] text-[#617b61] hover:bg-[#eaf1e7]",
    active: "border-[#789078] bg-[#789078] text-white shadow-sm",
  },
  "求职": {
    chip: "border-[#ddc7a2] bg-[#f7eedc] text-[#8b7046]",
    filter: "border-[#ddc7a2] bg-[#fffaf0] text-[#8b7046] hover:bg-[#f7eedc]",
    active: "border-[#a98a58] bg-[#a98a58] text-white shadow-sm",
  },
};

export function isArticleCategory(value: string): value is ArticleCategory {
  return ARTICLE_CATEGORIES.includes(value as ArticleCategory);
}

export function normalizeArticleCategories(values: unknown): ArticleCategory[] {
  if (!Array.isArray(values)) return [];
  return values.map(String).filter(isArticleCategory);
}

export function getArticleCategoryStyle(value: string) {
  return isArticleCategory(value)
    ? categoryStyles[value]
    : {
        chip: "border-[#eadfd5] bg-[#f8eee5] text-[#806e69]",
        filter: "border-[#eadfd5] bg-[#fffaf4] text-[#806e69] hover:bg-white",
        active: "border-[#a9888d] bg-[#a9888d] text-white shadow-sm",
      };
}
