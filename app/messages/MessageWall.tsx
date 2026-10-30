"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Feather, Pin, Send, Sparkles } from "lucide-react";

type Message = {
  id: string;
  name: string;
  website: string;
  content: string;
  date: string;
  tone: number;
  pinned?: boolean;
};

type Feedback = { type: "success" | "error"; text: string } | null;

const STORAGE_KEY = "ayu-message-wall";
const DRAFT_KEY = "ayu-message-wall-draft";

const seedMessages: Message[] = [
  { id: "welcome", name: "ayu", website: "", content: "欢迎来到这里。愿我们都多多记录，用具体的感受对抗遗忘。", date: "置顶留言", tone: 0, pinned: true },
  { id: "one", name: "路过的产品人", website: "", content: "很喜欢这里轻轻的颜色，也期待看到更多 AI 产品实践。", date: "2026.10.24 · 20:16", tone: 1 },
  { id: "two", name: "匿名", website: "", content: "今天也要把还没想完整的事情写下来。", date: "2026.10.20 · 09:42", tone: 2 },
  { id: "three", name: "Mia", website: "https://github.com", content: "记录不是为了证明什么，是为了看见自己走过的路。", date: "2026.10.16 · 22:08", tone: 3 },
  { id: "four", name: "小满", website: "", content: "路过的时候刚好听见一首喜欢的歌。希望下次再来时，这里又多了一些新的故事。", date: "2026.10.12 · 17:35", tone: 4 },
  { id: "five", name: "Nori", website: "", content: "做产品也是在收集生活里那些很小、但确实存在的不方便。", date: "2026.10.08 · 11:26", tone: 5 },
];

const noteStyles = [
  {
    paper: "bg-[#f7dfd8]",
    rotate: "lg:-rotate-[1.2deg]",
    accent: "#b9777e",
    decoration: "tape",
    handwriting: '"HanziPen SC", "STKaiti", "KaiTi", cursive',
    writing: "text-[14px] tracking-[.035em]",
    texture: "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.35)_0_1px,transparent_1.5px)] bg-[length:9px_9px]",
  },
  {
    paper: "bg-[#f4e8c7]",
    rotate: "lg:rotate-[.8deg]",
    accent: "#9d815f",
    decoration: "pin",
    handwriting: '"FZKai-Z03", "Kaiti SC", "STKaiti", serif',
    writing: "text-[13px] tracking-[.02em]",
    texture: "bg-[linear-gradient(rgba(141,112,75,.08)_1px,transparent_1px)] bg-[length:100%_25px]",
  },
  {
    paper: "bg-[#dfe8df]",
    rotate: "lg:-rotate-[.5deg]",
    accent: "#718474",
    decoration: "sticker",
    handwriting: '"Xingkai SC", "STXingkai", "KaiTi", cursive',
    writing: "text-[15px] tracking-[.025em]",
    texture: "bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.32),transparent_72%)]",
  },
  {
    paper: "bg-[#e2e8eb]",
    rotate: "lg:rotate-[1.1deg]",
    accent: "#6f858f",
    decoration: "clip",
    handwriting: '"Songti SC", "STSong", var(--font-serif), serif',
    writing: "text-[13px] tracking-[.06em]",
    texture: "bg-[linear-gradient(90deg,rgba(105,129,140,.06)_1px,transparent_1px),linear-gradient(rgba(105,129,140,.06)_1px,transparent_1px)] bg-[length:18px_18px]",
  },
  {
    paper: "bg-[#eadfe6]",
    rotate: "lg:-rotate-[.9deg]",
    accent: "#8d7485",
    decoration: "stamp",
    handwriting: '"Yuanti SC", "STYuanti-SC-Regular", "HanziPen SC", sans-serif',
    writing: "text-[13px] tracking-[.04em]",
    texture: "bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,.4),transparent_38%)]",
  },
  {
    paper: "bg-[#f2e5d8]",
    rotate: "lg:rotate-[.45deg]",
    accent: "#937867",
    decoration: "torn",
    handwriting: '"STKaiti", "KaiTi", var(--font-serif), cursive',
    writing: "text-[14px] tracking-[.01em] italic",
    texture: "bg-[linear-gradient(135deg,rgba(255,255,255,.24),transparent_55%)]",
  },
];

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.name === "string" && typeof item.website === "string" && typeof item.content === "string" && typeof item.date === "string" && typeof item.tone === "number";
}

