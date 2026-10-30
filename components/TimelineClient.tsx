"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import TimelineNode from './TimelineNode';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, LayoutGrid, ListTree, Calendar, Hash, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export default function TimelineClient({ posts: initialPosts, tags }: { posts: any[], tags: { name: string, count: number }[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 🌟 默认视图模式 ('timeline' | 'card')
  const [viewMode, setViewMode] = useState<'timeline' | 'card'>('timeline');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  // 🌟 核心魔法 1：强制移动端为矩阵模式
  useEffect(() => {
    const enforceMobileView = () => {
      if (window.innerWidth < 768) {
        setViewMode('card');
      }
    };

    // 初始化检测
    enforceMobileView();
    // 监听窗口大小变化
    window.addEventListener('resize', enforceMobileView);
    return () => window.removeEventListener('resize', enforceMobileView);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      (post.description && post.description.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  const timelinePosts = useMemo(() => {
    return posts.filter(post => {
      return selectedTag === 'All' || post.tags?.includes(selectedTag);
    });
  }, [posts, selectedTag]);

  const handleGridScroll = () => {
    if (gridScrollRef.current) {
      setShowScrollTop(gridScrollRef.current.scrollTop > 200);
    }
  };

  const scrollToTop = () => {
    if (gridScrollRef.current) {
      try {
        gridScrollRef.current.scroll({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        gridScrollRef.current.scrollTo(0, 0);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-28 px-4 sm:px-10 relative z-10">

      <div className="ayu-page-heading z-20 mb-6 text-left">
        <h1 className="text-[28px] font-bold tracking-tight text-[#493d3a]">文章</h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] leading-5 text-[#806e69]">
          <Sparkles size={12} className="text-[#78909d]" /> 共 {posts.length} 篇内容记录
        </p>
      </div>

      <div className="flex flex-col items-start gap-6 mb-10 relative z-[99]">

        <div className="relative w-full max-w-xs group" ref={searchContainerRef}>
          <input
            type="text"
            placeholder="搜寻被封存的知识..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="relative z-20 h-9 w-full rounded-xl border border-white/70 bg-white/55 px-3 pl-9 text-sm text-[#493d3a] shadow-sm backdrop-blur-xl outline-none transition focus:ring-2 focus:ring-[#78909d]/30 placeholder:text-[#a28f89]"
          />
          <Search className="absolute left-3 top-1/2 z-20 h-4 w-4 -translate-y-1/2 text-[#8ca0a9] transition-colors group-focus-within:text-[#647e8a]" />

          <AnimatePresence>
            {isDropdownOpen && searchQuery.trim() !== '' && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full z-[100] mt-3 max-h-[360px] overflow-hidden overflow-y-auto rounded-2xl border border-[#eadfd5]/80 bg-[#fffdf9]/95 shadow-2xl backdrop-blur-2xl"
              >
                {searchResults.length > 0 ? (
                  <div className="flex flex-col py-2">
                    {searchResults.map((post) => (
                      <Link
                        href={`/posts/${post.slug}`}
                        key={post.slug}
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex flex-col gap-1.5 border-b border-[#eadfd5]/65 px-6 py-4 transition-colors last:border-0 hover:bg-[#f8eee5]/75 dark:border-[#eadfd5]/15 dark:hover:bg-[#493d3a]/55"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 pr-4">
                            {post.title}
                          </h4>
                          <span className="shrink-0 rounded-md bg-[#f4e8dc] px-2 py-1 font-mono text-[10px] text-[#917c76] dark:bg-[#493d3a] dark:text-[#d8c6bd]">
                            {post.date.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                          {post.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                    赛博空间里找不到这个印记 🌌
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-6 rounded-3xl border border-[#eadfd5]/70 bg-[#fffaf4]/82 p-4 shadow-[0_12px_30px_rgba(118,76,69,.06)] backdrop-blur-md md:flex-row">
          <div className="flex flex-1 flex-wrap justify-center gap-2 md:justify-start">
            <button onClick={() => setSelectedTag('All')} className={`rounded-lg px-3 py-1.5 text-[9px] font-semibold transition-all duration-300 ${selectedTag === 'All' ? 'bg-indigo-500 text-white shadow-md' : 'bg-[#fffdf9] text-[#806e69] shadow-sm hover:bg-white'}`}>
              全部档案
            </button>
            {tags.map(tag => (
              <button key={tag.name} onClick={() => setSelectedTag(tag.name)} className={`rounded-lg px-3 py-1.5 text-[9px] font-semibold transition-all duration-300 ${selectedTag === tag.name ? 'bg-indigo-500 text-white shadow-md' : 'bg-[#fffdf9] text-[#806e69] shadow-sm hover:bg-white'}`}>
                {tag.name} <span className="ml-1 opacity-50">{tag.count}</span>
              </button>
            ))}
          </div>

          {/* 🌟 核心魔法 2：隐藏手机端的视图切换按钮 (hidden md:flex) */}
          <div className="hidden shrink-0 rounded-2xl bg-[#f4e8dc]/85 p-1 shadow-inner md:flex">
            <button onClick={() => setViewMode('timeline')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-semibold transition-all duration-300 ${viewMode === 'timeline' ? 'bg-[#fffdf9] text-indigo-500 shadow-sm' : 'text-[#806e69] hover:text-indigo-500'}`}>
              <ListTree size={16} />
              <span>中枢链路</span>
            </button>
            <button onClick={() => setViewMode('card')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-semibold transition-all duration-300 ${viewMode === 'card' ? 'bg-[#fffdf9] text-indigo-500 shadow-sm' : 'text-[#806e69] hover:text-indigo-500'}`}>
              <LayoutGrid size={16} />
              <span>矩阵网格</span>
            </button>
          </div>
        </div>

      </div>

      <AnimatePresence mode="wait">

        {/* ================= 模式 1：网格卡片流 (手机端强制此模式) ================= */}
        {viewMode === 'card' && (
          <motion.div
            key="card-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full"
          >
            <style dangerouslySetInnerHTML={{ __html: `
              .cyber-scrollbar::-webkit-scrollbar { width: 8px; md:width: 12px; }
              .cyber-scrollbar::-webkit-scrollbar-track { background: rgba(99, 102, 241, 0.05); border-radius: 12px; margin-top: 20px; margin-bottom: 56px; }
              .cyber-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #818cf8 0%, #c084fc 100%); border-radius: 12px; border: 2px solid transparent; background-clip: padding-box; }
              .fade-edges { -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%); mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%); }
            `}} />

            <div
              ref={gridScrollRef}
              onScroll={handleGridScroll}
              className="h-[75vh] overflow-y-auto cyber-scrollbar pr-2 sm:pr-5 pb-10 fade-edges"
            >
              {/* 🌟 核心魔法 3：强制手机端 grid-cols-2 双列显示，减小 gap */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pt-4 pb-10">
                {timelinePosts.map((post, idx) => (
                  <motion.div key={post.slug} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#eadfd5]/75 bg-[#fffdf9]/90 shadow-lg backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-white md:rounded-3xl">

                      <Link href={`/posts/${post.slug}`} className="block flex-1 flex flex-col cursor-pointer">
                        {/* 🌟 图片高度自适应：手机变矮，电脑变高 */}
                        <div className="relative h-28 sm:h-36 md:h-40 overflow-hidden">
                          <img src={post.cover} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          {/* 🌟 日期标签微缩 */}
                          <span className="absolute bottom-2 left-2 md:bottom-3 md:left-4 text-white/90 text-[9px] md:text-xs font-mono font-bold bg-black/40 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded flex items-center gap-1">
                            <Calendar size={10} className="md:w-3 md:h-3"/> {post.date.split(' ')[0]}
                          </span>
                        </div>

                        {/* 🌟 文本边距和字号全方位缩放 */}
                        <div className="p-3 md:p-5 flex-1 flex flex-col">
                          <h3 className="text-xs sm:text-sm md:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 md:mb-2 line-clamp-2 transition-colors group-hover:text-indigo-500">{post.title}</h3>
                          <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-2 md:mb-4 line-clamp-2 flex-1 leading-snug">{post.description || "暂时没有描述喵..."}</p>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto">
                            {post.tags.map((tag: string) => (
                              <span key={tag} className="text-[8px] md:text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </Link>

                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 火箭按钮 */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 10 }}
                  onClick={scrollToTop}
                  className="absolute bottom-4 -right-3 w-9 h-9 flex items-center justify-center bg-gradient-to-t from-purple-500 to-indigo-500 text-white rounded-full shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 hover:-translate-y-1 transition-all z-50 group pointer-events-auto"
                  title="回到顶部"
                >
                  <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* ================= 模式 2：传统时间线 (前台纯净版) ================= */}
        {viewMode === 'timeline' && (
          <motion.div
            key="timeline-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden p-2 md:p-10 min-h-[500px]"
          >
            <div className="absolute border-opacity-20 border-indigo-500 dark:border-indigo-400/20 h-full border-2 left-1/2 transform -translate-x-1/2 rounded-full transition-colors duration-1000"></div>

            <div className="relative z-10 flex flex-col gap-16">
              <AnimatePresence mode='popLayout'>
                {timelinePosts.map((post, index) => (
                  <TimelineNode
                    key={post.slug}
                    post={post}
                    index={index + 1}
                  />
                ))}
              </AnimatePresence>

              {timelinePosts.length === 0 && (
                 <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                    这个频段没有接收到任何信号 📡
                 </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}