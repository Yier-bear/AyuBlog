"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownAZ, ArrowUpZA, MessageCircle, X } from "lucide-react";
import Comments from "../../components/Comments";
import { siteConfig } from "../../siteConfig";

type Chatter = {
  slug: string;
  title: string;
  date: string;
  mood?: string;
  cover?: string;
  content: string;
};

type SortOrder = "desc" | "asc";

const noteStyles = [
  "border-[#e9c8c5] bg-[#fff3ef]",
  "border-[#d9d1a8] bg-[#fff9d9]",
  "border-[#bfcfca] bg-[#eef7f1]",
  "border-[#c8c8df] bg-[#f2f1fb]",
  "border-[#d8c4ad] bg-[#fbf1e5]",
  "border-[#c8d4df] bg-[#eef5fa]",
];

const noteRotations = ["md:-rotate-[1.2deg]", "md:rotate-[0.8deg]", "md:-rotate-[0.5deg]", "md:rotate-[1.1deg]"];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function extractTextPreview(content: string, sentenceCount = 3) {
  const text = content.replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*\]\([^)]+\)/g, " ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^>\s?/gm, "").replace(/[*_~`]/g, "").replace(/\s+/g, " ").trim();
  return (text.match(/[^。！？!?；;]+[。！？!?；;]?/g) || [text]).slice(0, sentenceCount).join("").trim().slice(0, 140);
}

function NoteContent({ content }: { content: string }) {
  return (
    <div className="space-y-4 text-[13px] leading-7 text-[#5e504c] sm:text-sm">
      {content.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => {
        const value = paragraph.trim();
        if (value.startsWith(">")) {
          return <blockquote key={index} className="border-l-2 border-[#c89da0] bg-white/45 px-4 py-3 italic text-[#806e69]">{value.replace(/^>\s?/, "")}</blockquote>;
        }
        return <p key={index} className="whitespace-pre-wrap">{value}</p>;
      })}
    </div>
  );
}

export default function ChatterBoard({ chatters }: { chatters: Chatter[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedChatter, setSelectedChatter] = useState<Chatter | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const sortedChatters = useMemo(() => [...chatters].sort((a, b) => {
    const difference = new Date(b.date).getTime() - new Date(a.date).getTime();
    return sortOrder === "desc" ? difference : -difference;
  }), [chatters, sortOrder]);

  useEffect(() => {
    if (!selectedChatter) return;
    const previousOverflow = document.body.style.overflow;
    const navbar = document.querySelector<HTMLElement>("header");
    const previousNavbarVisibility = navbar?.style.visibility || "";
    document.body.style.overflow = "hidden";
    if (navbar) navbar.style.visibility = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedChatter(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (navbar) navbar.style.visibility = previousNavbarVisibility;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedChatter]);

  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-20 pt-24 sm:px-10 md:pt-28">
      <div className="ayu-page-heading mb-6 text-left">
        <h1 className="text-[28px] font-bold tracking-tight text-[#493d3a]">产品手记</h1>
        <p className="mt-1.5 text-[11px] leading-5 text-[#806e69]">
          {siteConfig.chatterDescription || "日常碎片与灵感记录"}
        </p>
      </div>

      <div className="mb-8 inline-flex rounded-xl border border-[#eadfd5]/80 bg-[#fffaf4]/88 p-1 shadow-sm">
        <button type="button" onClick={() => setSortOrder("desc")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-semibold transition ${sortOrder === "desc" ? "bg-[#a9888d] text-white shadow-sm" : "text-[#806e69] hover:bg-white"}`}>
          <ArrowDownAZ size={12} /> 最新
        </button>
        <button type="button" onClick={() => setSortOrder("asc")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-semibold transition ${sortOrder === "asc" ? "bg-[#a9888d] text-white shadow-sm" : "text-[#806e69] hover:bg-white"}`}>
          <ArrowUpZA size={12} /> 最早
        </button>
      </div>

      {sortedChatters.length > 0 ? (
        <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {sortedChatters.map((chatter, index) => (
              <motion.button
                layout
                type="button"
                key={chatter.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                onClick={() => setSelectedChatter(chatter)}
                className={`group relative min-h-48 overflow-hidden border p-4 text-left shadow-[0_8px_20px_rgba(118,76,69,.08)] transition duration-300 hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_18px_38px_rgba(118,76,69,.15)] sm:min-h-56 sm:p-5 ${noteStyles[index % noteStyles.length]} ${noteRotations[index % noteRotations.length]}`}
                aria-label={`打开手记：${chatter.title}`}
              >
                <span className="absolute left-1/2 top-0 h-5 w-14 -translate-x-1/2 -translate-y-1/3 rotate-[-2deg] bg-white/55 shadow-sm" aria-hidden="true" />
                <time className="font-mono text-[9px] tracking-[.08em] text-[#9a847e]" dateTime={chatter.date}>{formatDate(chatter.date)}</time>
                <h2 className="mt-3 line-clamp-3 text-[15px] font-bold leading-6 text-[#493d3a] sm:text-base">{chatter.title}</h2>
                <p className="mt-2 line-clamp-2 text-[10px] leading-5 text-[#806e69] sm:text-[11px]">{extractTextPreview(chatter.content)}</p>
                <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-[9px] text-[#9a847e] sm:inset-x-5">
                  <span>{chatter.mood || "随手记"}</span>
                  <span className="inline-flex items-center gap-1 opacity-0 transition group-hover:opacity-100"><MessageCircle size={11} /> 展开</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-[#eadfd5]/80 bg-[#fffdf9]/90 px-6 py-16 text-center text-sm text-[#806e69]">第一张产品便签正在路上。</div>
      )}

      <AnimatePresence>
        {selectedChatter && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#493d3a]/45 p-4 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedChatter(null);
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="chatter-dialog-title"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.24 }}
              className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] border border-white/80 bg-[#fffdf9] shadow-[0_28px_90px_rgba(63,42,38,.28)] sm:max-h-[calc(100vh-3rem)] sm:rounded-[28px]"
            >
              <div className="shrink-0 border-b border-dashed border-[#d9c2bd]/75 bg-[#fff8e8] px-5 py-5 sm:px-8 sm:py-6">
                <button ref={closeButtonRef} type="button" onClick={() => setSelectedChatter(null)} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/75 text-[#806e69] shadow-sm transition hover:bg-white hover:text-[#493d3a]" aria-label="关闭手记">
                  <X size={16} />
                </button>
                <time className="font-mono text-[9px] tracking-[.1em] text-[#9a847e]" dateTime={selectedChatter.date}>{formatDate(selectedChatter.date)}</time>
                <h2 id="chatter-dialog-title" className="mt-2 pr-10 text-xl font-bold leading-8 text-[#493d3a] sm:text-2xl">{selectedChatter.title}</h2>
                {selectedChatter.mood && <p className="mt-1.5 text-[10px] text-[#9a7679]">{selectedChatter.mood}</p>}
              </div>

              <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
                <NoteContent content={selectedChatter.content} />
                <section className="mt-8 border-t border-dashed border-[#d9c2bd]/75 pt-6" aria-label="手记评论与回复">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={15} className="text-[#a06f75]" />
                    <h3 className="text-sm font-semibold text-[#493d3a]">评论与回复</h3>
                  </div>
                  <Comments compact pageId={`/chatter/${selectedChatter.slug}`} />
                </section>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
