"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function PostLikeButton({ slug }: { slug: string }) {
  const storageKey = `ayu-post-liked:${slug}`;
  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "true");
    setMounted(true);
  }, [storageKey]);

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    localStorage.setItem(storageKey, String(next));
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      aria-pressed={liked}
      aria-label={liked ? "取消喜欢这篇文章" : "喜欢这篇文章"}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${liked ? "border-[#e6aeb4] bg-[#fff1f2] text-[#b85f6a]" : "border-[#eadfd5] bg-[#fffdf9] text-[#806e69] hover:border-[#d8b9bb] hover:bg-[#fff7f4]"}`}
    >
      <Heart size={17} className={liked ? "fill-current" : ""} />
      {mounted && liked ? "已喜欢" : "喜欢这篇文章"}
    </button>
  );
}
