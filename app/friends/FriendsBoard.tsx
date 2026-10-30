"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Comments from "../../components/Comments";
import { friendsData } from "../../data/friends";
import { siteConfig } from "../../siteConfig";

export default function FriendsBoard() {
  const [copied, setCopied] = useState(false);
  const copyApplyFormat = async () => {
    await navigator.clipboard.writeText(siteConfig.friendLinkApplyFormat);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-24 sm:px-10 md:pt-28">
      <section className="ayu-page-heading mb-6 text-left">
        <h1 className="text-[28px] font-bold tracking-tight text-[#493d3a]">友链</h1>
        <p className="mt-1.5 max-w-2xl text-[11px] leading-5 text-[#806e69]">那些散落在互联网各处、认真表达和持续创造的人。点击卡片，去他们的小世界坐坐。</p>
      </section>

      <motion.section initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .08 } } }} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {friendsData.map((friend) => <motion.a key={friend.id} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} href={friend.url} target="_blank" rel="noreferrer" className="ayu-glass group relative overflow-hidden rounded-[26px] p-5 transition hover:-translate-y-1">
          <span className="absolute -right-12 -top-12 h-28 w-28 rounded-full opacity-20 blur-2xl transition group-hover:opacity-35" style={{ backgroundColor: friend.themeColor }} />
          <div className="relative flex items-center gap-4"><img src={friend.avatar} alt={friend.name} className="h-14 w-14 rounded-2xl border border-white object-cover shadow-md" /><div className="min-w-0"><h2 className="truncate text-base font-bold text-[#493d3a]">{friend.name}</h2><span className="mt-1 flex items-center gap-1.5 font-mono text-[8px] tracking-widest text-[#b36b73]"><i className="h-1.5 w-1.5 rounded-full bg-[#c8787e] not-italic" />ONLINE</span></div></div>
          <p className="relative mt-5 line-clamp-3 text-xs leading-6 text-[#796864]">{friend.description}</p><span className="relative mt-5 block text-[9px] text-[#ad6069]">访问站点 ↗</span>
        </motion.a>)}
      </motion.section>

      <section className="ayu-glass mx-auto mt-9 max-w-3xl rounded-[30px] p-6 text-center sm:p-9">
        <p className="ayu-kicker">CONNECT WITH ME</p><h2 className="mt-2 text-2xl font-bold text-[#493d3a]">交换友链</h2><p className="mt-3 text-xs leading-6 text-[#806e69]">复制下面的信息，在评论区留下你的名称、简介、链接与头像。</p>
        <div className="relative mx-auto mt-6 max-w-lg rounded-2xl border border-white/85 bg-white/65 p-5 text-left"><pre className="whitespace-pre-wrap pr-12 font-mono text-[10px] leading-6 text-[#705e59]">{siteConfig.friendLinkApplyFormat}</pre><button type="button" onClick={copyApplyFormat} className="absolute right-3 top-3 rounded-xl bg-[#f4ddda]/75 px-3 py-2 text-[9px] text-[#a55f68] transition hover:bg-[#c8787e] hover:text-white">{copied ? "已复制" : "复制"}</button></div>
      </section>

      <section className="mx-auto max-w-3xl"><Comments /></section>
    </main>
  );
}
