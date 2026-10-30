"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../../siteConfig';

type Chatter = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  mood?: string;
  cover?: string;
  content: string;
};

export default function ChatterBoard({ chatters }: { chatters: Chatter[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("全部");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    chatters.forEach(c => c.tags?.forEach(t => tags.add(t)));
    return ["全部", ...Array.from(tags)];
  }, [chatters]);

  const filteredChatters = useMemo(() => {
    if (searchQuery.length > 0 && searchQuery.trim() === "") return [];
    const query = searchQuery.trim().toLowerCase();

    return chatters.filter(chatter => {
      const matchSearch = chatter.title.toLowerCase().includes(query) ||
                          chatter.content.toLowerCase().includes(query);
      const matchTag = activeTag === "全部" || chatter.tags?.includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [chatters, searchQuery, activeTag]);

  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 pt-24 sm:px-10 md:pt-28">

      <div className="ayu-page-heading mb-6 text-left">
        <h1 className="text-[28px] font-bold tracking-tight text-[#493d3a]">产品手记</h1>
        <p className="mt-1.5 text-[11px] leading-5 text-[#806e69]">
          {siteConfig.chatterDescription || "日常碎片与灵感记录"}
        </p>
      </div>

      <div className="mb-10 flex flex-col items-start gap-5">
        <div className="relative w-full max-w-xs group">
          {/* 🌟 核心修改：搜索框在手机端更扁凑 */}
          <input
            type="text"
            placeholder="搜寻被遗忘的思绪..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-white/70 bg-white/55 px-3 pl-9 text-sm text-[#493d3a] shadow-sm backdrop-blur-xl outline-none transition focus:ring-2 focus:ring-[#78909d]/30 placeholder:text-[#a28f89]"
          />
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ca0a9] transition-colors group-focus-within:text-[#647e8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 px-2 md:px-0">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold transition-all duration-500 ${
                activeTag === tag 
                ? 'bg-indigo-500 text-white border-indigo-500 shadow-md md:shadow-lg md:shadow-indigo-500/30 scale-105' 
                : 'border-[#eadfd5]/75 bg-[#fffaf4]/85 text-[#806e69] hover:bg-[#fffdf9]'
              }`}
            >
              {tag === "全部" ? tag : `# ${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 核心修改 1：瀑布流直接设定为 columns-2，减小间距 gap-3 */}
      <motion.div layout className="columns-2 lg:columns-3 gap-3 md:gap-6 space-y-3 md:space-y-6">
        <AnimatePresence mode='popLayout'>
          {filteredChatters.map((chatter) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={chatter.slug}
              className="break-inside-avoid"
            >
              {/* 🌟 核心修改 2：卡片圆角缩小 rounded-2xl */}
              <Link
                href={`/chatter/${chatter.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-[#eadfd5]/75 bg-[#fffdf9]/90 shadow-md backdrop-blur-2xl transition-all duration-500 hover:bg-white hover:shadow-2xl md:rounded-[32px] md:shadow-xl"
              >
                {chatter.cover && (
                  // 🌟 核心修改 3：图片高度自适应 h-28 -> h-52
                  <div className="w-full h-28 md:h-52 overflow-hidden relative">
                    <img src={chatter.cover} alt="cover" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                    {/* 🌟 核心修改 4：心情徽章微缩 */}
                    {chatter.mood && (
                      <span className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/20 backdrop-blur-md text-white text-[8px] md:text-[10px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm border border-white/20 uppercase tracking-widest">
                        ✨ {chatter.mood}
                      </span>
                    )}
                  </div>
                )}

                {/* 🌟 核心修改 5：内部 padding 极致压缩 p-3 md:p-7 */}
                <div className="p-3 md:p-7">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="text-[8px] md:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider md:tracking-[0.2em] bg-indigo-500/5 dark:bg-indigo-400/10 px-1.5 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg border border-indigo-500/10">
                      {chatter.date}
                    </div>
                    {/* 心情展示 - 无封面版 */}
                    {!chatter.cover && chatter.mood && (
                      <div className="text-[8px] md:text-[10px] font-black text-pink-600 dark:text-pink-400 bg-pink-500/5 dark:bg-pink-400/10 px-1.5 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg border border-pink-500/10">
                        {chatter.mood}
                      </div>
                    )}
                  </div>

                  {chatter.title && (
                    // 🌟 核心修改 6：标题压缩 text-sm md:text-xl
                    <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-tight text-[#493d3a] transition-colors group-hover:text-indigo-600 md:mb-4 md:text-xl md:line-clamp-none">{chatter.title}</h3>
                  )}

                  {/* 🌟 核心修改 7：正文压缩，限制行数 */}
                  <div className="line-clamp-4 text-[10px] font-medium italic leading-snug text-[#806e69] opacity-90 md:line-clamp-5 md:text-sm md:leading-relaxed">
                    {chatter.content}
                  </div>

                  {/* 🌟 核心修改 8：底部标签微缩 */}
                  {chatter.tags && chatter.tags.length > 0 && (
                    <div className="mt-3 md:mt-6 flex flex-wrap gap-1 md:gap-2">
                      {chatter.tags.map(t => (
                        <span key={t} className="rounded-md border border-[#eadfd5]/80 bg-[#f8eee5]/85 px-1.5 py-0.5 text-[8px] font-black text-[#806e69] transition-all group-hover:bg-indigo-500/10 group-hover:text-indigo-500 md:px-2.5 md:py-1 md:text-[9px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}