function safeWebsite(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function NoteDecoration({ type }: { type: string }) {
  if (type === "pin") return <><span aria-hidden="true" className="absolute left-1/2 top-3 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#a85f67] shadow-[0_2px_3px_rgba(84,47,43,.35),inset_1px_1px_2px_rgba(255,255,255,.55)]" /><span aria-hidden="true" className="absolute left-1/2 top-5 h-4 w-px -translate-x-1/2 bg-[#79544e]/25" /></>;
  if (type === "sticker") return <span aria-hidden="true" className="absolute right-4 top-3 grid h-9 w-9 rotate-12 place-items-center rounded-[45%_55%_50%_50%] border-2 border-white/80 bg-[#f3c8c4] text-[13px] shadow-sm">✿</span>;
  if (type === "clip") return <span aria-hidden="true" className="absolute right-7 -top-2 h-12 w-4 rotate-[8deg] rounded-full border-2 border-[#9a9086]/65 border-b-transparent shadow-[1px_1px_2px_rgba(71,64,60,.14)]" />;
  if (type === "stamp") return <><span aria-hidden="true" className="absolute right-4 top-4 rotate-[-11deg] rounded-full border border-dashed border-[#9a6f82]/45 px-2 py-1 font-mono text-[7px] tracking-widest text-[#9a6f82]/55">AYU NOTE</span><span aria-hidden="true" className="absolute left-5 top-2 h-5 w-14 rotate-6 bg-[#d5c4dc]/55" /></>;
  if (type === "torn") return <><span aria-hidden="true" className="absolute left-7 top-0 h-7 w-16 -translate-y-3 rotate-[-6deg] bg-[#cbd7c7]/62 shadow-sm" /><span aria-hidden="true" className="absolute inset-x-0 bottom-[-5px] h-3 bg-[linear-gradient(135deg,transparent_6px,#f2e5d8_0)_0_0/12px_12px_repeat-x" /></>;
  return <><span aria-hidden="true" className="absolute left-1/2 top-0 h-7 w-20 -translate-x-1/2 -translate-y-3 rotate-[-3deg] bg-[#e9c7bc]/72 shadow-[0_2px_4px_rgba(116,80,70,.08)] backdrop-blur-[1px]" /><span aria-hidden="true" className="absolute right-5 top-5 text-[12px] opacity-35">✦</span></>;
}

export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [content, setContent] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    const hydrate = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const valid = Array.isArray(saved) ? saved.filter(isMessage) : [];
        setMessages([...seedMessages.filter((item) => item.pinned), ...valid, ...seedMessages.filter((item) => !item.pinned)]);
      } catch {
        setMessages(seedMessages);
      }
    };
    hydrate();
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (draft && typeof draft === "object") {
        setName(typeof draft.name === "string" ? draft.name : "");
        setWebsite(typeof draft.website === "string" ? draft.website : "");
        setContent(typeof draft.content === "string" ? draft.content.slice(0, 200) : "");
      }
    } catch { /* 忽略无效草稿 */ }
    const sync = (event: StorageEvent) => event.key === STORAGE_KEY && hydrate();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ name, website, content })); } catch { /* 私密模式下允许继续输入 */ }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [name, website, content]);

  const visibleMessages = useMemo(() => showAll ? messages : messages.slice(0, 8), [messages, showAll]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = content.trim();
    const normalizedWebsite = safeWebsite(website.trim());
    if (!text) return setFeedback({ type: "error", text: "先写下一点想说的话吧。" });
    if (text.length > 200) return setFeedback({ type: "error", text: "便签最多可以写 200 个字。" });
    if (website.trim() && !normalizedWebsite) return setFeedback({ type: "error", text: "个人主页需要以 http:// 或 https:// 开头。" });

    const now = new Date();
    const message: Message = {
      id: now.getTime().toString(),
      name: name.trim() || "匿名",
      website: normalizedWebsite,
      content: text,
      date: `${new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(now)} · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      tone: now.getTime() % noteStyles.length,
    };

    try {
      const customMessages = [message, ...messages.filter((item) => !seedMessages.some((seed) => seed.id === item.id))];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customMessages));
      localStorage.removeItem(DRAFT_KEY);
      setMessages((current) => [current.find((item) => item.pinned)!, message, ...current.filter((item) => !item.pinned)]);
      setName("");
      setWebsite("");
      setContent("");
      setFeedback({ type: "success", text: "便签已经钉好，并保存在这台设备上。" });
      window.setTimeout(() => setFeedback(null), 3500);
    } catch {
      setFeedback({ type: "error", text: "暂时没能保存便签，请检查浏览器存储权限后重试。" });
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-24 sm:px-10 md:pt-28">
      <header className="ayu-page-heading mb-10 text-left">
        <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[.18em] text-[#856d72]"><Sparkles size={11} /> VISITOR NOTES</div>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#493d3a]">留言墙</h1>
        <p className="mt-1.5 max-w-xl text-[11px] leading-5 text-[#806e69]">把路过时的一点心情写下来。每一张纸，都会保留相遇时不同的温度。</p>
      </header>

      <section aria-label="留言便签" className="relative isolate overflow-hidden border border-[#d8d2c8]/75 bg-[#f3f1eb] px-4 pb-14 pt-12 shadow-[inset_0_1px_18px_rgba(101,89,74,.08),0_24px_55px_rgba(101,77,65,.10)] sm:px-7 sm:pt-14 lg:px-9">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,.95),transparent_32%),radial-gradient(circle_at_82%_70%,rgba(213,207,195,.23),transparent_42%),linear-gradient(108deg,transparent_0_48%,rgba(121,109,91,.035)_49%,transparent_50%)]" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-55 [background-image:radial-gradient(rgba(100,89,72,.16)_.45px,transparent_.55px)] [background-size:5px_5px]" />
        <span aria-hidden="true" className="pointer-events-none absolute left-8 top-6 h-3 w-3 rounded-full bg-[#ddd7cd] shadow-[inset_1px_1px_2px_rgba(83,72,60,.22),1px_1px_0_white]" />
        <span aria-hidden="true" className="pointer-events-none absolute right-8 top-7 h-3 w-3 rounded-full bg-[#ddd7cd] shadow-[inset_1px_1px_2px_rgba(83,72,60,.22),1px_1px_0_white]" />
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          <AnimatePresence initial={false}>
            {visibleMessages.map((message, index) => {
              const style = noteStyles[Math.abs(message.tone) % noteStyles.length];
            return (
              <motion.article
                layout
                key={message.id}
                initial={{ opacity: 0, y: 16, rotate: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: .96 }}
                transition={{ delay: Math.min(index * .035, .25), duration: .38 }}
                whileHover={{ y: -5, rotate: 0 }}
                className={`group relative mb-5 inline-block min-h-44 w-full break-inside-avoid overflow-visible border border-[#7f6959]/[.08] px-6 pb-5 pt-8 text-left shadow-[4px_9px_18px_rgba(92,68,57,.11),0_1px_0_rgba(255,255,255,.62)_inset] transition-shadow hover:shadow-[7px_14px_26px_rgba(92,68,57,.15)] ${style.paper} ${style.rotate}`}
              >
                <span aria-hidden="true" className={`pointer-events-none absolute inset-0 opacity-80 ${style.texture}`} />
                <NoteDecoration type={style.decoration} />
                {message.pinned && <span className="relative mb-4 inline-flex items-center gap-1 rounded-full bg-white/45 px-2 py-1 text-[8px] font-semibold tracking-wider text-[#9b666b]"><Pin size={9} /> 置顶</span>}
                <p className={`relative whitespace-pre-wrap leading-7 text-[#584a46] ${style.writing}`} style={{ fontFamily: style.handwriting }}>{message.content}</p>
                <footer className="relative mt-6 flex items-end justify-between gap-3 border-t border-dashed border-[#7e6859]/15 pt-3">
                  <div className="min-w-0">
                    {message.website ? (
                      <a href={safeWebsite(message.website)} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 truncate text-[11px] font-bold transition hover:opacity-65" style={{ color: style.accent }}>{message.name}<ExternalLink size={9} /></a>
                    ) : <strong className="block truncate text-[11px] text-[#6d5c57]">{message.name}</strong>}
                  </div>
                  <time className="shrink-0 font-mono text-[7px] text-[#8f7d75]">{message.date}</time>
                </footer>
              </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-[#d8d2c8]/20 to-[#c9c1b5]/35 shadow-[0_-1px_4px_rgba(89,76,62,.06)]" />
      </section>

      {messages.length > 8 && (
        <div className="mt-4 text-center">
          <button type="button" onClick={() => setShowAll((value) => !value)} className="rounded-full border border-white/75 bg-white/45 px-5 py-2.5 text-[10px] font-semibold text-[#806e69] shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/70">
            {showAll ? "收起部分便签 ↑" : `向下查看更多留言（${messages.length - 8}）↓`}
          </button>
        </div>
      )}

      <section className="relative mx-auto mt-16 max-w-3xl px-3 py-8 sm:px-10 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,250,244,.94)_25%,rgba(255,250,244,.62)_62%,transparent_100%)]" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[9px] font-semibold tracking-[.18em] text-[#856d72]">WRITE A NOTE</p><h2 className="mt-2 text-2xl font-bold text-[#493d3a]">写一张便签</h2><p className="mt-2 text-[10px] leading-5 text-[#917c76]">留言仅保存在当前设备，你可以随时回来看看。</p></div>
            <Feather size={22} className="mt-1 text-[#aa888d]" strokeWidth={1.5} />
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-[10px] font-medium text-[#796864]">你的名字 <span className="font-normal text-[#a28f89]">· 选填</span><input value={name} onChange={(event) => setName(event.target.value.slice(0, 24))} className="mt-2 h-11 w-full border-0 border-b border-[#cfbec0]/70 bg-white/38 px-3 text-xs text-[#493d3a] outline-none transition focus:border-[#78909d] focus:bg-white/58" placeholder="匿名访客" /></label>
              <label className="text-[10px] font-medium text-[#796864]">个人主页 <span className="font-normal text-[#a28f89]">· 选填</span><input value={website} onChange={(event) => setWebsite(event.target.value)} inputMode="url" className="mt-2 h-11 w-full border-0 border-b border-[#cfbec0]/70 bg-white/38 px-3 text-xs text-[#493d3a] outline-none transition focus:border-[#78909d] focus:bg-white/58" placeholder="https://" /></label>
            </div>
            <label className="block text-[10px] font-medium text-[#796864]">想说的话<textarea value={content} onChange={(event) => setContent(event.target.value.slice(0, 200))} required className="mt-2 min-h-40 w-full resize-y border border-white/70 bg-[#fffdf9]/62 px-4 py-4 text-sm leading-7 text-[#493d3a] shadow-[inset_0_1px_5px_rgba(102,76,65,.05)] outline-none transition focus:border-[#aebfc7] focus:bg-white/75" placeholder="今天路过这里，想留下……" /></label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3"><span aria-live="polite" className={`font-mono text-[9px] ${content.length >= 190 ? "text-[#a45f68]" : "text-[#a28b85]"}`}>{content.length}/200</span><span className="text-[9px] text-[#a28f89]">请保持友善，也不要留下隐私信息</span></div>
              <button type="submit" disabled={!content.trim()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#a9888d] px-5 py-2.5 text-[10px] font-bold text-white shadow-[0_8px_20px_rgba(133,91,98,.18)] transition hover:-translate-y-0.5 hover:bg-[#93767b] disabled:cursor-not-allowed disabled:opacity-40"><Send size={12} /> 钉上便签</button>
            </div>
            <AnimatePresence>
              {feedback && <motion.p role="status" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`px-4 py-3 text-center text-[10px] ${feedback.type === "success" ? "bg-[#e4ebe4] text-[#5f7463]" : "bg-[#f0e3e3] text-[#7d6064]"}`}>{feedback.text}</motion.p>}
            </AnimatePresence>
          </form>
        </div>
      </section>

      <p className="mt-10 text-center text-[9px] tracking-[.14em] text-[#9a817b]">谢谢你的到来 · 愿每一次路过都有回应</p>
    </main>
  );
}
