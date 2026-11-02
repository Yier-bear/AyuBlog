"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Comment = {
  id: string;
  name: string;
  content: string;
  date: string;
  parentId: string | null;
  replyTo?: string;
};

type Props = {
  pageId: string;
  compact?: boolean;
  placeholder?: string;
};

const NAME_KEY = "ayu-comment-name";

const AVATAR_TONES = [
  "bg-[#e9b7bb] text-[#8f4a52]",
  "bg-[#e7cf9f] text-[#8a6a2f]",
  "bg-[#b7cec0] text-[#4c6b58]",
  "bg-[#bcc9d8] text-[#4d5f7a]",
  "bg-[#d3bfc9] text-[#6f4f66]",
];

function toneFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function LocalComments({ pageId, compact = false, placeholder = "写下你的评论…" }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<{ parentId: string; name: string } | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(NAME_KEY);
      if (saved) setName(saved);
    } catch { /* 忽略隐私模式 */ }
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?pageId=${encodeURIComponent(pageId)}`, { cache: "no-store" });
      const data = await res.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch {
      setError("评论加载失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const { roots, replies } = useMemo(() => {
    const map = new Map<string, Comment[]>();
    const top: Comment[] = [];
    for (const item of comments) {
      if (item.parentId) {
        const list = map.get(item.parentId) || [];
        list.push(item);
        map.set(item.parentId, list);
      } else {
        top.push(item);
      }
    }
    return { roots: top, replies: map };
  }, [comments]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const text = content.trim();
    if (!text) { setError("评论内容不能为空"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, name: name.trim(), content: text, parentId: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "发布失败");
      try { window.localStorage.setItem(NAME_KEY, name.trim() || "匿名访客"); } catch { /* 忽略 */ }
      setContent("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "发布失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (parentId: string) => {
    const text = replyContent.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, name: name.trim(), content: text, parentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "回复失败");
      try { window.localStorage.setItem(NAME_KEY, name.trim() || "匿名访客"); } catch { /* 忽略 */ }
      setReplyContent("");
      setReplyTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "回复失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  const total = comments.length;

  const renderReplyBox = (parentId: string) => (
    <div className="mt-2 flex flex-col gap-2">
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder={`回复 @${replyTarget?.name ?? ""}…`}
        className="w-full resize-y rounded-xl border border-[#d9c4bd]/60 bg-white/70 px-3 py-2 text-xs leading-5 text-[#493d3a] outline-none transition focus:border-[#c8787e] focus:ring-2 focus:ring-[#c8787e]/20"
      />
      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={() => { setReplyTarget(null); setReplyContent(""); }} className="rounded-lg px-3 py-1.5 text-[10px] text-[#8a7771] transition hover:bg-white/70">取消</button>
        <button type="button" disabled={submitting || !replyContent.trim()} onClick={() => submitReply(parentId)} className="rounded-lg bg-[#c8787e] px-3.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#a95f69] disabled:cursor-not-allowed disabled:opacity-50">
          {submitting ? "回复中…" : "回复"}
        </button>
      </div>
    </div>
  );

  const renderComment = (item: Comment, isReply = false) => (
    <div key={item.id} className={`${isReply ? "ml-9 border-l-2 border-[#e4cfd2]/50 pl-3" : ""} py-2.5`}>
      <div className="flex items-start gap-2.5">
        <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${toneFor(item.name)}`}>
          {(item.name || "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-[11px] font-bold text-[#5b6b95] dark:text-[#8fa3d0]">{item.name}</span>
            <span className="font-mono text-[9px] text-[#a8948e]">{formatDateTime(item.date)}</span>
            {!isReply && (
              <button
                type="button"
                onClick={() => { setReplyTarget({ parentId: item.id, name: item.name }); setReplyContent(""); }}
                className="ml-auto rounded-md px-2 py-0.5 text-[10px] text-[#c8787e] transition hover:bg-[#c8787e]/10"
              >
                回复
              </button>
            )}
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-[#4a3f3c] dark:text-slate-300">
            {item.replyTo ? <span className="mr-1 font-semibold text-[#c8787e]">回复 @{item.replyTo}：</span> : null}
            {item.content}
          </p>
          {!isReply && replyTarget?.parentId === item.id && renderReplyBox(item.id)}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full ${compact ? "mt-3" : "mt-6"}`}>
      <div className="rounded-2xl border border-white/60 bg-white/50 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-800/50 sm:p-5">
        {/* 发表评论 */}
        <form onSubmit={submit} className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="昵称（可留空，显示为匿名访客）"
              className="w-44 rounded-lg border border-[#d9c4bd]/60 bg-white/70 px-3 py-1.5 text-[11px] text-[#493d3a] outline-none transition focus:border-[#c8787e] focus:ring-2 focus:ring-[#c8787e]/20"
            />
            <span className="text-[10px] text-[#a8948e]">会记住你的昵称</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={compact ? 2 : 3}
            maxLength={500}
            placeholder={placeholder}
            className="w-full resize-y rounded-xl border border-[#d9c4bd]/60 bg-white/70 px-3.5 py-2.5 text-xs leading-5 text-[#493d3a] outline-none transition focus:border-[#c8787e] focus:ring-2 focus:ring-[#c8787e]/20"
          />
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-[#a8948e]">{content.length}/500</span>
            <button type="submit" disabled={submitting || !content.trim()} className="rounded-xl bg-gradient-to-r from-[#c8787e] to-[#a95f69] px-5 py-2 text-[11px] font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? "发布中…" : "发表评论"}
            </button>
          </div>
        </form>

        {error && <p className="mt-2 rounded-lg bg-[#f7deda] px-3 py-2 text-[10px] text-[#a95f69]">{error}</p>}

        {/* 评论列表 */}
        <div className="mt-4 border-t border-dashed border-[#d9c4bd]/50 pt-2">
          {loading ? (
            <p className="py-6 text-center text-[10px] text-[#a8948e]">评论加载中…</p>
          ) : total === 0 ? (
            <p className="py-6 text-center text-[10px] text-[#a8948e]">还没有评论，来说第一句吧～</p>
          ) : (
            <>
              <p className="px-1 pb-1 text-[10px] font-semibold tracking-wide text-[#8a7771]">{total} 条评论</p>
              <div className="divide-y divide-dashed divide-[#e4cfd2]/40">
                {roots.map((item) => (
                  <div key={item.id}>
                    {renderComment(item)}
                    {(replies.get(item.id) || []).map((reply) => renderComment(reply, true))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
