"use client";

import { useEffect, useState } from "react";

type TocItem = {
  level: number;
  text: string;
  id: string;
};

const cleanHeading = (value: string) => value
  .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
  .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
  .replace(/<\/?[^>]+(>|$)/g, "")
  .replace(/[*_~`#]/g, "")
  .trim();

const getSafeId = (value: string) => `toc-${cleanHeading(value).replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").toLowerCase()}`;

export default function ClientTOC({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const content = document.getElementById("article-content");
    if (!content) return;
    const headings = Array.from(content.querySelectorAll("h1, h2, h3"));
    const usedIds = new Map<string, number>();

    headings.forEach((heading) => {
      const baseId = getSafeId(heading.textContent || "");
      const count = usedIds.get(baseId) || 0;
      usedIds.set(baseId, count + 1);
      heading.id = count ? `${baseId}-${count + 1}` : baseId;
    });

    const onScroll = () => {
      let current = "";
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 150) current = heading.id;
        else break;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  const scrollToHeading = (index: number) => {
    const content = document.getElementById("article-content");
    const headings = content ? Array.from(content.querySelectorAll("h1, h2, h3")) : [];
    const target = headings[index];
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(target.id);
  };

  if (!toc.length) return null;

  return (
    <section className="ayu-glass max-h-[68vh] overflow-y-auto rounded-[24px] p-5">
      <p className="ayu-kicker">ON THIS PAGE</p>
      <h2 className="mt-2 text-sm font-bold text-[#493d3a]">文章目录</h2>
      <nav className="relative mt-5 space-y-1 border-l border-[#d9c2bd]/60" aria-label="文章目录">
        {toc.map((item, index) => {
          const safeId = getSafeId(item.text);
          const isActive = activeId === safeId || activeId.startsWith(`${safeId}-`);
          return (
            <button
              type="button"
              key={`${item.text}-${index}`}
              onClick={() => scrollToHeading(index)}
              className={`relative block w-full py-1.5 pr-1 text-left text-[10px] leading-4 transition ${item.level === 1 ? "pl-4 font-semibold" : item.level === 2 ? "pl-6" : "pl-8 text-[9px]"} ${isActive ? "text-[#a35f68]" : "text-[#917c76] hover:text-[#493d3a]"}`}
            >
              {isActive && <span className="absolute -left-[2px] top-1.5 h-4 w-[3px] rounded-full bg-[#b77a80]" />}
              {cleanHeading(item.text)}
            </button>
          );
        })}
      </nav>
    </section>
  );
}
