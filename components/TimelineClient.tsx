"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import TimelineNode from "./TimelineNode";
import { getArticleCategoryStyle } from "./articleCategories";

type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover: string;
};

type Tag = { name: string; count: number };
type TimelineItem = { kind: "month"; key: string; label: string } | { kind: "post"; post: Post };

function parsePostDate(value: string) {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function buildTimeline(posts: Post[]): TimelineItem[] {
  const items: TimelineItem[] = [];
  let activeMonth = "";

  posts.forEach((post) => {
    const date = parsePostDate(post.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (monthKey !== activeMonth) {
      activeMonth = monthKey;
      items.push({ kind: "month", key: monthKey, label: `${date.getFullYear()} · ${date.getMonth() + 1} 月` });
    }
    items.push({ kind: "post", post });
  });

  return items;
}

export default function TimelineClient({ posts, tags }: { posts: Post[]; tags: Tag[] }) {
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return [...posts]
      .sort((a, b) => parsePostDate(b.date).getTime() - parsePostDate(a.date).getTime())
      .filter((post) => {
        const matchesTag = selectedTag === "All" || post.tags.includes(selectedTag);
        const matchesSearch = !query || [post.title, post.description, ...post.tags].some((value) => value.toLowerCase().includes(query));
        return matchesTag && matchesSearch;
      });
  }, [posts, searchQuery, selectedTag]);

  const timeline = useMemo(() => buildTimeline(filteredPosts), [filteredPosts]);

  return (
    <main className="relative z-10 mx-auto w-full max-w-[896px] px-4 pb-24 pt-24 sm:px-7 sm:pt-28">
      <header className="ayu-page-heading mb-6 text-left">
        <h1 className="text-[28px] font-bold tracking-tight text-[#493d3a]">文章</h1>
        <p className="mt-1.5 text-[11px] leading-5 text-[#806e69]">按发布时间浏览，共 {posts.length} 篇内容记录</p>
      </header>

      <section className="mb-5 rounded-xl border border-[#eadfd5]/80 bg-[#fffdf9]/86 p-3.5 shadow-[0_8px_24px_rgba(118,76,69,.06)] backdrop-blur-xl">
        <div className="relative h-9 w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a28f89]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="搜索标题、摘要或标签"
            className="h-9 w-full rounded-lg border border-[#eadfd5] bg-[#fffdf9] pl-9 pr-3 text-[11px] text-[#493d3a] outline-none transition placeholder:text-[#ac9992] focus:border-[#cdaeb0] focus:ring-2 focus:ring-[#e8cdd2]/35"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedTag("All")}
            className={`rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold transition ${selectedTag === "All" ? "border-[#a9888d] bg-[#a9888d] text-white shadow-sm" : "border-[#eadfd5]/75 bg-[#fffaf4]/85 text-[#806e69] hover:bg-white"}`}
          >
            全部 <span className="ml-1 opacity-65">{posts.length}</span>
          </button>
          {tags.map((tag) => (
            <button
              type="button"
              key={tag.name}
              onClick={() => setSelectedTag(tag.name)}
              className={`rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold transition ${selectedTag === tag.name ? getArticleCategoryStyle(tag.name).active : getArticleCategoryStyle(tag.name).filter}`}
            >
              # {tag.name} <span className="ml-1 opacity-65">{tag.count}</span>
            </button>
          ))}
        </div>
      </section>

      {timeline.length > 0 ? (
        <section className="relative space-y-3 before:absolute before:bottom-4 before:left-[54px] before:top-10 before:w-px before:bg-[#d9c2bd]/70 max-sm:before:left-[5px]" aria-label="文章时间线">
          {timeline.map((item, index) => item.kind === "month" ? (
            <div key={item.key} className="relative z-10 py-2 pl-[68px] font-mono text-[10px] font-semibold tracking-[.13em] text-[#9a7679] max-sm:pl-5">
              {item.label}
            </div>
          ) : (
            <TimelineNode key={item.post.slug} post={item.post} index={index} />
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-[#eadfd5]/80 bg-[#fffdf9]/90 px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#6f5c57]">没有找到符合条件的文章</p>
          <p className="mt-2 text-[11px] text-[#9a847e]">换一个关键词或标签再试试。</p>
        </div>
      )}
    </main>
  );
}
