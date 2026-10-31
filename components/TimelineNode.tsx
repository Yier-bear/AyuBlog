"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getArticleCategoryStyle } from "./articleCategories";

type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover: string;
};

function parsePostDate(value: string) {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function formatRelativeTime(date: Date) {
  const difference = Date.now() - date.getTime();
  const days = Math.floor(difference / 86_400_000);
  if (days < 1) return "今天";
  if (days < 30) return `${days} 天前`;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function TimelineNode({ post, index }: { post: Post; index: number }) {
  const date = parsePostDate(post.date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = `${date.getMonth() + 1}月`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.16) }}
      className="relative grid grid-cols-[42px_minmax(0,1fr)] gap-[25px] max-sm:block max-sm:pl-5"
    >
      <time className="pt-3 text-right font-mono text-[#917c76] max-sm:hidden" dateTime={post.date}>
        <strong className="block text-sm font-semibold leading-none text-[#6f5c57]">{day}</strong>
        <span className="mt-1 block text-[9px]">{month}</span>
      </time>
      <span className="absolute left-[50px] top-[17px] z-10 h-[9px] w-[9px] rounded-full border-[3px] border-[#fffaf4] bg-[#b77a80] shadow-[0_0_0_1px_rgba(183,122,128,.35)] max-sm:left-[1px]" />

      <Link
        href={`/posts/${post.slug}`}
        className="group block rounded-xl border border-[#eadfd5]/85 bg-[#fffdf9]/94 px-4 pb-3 pt-3.5 shadow-[0_3px_14px_rgba(118,76,69,.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#d5babc] hover:bg-white hover:shadow-[0_8px_24px_rgba(118,76,69,.1)]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => <span key={tag} className={`rounded-md border px-2 py-0.5 text-[9px] font-semibold ${getArticleCategoryStyle(tag).chip}`}># {tag}</span>)}
          </div>
          <time className="shrink-0 font-mono text-[9px] text-[#a08881]" dateTime={post.date}>{formatRelativeTime(date)}</time>
        </div>
        <h2 className="mt-2 text-[13px] font-semibold leading-[1.4] text-[#493d3a] transition group-hover:text-[#8b6469]">{post.title}</h2>
        <p className="mt-1 line-clamp-2 text-[11px] leading-[1.55] text-[#806e69]">{post.description || "继续阅读这篇内容记录。"}</p>
      </Link>
    </motion.article>
  );
}
