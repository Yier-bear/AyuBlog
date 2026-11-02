"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "../siteConfig";
import { publicPath } from "../lib/publicPath";

type Variant = "chip" | "chip-rose";

const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"/></svg>
);

// QQ 企鹅：深色身体 + 白脸白肚 + 橙色喙和脚 + 红围巾
const QqPenguinIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" aria-hidden="true">
    {/* 翅膀 */}
    <ellipse cx="6.1" cy="13.3" rx="1.15" ry="2.35" transform="rotate(16 6.1 13.3)" fill="#26313F" />
    <ellipse cx="17.9" cy="13.3" rx="1.15" ry="2.35" transform="rotate(-16 17.9 13.3)" fill="#26313F" />
    {/* 身体 */}
    <path fill="#2F3C4C" d="M12 1.8C8.9 1.8 6.4 4.4 6.4 7.7c0 1.6.5 3.1 1.3 4.2-.6 1-.9 2.3-.9 3.7 0 2.8 2.3 5.1 5.2 5.1s5.2-2.3 5.2-5.1c0-1.4-.3-2.7-.9-3.7.8-1.1 1.3-2.6 1.3-4.2 0-3.3-2.5-5.9-5.6-5.9z" />
    {/* 脚 */}
    <path fill="#F9A629" d="M9.3 20.1c-.8.2-1.6.6-1.8 1.1-.1.3.1.6.4.6h2.9c.3 0 .5-.3.5-.6l.1-1.2zM14.7 20.1c.8.2 1.6.6 1.8 1.1.1.3-.1.6-.4.6h-2.9c-.3 0-.5-.3-.5-.6l-.1-1.2z" />
    {/* 白脸和白肚 */}
    <ellipse cx="12" cy="7" rx="4.1" ry="3.3" fill="#FFFFFF" />
    <ellipse cx="12" cy="16" rx="3.9" ry="3.9" fill="#FFFFFF" />
    {/* 眼睛 */}
    <circle cx="10.4" cy="6.6" r="1" fill="#1F2733" />
    <circle cx="13.6" cy="6.6" r="1" fill="#1F2733" />
    <circle cx="10.7" cy="6.3" r=".34" fill="#FFFFFF" />
    <circle cx="13.9" cy="6.3" r=".34" fill="#FFFFFF" />
    {/* 喙 */}
    <path fill="#F9A629" d="M12 8.1l1.5 1.1L12 10.4l-1.5-1.2z" />
    {/* 红围巾 */}
    <path fill="#E5493D" d="M8.1 10.9c1.2.9 2.5 1.3 3.9 1.3s2.7-.4 3.9-1.3c.3 1.1.4 2.1.1 2.8-1.2.7-2.5 1.1-4 1.1s-2.8-.4-4-1.1c-.3-.7-.2-1.7.1-2.8z" />
    <path fill="#D64036" d="M14.3 14.3l1.5 3.1-1.6.5-1.3-2.8z" />
  </svg>
);

const WechatIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.341 6.055c-3.334 0-6.038 2.246-6.038 5.017 0 1.587.885 3.001 2.264 3.926l-.566 1.702 1.976-.992c.734.23 1.525.355 2.364.355.146 0 .29-.004.434-.011a4.743 4.743 0 01-.194-1.345c0-2.693 2.48-4.877 5.54-4.877.193 0 .383.01.572.028-.634-2.2-3.207-3.803-6.352-3.803zm-2.14 2.577a.878.878 0 110 1.756.878.878 0 010-1.756zm4.307 0a.878.878 0 110 1.756.878.878 0 010-1.756zm4.662 2.277c-2.79 0-5.05 1.88-5.05 4.2 0 2.318 2.26 4.199 5.05 4.199.568 0 1.114-.078 1.623-.222l1.66.834-.476-1.431c1.158-.78 1.896-1.988 1.896-3.38 0-2.32-2.26-4.2-5.203-4.2h.5zm-1.666 2.057a.737.737 0 110 1.474.737.737 0 010-1.474zm3.333 0a.737.737 0 110 1.474.737.737 0 010-1.474z"/></svg>
);

const XhsIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5.5 3h13A2.5 2.5 0 0121 5.5v13a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 18.5v-13A2.5 2.5 0 015.5 3zm2.1 4.6v1.8h3.6v1.5H7.6v1.7h3.6v3.9h1.8v-3.9h3.6v-1.7h-3.6V9.4h3.6V7.6h-3.6v-1h-1.8v1H7.6z"/></svg>
);

const CHIP_STYLES: Record<Variant, string> = {
  chip: "bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 border border-white/40 dark:border-white/10",
  "chip-rose": "bg-white/70 text-[#6d5b57] hover:bg-[#493d3a] hover:text-white border border-white/60",
};

export default function ContactButtons({ variant = "chip", className = "", exclude = [] }: { variant?: Variant; className?: string; exclude?: string[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const copyText = useCallback(async (text: string, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } finally { document.body.removeChild(ta); }
    }
    showToast(`已复制${label}：${text}`);
  }, [showToast]);

  const social = siteConfig.social || {} as Record<string, string>;

  type Item = { key: string; label: string; icon: React.ReactNode; href?: string; onClick?: () => void; title: string };
  const items: Item[] = [
    { key: "github", label: "GitHub", icon: <GithubIcon />, href: social.github || undefined, title: "GitHub 个人主页" },
    { key: "email", label: "QQ 邮箱", icon: <EmailIcon />, onClick: () => copyText(social.email || "", "QQ 邮箱"), title: "点击复制 QQ 邮箱" },
    { key: "qq", label: "QQ", icon: <QqPenguinIcon />, onClick: () => copyText(social.qq || "", "QQ 号"), title: "点击复制 QQ 号" },
    { key: "wechat", label: "微信", icon: <WechatIcon />, onClick: () => copyText(social.wechat || "", "微信号"), title: "点击复制微信号" },
    { key: "xhs", label: "小红书", icon: <XhsIcon />, onClick: () => setModalOpen(true), title: "查看小红书名片" },
  ];

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.filter((item) => !exclude.includes(item.key)).map((item) => {
          const inner = (
            <div
              title={item.title}
              className={`grid h-8 w-8 place-items-center rounded-full transition-all duration-300 hover:-translate-y-0.5 ${CHIP_STYLES[variant]}`}
            >
              {item.icon}
            </div>
          );
          return item.href ? (
            <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>{inner}</a>
          ) : (
            <button key={item.key} type="button" onClick={item.onClick} aria-label={item.label}>{inner}</button>
          );
        })}
      </div>

      {/* 小红书名片弹窗 */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-6 backdrop-blur-md"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[340px] overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="关闭"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/35 text-white transition hover:bg-black/55"
            >
              ✕
            </button>
            <img
              src={publicPath("/xhs-qr.jpg")}
              alt="小红书名片：阿郁yu. 小红书号 ayu_55558"
              className="block w-full"
            />
            <p className="pb-4 text-center text-[11px] text-[#8a7771]">截图或长按识别二维码，在小红书找到我</p>
          </div>
        </div>
      )}

      {/* 复制成功提示 */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-8 left-1/2 z-[130] -translate-x-1/2 rounded-full bg-[#493d3a]/92 px-5 py-2.5 text-xs font-semibold text-white shadow-xl transition-all duration-300 ${toast ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
      >
        {toast || ""}
      </div>
    </div>
  );
}
