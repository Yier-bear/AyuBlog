"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type SearchPost = { slug: string; title: string; description: string };

const phrases = [
  "不破不立",
  "穷则独善其身，达则兼善天下",
  "做难而正确的事",
  "慢一点想，快一点做",
  "模型是工具，判断是人",
];

export default function HomeHero({ posts }: { posts: SearchPost[] }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % phrases.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];
    return posts.filter((post) => `${post.title} ${post.description}`.toLowerCase().includes(keyword)).slice(0, 5);
  }, [posts, query]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (results[0]) window.location.href = `/posts/${results[0].slug}`;
  };

  return (
    <header className="ayu-home-cover relative flex min-h-[560px] w-full items-center justify-center overflow-hidden sm:min-h-[660px]">
      <img src="/ayu-home-bg.jpg" alt="ayu’s blog 首页封面" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[#493532]/28" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_5%,rgba(47,31,29,.32)_100%)]" />

      <div className="relative z-10 mx-auto mt-8 flex w-full max-w-6xl flex-col items-center px-4 text-center text-white sm:mt-12 sm:px-6">
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }} className="ayu-cover-title whitespace-nowrap text-[clamp(1.65rem,5vw,4rem)] font-black leading-none tracking-[.025em] drop-shadow-[0_4px_18px_rgba(0,0,0,.35)]">
          No breaking, no making.
        </motion.h1>
        <div className="mt-6 flex h-10 w-full items-center justify-center overflow-hidden sm:h-12">
          <AnimatePresence mode="wait">
            <motion.p key={phraseIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10, filter: "blur(6px)" }} transition={{ duration: .35 }} className="ayu-cover-copy flex items-center justify-center whitespace-nowrap text-sm font-medium tracking-[.12em] text-white/90 drop-shadow-md sm:text-lg sm:tracking-[.2em]">
              {Array.from(phrases[phraseIndex]).map((character, index) => (
                <motion.span
                  key={`${phraseIndex}-${index}`}
                  initial={{ opacity: 0, y: 14, scale: .72 }}
                  animate={{ opacity: 1, y: [14, -5, 0], scale: [0.72, 1.12, 1] }}
                  transition={{ delay: index * .075, duration: .42, times: [0, .68, 1], ease: "easeOut" }}
                  className="inline-block"
                >
                  {character === " " ? "\u00A0" : character}
                </motion.span>
              ))}
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: .8, repeat: Infinity }} className="ml-1 inline-block h-[1.05em] w-px bg-white/80" aria-hidden="true" />
            </motion.p>
          </AnimatePresence>
        </div>
        <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .45, duration: 1 }} className="mt-2 h-px w-20 origin-center bg-white/65" />
      </div>

      <div className="ayu-cover-transition absolute inset-x-0 bottom-0 h-44 sm:h-56" aria-hidden="true" />
      <div className="ayu-waves absolute inset-x-0 bottom-0 h-32 overflow-hidden sm:h-40" aria-hidden="true">
        <svg className="ayu-wave ayu-wave-back absolute bottom-0 h-full w-[200%]" viewBox="0 0 2880 180" preserveAspectRatio="none"><path d="M0,112 C240,42 480,172 720,104 C960,36 1200,160 1440,96 C1680,32 1920,158 2160,98 C2400,38 2640,154 2880,88 L2880,180 L0,180 Z" fill="rgba(250,239,217,.72)" /></svg>
        <svg className="ayu-wave ayu-wave-front absolute bottom-0 h-[82%] w-[200%]" viewBox="0 0 2880 150" preserveAspectRatio="none"><path d="M0,86 C260,146 480,32 740,92 C1000,152 1220,42 1440,94 C1680,150 1900,38 2180,90 C2440,140 2650,48 2880,82 L2880,150 L0,150 Z" fill="#f8ebe6" /></svg>
      </div>

      <div className="absolute bottom-7 left-1/2 z-30 w-[calc(100%-32px)] max-w-xl -translate-x-1/2 sm:bottom-9">
        <form onSubmit={submitSearch} className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-[#a06d70]" aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 150)} className="h-13 w-full rounded-full border border-white/90 bg-white/78 px-12 pr-24 text-xs text-[#584946] shadow-[0_16px_45px_rgba(91,58,54,.18)] outline-none backdrop-blur-2xl transition placeholder:text-[#a58e88] focus:bg-white/90 focus:ring-4 focus:ring-[#e6bfc0]/25 sm:h-14 sm:text-sm" placeholder="搜索文章、想法或关键词…" aria-label="搜索文章" />
          <button type="submit" disabled={!results.length} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#c8787e] px-4 py-2 text-[9px] text-white transition hover:bg-[#ad6069] disabled:cursor-default disabled:opacity-45">搜索</button>
        </form>
        <AnimatePresence>
          {focused && query.trim() && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute bottom-full left-0 right-0 mb-3 overflow-hidden rounded-[22px] border border-white/90 bg-[#fffdf9]/92 p-2 shadow-2xl backdrop-blur-2xl">
            {results.length ? results.map((post) => <Link key={post.slug} href={`/posts/${post.slug}`} className="block rounded-2xl px-4 py-3 text-left transition hover:bg-[#f7e5e1]/65"><strong className="block truncate text-xs text-[#554642]">{post.title}</strong><span className="mt-1 block truncate text-[9px] text-[#947e78]">{post.description || "打开文章查看完整内容"}</span></Link>) : <p className="px-4 py-5 text-center text-[10px] text-[#947e78]">还没有找到相关记录，换个关键词试试。</p>}
          </motion.div>}
        </AnimatePresence>
      </div>
    </header>
  );
}
