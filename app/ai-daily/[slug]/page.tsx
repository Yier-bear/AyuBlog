import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import PageTransition from "../../../components/PageTransition";
import { aiDailyReports } from "../../../data/aiDaily";

export function generateStaticParams() {
  return aiDailyReports.map((report) => ({ slug: report.slug }));
}

export default async function AiDailyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = aiDailyReports.find((item) => item.slug === slug);
  if (!report) notFound();

  return (
    <div className="ayu-site min-h-screen pb-16">
      <Navbar />
      <PageTransition>
        <main className="mx-auto w-full max-w-4xl px-4 pt-28 sm:px-6">
          <Link href="/" className="text-xs text-[#a85f68]">← 返回首页</Link>
          <article className="ayu-glass mt-5 overflow-hidden rounded-[34px] p-7 sm:p-11">
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#f3d6d3]/65 px-3 py-1 font-mono text-[9px] text-[#a45f68]">DAILY AI REPORT</span><time className="font-mono text-[9px] text-[#9b847e]">{report.date}</time></div>
            <h1 className="mt-5 text-4xl font-black text-[#493d3a] sm:text-5xl">{report.project}</h1>
            <p className="mt-4 text-base leading-8 text-[#735f5a]">{report.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-2">{report.tags.map((tag) => <span key={tag} className="rounded-lg bg-white/70 px-3 py-1.5 text-[9px] text-[#98676a]"># {tag}</span>)}</div>

            <section className="mt-9 border-t border-dashed border-[#b88d85]/25 pt-8"><h2 className="text-2xl font-bold text-[#493d3a]">今天推荐什么</h2><div className="mt-4 space-y-4">{report.summary.map((paragraph) => <p key={paragraph} className="text-sm leading-8 text-[#75635e]">{paragraph}</p>)}</div></section>
            <section className="mt-9"><h2 className="text-2xl font-bold text-[#493d3a]">为什么产品经理值得看</h2><div className="mt-4 space-y-4">{report.whyItMatters.map((paragraph) => <p key={paragraph} className="text-sm leading-8 text-[#75635e]">{paragraph}</p>)}</div></section>
            <section className="mt-9 rounded-[24px] bg-white/55 p-6"><h2 className="text-lg font-bold text-[#493d3a]">可以带回团队的三个问题</h2><ol className="mt-4 space-y-3">{report.productQuestions.map((question, index) => <li key={question} className="flex gap-3 text-sm leading-7 text-[#75635e]"><span className="font-mono text-[#bd777d]">0{index + 1}</span><span>{question}</span></li>)}</ol></section>
            <a href={report.githubUrl} target="_blank" rel="noreferrer" className="ayu-primary mt-9">前往 GitHub 查看项目 ↗</a>
          </article>
        </main>
      </PageTransition>
    </div>
  );
}
