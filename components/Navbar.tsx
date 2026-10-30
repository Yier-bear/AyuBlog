"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "../siteConfig";

const navLinks = [
  { name: "首页", href: "/" },
  { name: "文章", href: "/timeline" },
  { name: "产品手记", href: "/chatter" },
  { name: "说说", href: "/moments" },
  { name: "留言墙", href: "/messages" },
  { name: "照片墙", href: "/photowall" },
  { name: "友链", href: "/friends" },
  { name: "关于", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setVisible(current < previous || current < 80);
      previous = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`fixed left-1/2 top-3 z-50 w-[calc(100%-24px)] max-w-6xl -translate-x-1/2 rounded-[22px] border border-white/70 bg-[#fffaf4]/70 shadow-[0_18px_50px_rgba(120,79,70,.12)] backdrop-blur-2xl transition duration-500 ${visible ? "translate-y-0" : "-translate-y-24"}`}>
        <div className="flex h-14 items-center justify-between px-3 sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#d88b90] to-[#ac5c68] font-mono text-xs font-bold text-white shadow-lg">AY</span>
            <span className="font-black tracking-tight text-[#493d3a]">{siteConfig.navTitle}<i className="mx-1 not-italic text-[#b86670]">{siteConfig.navSuffix}</i>{siteConfig.navAfter}</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return <Link key={link.href} href={link.href} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${active ? "bg-white/75 text-[#ad5f69] shadow-sm" : "text-[#796964] hover:bg-white/55 hover:text-[#ad5f69]"}`}>{link.name}</Link>;
            })}
          </nav>
          <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-9 w-9 place-items-center rounded-xl bg-white/65 text-[#ad5f69] md:hidden" aria-label="打开导航">{open ? "×" : "☰"}</button>
        </div>
      </header>
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="fixed left-3 right-3 top-[76px] z-40 grid grid-cols-2 gap-2 rounded-[24px] border border-white/70 bg-[#fffaf4]/90 p-3 shadow-2xl backdrop-blur-2xl md:hidden">{navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-3 text-center text-sm ${pathname === link.href ? "bg-[#c8787e] text-white" : "bg-white/55 text-[#655550]"}`}>{link.name}</Link>)}</motion.div>}
      </AnimatePresence>
    </>
  );
}
