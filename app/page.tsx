import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import HomeHero from "../components/HomeHero";
import { siteConfig } from "../siteConfig";
import { friendsData } from "../data/friends";
import { latestAiDailyReport } from "../data/aiDaily";

type Entry = {
  slug: string;
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  tags: string[];
  cover: string;
};

type MomentEntry = {
  id: string;
  content: string;
  date: string;
  formattedDate: string;
  location: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit" }).format(date);
}

function readEntries(folder: string): Entry[] {
  const directory = path.join(process.cwd(), folder);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((file) => file.endsWith(".md")).map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(directory, file), "utf8"));
    const date = String(data.date || "1970-01-01");
    return {
      slug: file.replace(/\.md$/, ""),
      title: String(data.title || "未命名记录"),
      description: String(data.description || content.replace(/[#>*`]/g, "").trim().slice(0, 100)),
      date,
      formattedDate: formatDate(date),
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: String(data.cover || siteConfig.defaultPostCover),
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function readMoments(): MomentEntry[] {
  const moments = ["posts/moments", "moments"].flatMap((folder) => {
    const directory = path.join(process.cwd(), folder);
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory).filter((file) => file.endsWith(".md")).map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(directory, file), "utf8"));
      const date = String(data.date || "1970-01-01");
      return { id: file.replace(/\.md$/, ""), content: content.trim(), date, formattedDate: formatDate(date), location: String(data.location || "") };
    });
  });
  return Array.from(new Map(moments.map((moment) => [moment.id, moment])).values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const sideLinks = [
  { label: "文章归档", href: "/timeline", icon: "◌" },
  { label: "产品手记", href: "/chatter", icon: "⌁" },
  { label: "说说动态", href: "/moments", icon: "☁" },
  { label: "照片切片", href: "/photowall", icon: "▧" },
  { label: "留言墙", href: "/messages", icon: "✎" },
  { label: "我的友链", href: "/friends", icon: "↗" },
];

export default function Home() {
  const posts = readEntries("posts");
  const notes = readEntries("chatters");
  const moments = readMoments();
  const momentCount = moments.length;

  return (
    <div className="ayu-site min-h-screen pb-12">
      <Navbar />
      <PageTransition>
        <HomeHero posts={posts.map(({ slug, title, description }) => ({ slug, title, description }))} />

        <main className="relative z-10 mx-auto -mt-1 grid w-full max-w-6xl gap-4 px-4 pb-4 sm:px-6 xl:grid-cols-[220px_minmax(0,1fr)_238px]">
          <aside className="space-y-3 xl:sticky xl:top-0 xl:self-start">
            <section className="ayu-glass rounded-[24px] p-4 text-center">
              <img src={siteConfig.avatarUrl} alt="ayu 的头像" className="mx-auto h-18 w-18 rounded-full border-4 border-white/80 object-cover shadow-[0_10px_24px_rgba(120,79,70,.13)]" />
              <h2 className="mt-2.5 text-lg font-black text-[#493d3a]">ayu</h2>
              <p className="mt-0.5 text-[8px] tracking-[.14em] text-[#8a7771]">AI 产品经理</p>
              <p className="mt-2 text-[9px] leading-4 text-[#796864]">产品人、AI 探索者，也是一名持续记录生活的人。</p>

              <div className="mt-3 grid grid-cols-3 border-y border-dashed border-[#b88d85]/20 py-2.5">
                <Link href="/timeline"><strong className="block font-mono text-base text-[#b7646d]">{posts.length}</strong><span className="text-[8px] text-[#99827c]">文章</span></Link>
                <Link href="/moments" className="border-x border-dashed border-[#b88d85]/20"><strong className="block font-mono text-base text-[#b7646d]">{momentCount}</strong><span className="text-[8px] text-[#99827c]">说说</span></Link>
                <Link href="/photowall"><strong className="block font-mono text-base text-[#b7646d]">{siteConfig.counts.photos}</strong><span className="text-[8px] text-[#99827c]">照片</span></Link>
              </div>

              <div className="mt-3 flex justify-center gap-2" aria-label="社交与个人链接">
                <a href={siteConfig.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub" className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-[#6d5b57] transition hover:-translate-y-0.5 hover:bg-[#493d3a] hover:text-white"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.91c-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.32 9.32 0 0112 6.92a9.3 9.3 0 012.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.35 4.8-4.58 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.26 10.26 0 0022 12.24C22 6.58 17.52 2 12 2z" /></svg></a>
                <Link href="/about" aria-label="关于我" title="关于我" className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-[11px] font-bold text-[#8e6666] transition hover:-translate-y-0.5 hover:bg-[#c8787e] hover:text-white">A</Link>
                <Link href="/friends" aria-label="友链" title="友链" className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-[#8e6666] transition hover:-translate-y-0.5 hover:bg-[#c8787e] hover:text-white">∞</Link>
                <Link href="/messages" aria-label="留言墙" title="留言墙" className="grid h-8 w-8 place-items-center rounded-full bg-white/70 text-[#8e6666] transition hover:-translate-y-0.5 hover:bg-[#c8787e] hover:text-white">✎</Link>
              </div>
            </section>

            <section className="ayu-glass rounded-[24px] p-3.5">
              <p className="ayu-kicker px-1.5 pb-2">内容导航</p>
              <nav className="grid grid-cols-2 gap-1.5">
                {sideLinks.map((item) => <Link key={item.href} href={item.href} className="rounded-xl bg-white/42 px-1.5 py-2 text-center text-[8px] text-[#675854] transition hover:bg-white/80 hover:text-[#8a7074]"><i className="mr-1 not-italic text-[#ad8b8e]">{item.icon}</i>{item.label}</Link>)}
              </nav>
            </section>

            <section className="ayu-glass rounded-[24px] p-3.5">
              <p className="ayu-kicker">个人标签</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">{["AI 产品", "Agent", "体验设计", "摄影", "手帐"].map((tag) => <span key={tag} className="rounded-lg bg-white/65 px-2 py-1 text-[8px] text-[#806f6b]"># {tag}</span>)}</div>
            </section>
          </aside>

          <section className="min-w-0 space-y-4">
            <section className="ayu-glass rounded-[28px] p-6 sm:p-7">
              <div className="flex items-end justify-between gap-4"><div><p className="ayu-kicker">LATEST ARTICLES</p><h2 className="mt-2 text-2xl font-bold text-[#493d3a]">最新文章</h2></div><Link href="/timeline" className="text-[9px] text-[#ad6069]">全部文章 →</Link></div>
              <div className="mt-5 divide-y divide-dashed divide-[#a9746a]/15">{(posts.length ? posts.slice(0, 3) : [{ slug: "none", title: "第一篇文章正在路上", description: "记录问题、判断和产品实践。", date: "", formattedDate: "SOON", tags: ["AI 产品"], cover: siteConfig.defaultPostCover }]).map((post) => <Link key={post.slug} href={post.slug === "none" ? "/timeline" : `/posts/${post.slug}`} className="group grid gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_132px] sm:items-center"><div className="min-w-0"><h3 className="line-clamp-2 text-sm font-bold leading-6 text-[#493d3a] transition group-hover:text-[#856d72]">{post.title}</h3><p className="mt-1.5 line-clamp-2 text-[10px] leading-5 text-[#8a7771]">{post.description}</p><div className="mt-2.5 flex flex-wrap items-center gap-2 text-[8px] text-[#9b8580]"><time className="font-mono">{post.formattedDate}</time>{post.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-[#eef3f4] px-2 py-1 text-[#6f8792]"># {tag}</span>)}</div></div><div className="relative order-first aspect-[16/9] overflow-hidden rounded-2xl bg-[#f1e7e2] sm:order-last"><img src={post.cover} alt={`${post.title}的文章封面`} className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-tr from-[#e8cdd2]/15 to-transparent" /></div></Link>)}</div>
            </section>

            <section className="ayu-glass rounded-[28px] p-6 sm:p-7">
              <div className="flex items-end justify-between gap-4"><div><p className="ayu-kicker">LATEST NOTES</p><h2 className="mt-2 text-2xl font-bold text-[#493d3a]">最新手记</h2></div><Link href="/chatter" className="text-[9px] text-[#ad6069]">全部手记 →</Link></div>
              <div className="mt-5 divide-y divide-dashed divide-[#a9746a]/15">{(notes.length ? notes.slice(0, 3) : [{ slug: "none", title: "第一张产品便签正在路上", description: "产品 Tips、面试复盘与一闪而过的判断。", date: "", formattedDate: "SOON", tags: ["手记"], cover: siteConfig.defaultPostCover }]).map((note) => <Link key={note.slug} href={note.slug === "none" ? "/chatter" : `/chatter/${note.slug}`} className="group flex items-center justify-between gap-4 py-4"><div className="min-w-0"><h3 className="text-sm font-bold text-[#493d3a] group-hover:text-[#856d72]">{note.title}</h3><p className="mt-1 line-clamp-1 text-[10px] text-[#8a7771]">{note.description}</p></div><time className="shrink-0 font-mono text-[8px] text-[#a28b85]">{note.formattedDate}</time></Link>)}</div>
            </section>

            <section className="ayu-glass rounded-[28px] p-6 sm:p-7">
              <div className="flex items-end justify-between gap-4"><div><p className="ayu-kicker">LATEST MOMENTS</p><h2 className="mt-2 text-2xl font-bold text-[#493d3a]">最新说说</h2></div><Link href="/moments" className="text-[9px] text-[#ad6069]">全部说说 →</Link></div>
              <div className="mt-5 divide-y divide-dashed divide-[#a9746a]/15">{moments.slice(0, 3).map((moment) => <Link key={moment.id} href="/moments" className="group flex items-center justify-between gap-4 py-4"><div className="min-w-0"><h3 className="line-clamp-1 text-sm font-bold text-[#493d3a] group-hover:text-[#856d72]">{moment.content.replace(/[#>*`]/g, "")}</h3>{moment.location && <p className="mt-1 text-[9px] text-[#8a7771]">⌖ {moment.location}</p>}</div><time className="shrink-0 font-mono text-[8px] text-[#a28b85]">{moment.formattedDate}</time></Link>)}</div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <Link href="/photowall" className="ayu-glass relative min-h-40 overflow-hidden rounded-[26px] p-5 transition hover:-translate-y-1"><img src={siteConfig.photoWallImage} alt="照片墙预览" className="absolute inset-0 h-full w-full object-cover opacity-25" /><div className="relative"><p className="ayu-kicker">LIFE IN FRAMES</p><h2 className="mt-3 text-lg font-bold text-[#493d3a]">照片与生活</h2></div></Link>
              <Link href="/messages" className="ayu-glass rounded-[26px] p-5 transition hover:-translate-y-1"><p className="ayu-kicker">LEAVE A NOTE</p><h2 className="mt-3 text-lg font-bold text-[#493d3a]">留言墙</h2><p className="mt-3 text-[10px] leading-5 text-[#786864]">写一张便签，留下你来过的痕迹。</p></Link>
            </section>
          </section>

          <aside className="space-y-3 xl:sticky xl:top-0 xl:self-start">
            <section className="ayu-glass rounded-[24px] p-4">
              <div className="flex items-end justify-between"><div><p className="ayu-kicker">我的友链</p><h2 className="mt-1 text-sm font-bold text-[#493d3a]">我的邻居们</h2></div><Link href="/friends" className="text-[8px] text-[#8d7074]">全部 →</Link></div>
              <div className="mt-3 space-y-1.5">{friendsData.length ? friendsData.slice(0, 4).map((friend) => <a key={friend.id} href={friend.url} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-xl bg-white/60 p-2.5 transition hover:bg-white/85"><img src={friend.avatar} alt="" className="h-8 w-8 rounded-lg object-cover" /><div className="min-w-0"><strong className="block truncate text-[10px] text-[#493d3a]">{friend.name}</strong><p className="mt-0.5 line-clamp-1 text-[8px] text-[#917c76]">{friend.description}</p></div></a>) : <p className="py-4 text-center text-[9px] text-[#9a847e]">友链正在生长中</p>}</div>
            </section>

            <section className="ayu-glass rounded-[24px] p-4">
              <div className="flex items-center justify-between gap-2"><p className="ayu-kicker">每日 AI 日报</p><time className="font-mono text-[7px] text-[#a28b85]">{latestAiDailyReport.date.slice(5)}</time></div>
              <h2 className="mt-2 text-sm font-bold text-[#493d3a]">{latestAiDailyReport.project}</h2>
              <p className="mt-1.5 text-[9px] leading-4 text-[#796864]">{latestAiDailyReport.tagline}</p>
              <p className="mt-1.5 line-clamp-2 text-[8px] leading-4 text-[#917c76]">{latestAiDailyReport.summary[1]}</p>
              <Link href={`/ai-daily/${latestAiDailyReport.slug}`} className="mt-3 block rounded-xl bg-white/65 px-3 py-2 text-center text-[8px] text-[#856d72] transition hover:bg-[#a9888d] hover:text-white">查看今日日报 →</Link>
            </section>

            <section className="ayu-glass rounded-[24px] p-4">
              <p className="ayu-kicker">互动入口</p><p className="mt-2 text-[9px] leading-4 text-[#796864]">欢迎交换友链，也欢迎在留言墙留下你的名字和此刻正在做的事。</p><div className="mt-3 grid grid-cols-2 gap-2"><Link href="/friends" className="rounded-xl bg-white/65 px-2 py-2 text-center text-[8px] text-[#856d72]">交换友链</Link><Link href="/messages" className="rounded-xl bg-[#a9888d] px-2 py-2 text-center text-[8px] text-white">去留言</Link></div>
            </section>
          </aside>
        </main>

        <footer className="mx-auto mt-8 flex w-full max-w-6xl flex-col justify-between gap-2 border-t border-dashed border-white/55 px-6 py-8 font-mono text-[9px] tracking-widest text-[#8d7771] sm:flex-row"><span>© 2026 AYU’S BLOG</span><span>AI PRODUCT · CURIOSITY · LIFE</span></footer>
      </PageTransition>
    </div>
  );
}
