import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/atom-one-dark.css";

import Navbar from "../../../components/Navbar";
import PageTransition from "../../../components/PageTransition";
import Comments from "../../../components/Comments";
import PostLikeButton from "../../../components/PostLikeButton";
import { siteConfig } from "../../../siteConfig";
import { getArticleCategoryStyle, normalizeArticleCategories } from "../../../components/articleCategories";
import { rewritePublicPaths } from "../../../lib/publicPath";

type PostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover: string;
};

function parsePostDate(value: string) {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function getAllPosts(): PostSummary[] {
  const directory = path.join(process.cwd(), "posts");
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const slug = name.replace(/\.md$/, "");
      const { data } = matter(fs.readFileSync(path.join(directory, name), "utf8"));
      return {
        slug,
        title: String(data.title || "无标题"),
        date: String(data.date || "1970-01-01"),
        description: String(data.description || ""),
        tags: normalizeArticleCategories(data.tags),
        cover: String(data.cover || siteConfig.defaultPostCover),
      };
    })
    .sort((a, b) => parsePostDate(b.date).getTime() - parsePostDate(a.date).getTime());
}

export async function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

function extractToc(content: string) {
  const toc: { level: number; text: string; id: string }[] = [];
  let fence: { marker: string; length: number } | null = null;

  for (const line of content.split(/\r?\n/)) {
    const delimiter = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (delimiter) {
      const marker = delimiter[1][0];
      if (!fence) {
        if (marker !== "`" || !delimiter[2].includes("`")) {
          fence = { marker, length: delimiter[1].length };
          continue;
        }
      } else if (marker === fence.marker && delimiter[1].length >= fence.length && !delimiter[2].trim()) {
        fence = null;
        continue;
      }
    }
    if (fence) continue;
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      toc.push({ level: match[1].length, text, id: text.toLowerCase().replace(/\s+/g, "-") });
    }
  }
  return toc;
}

async function getPostData(slug: string) {
  const fullPath = path.join(process.cwd(), "posts", `${slug}.md`);
  if (!fs.existsSync(fullPath)) notFound();

  let { data, content } = matter(fs.readFileSync(fullPath, "utf8"));
  content = content.replace(/^(\s*\d+)\.([^ \n])/gm, "$1. $2");
  content = content.replace(/\r\n/g, "\n").replace(/^[ \t]+$/gm, "");
  const blocks = content.split(/(```[\s\S]*?```)/g);
  content = blocks.map((block, index) => {
    if (index % 2 === 1) return block;
    return block.replace(/\n{3,}/g, (match) => `\n\n${"<br/>".repeat(match.length - 2)}\n\n`);
  }).join("");

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, {
      detect: true,
      ignoreMissing: true,
      subset: ["cpp", "c", "python", "java", "javascript", "typescript", "go", "rust", "bash", "json", "html", "css", "sql", "xml"],
    })
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    slug,
    contentHtml: rewritePublicPaths(processedContent.toString()),
    toc: extractToc(content),
    title: String(data.title || "无标题"),
    date: String(data.date || "1970-01-01"),
    description: String(data.description || ""),
    tags: normalizeArticleCategories(data.tags),
    cover: String(data.cover || siteConfig.defaultPostCover),
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  const date = parsePostDate(post.date);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return (
    <div className="relative min-h-screen pb-20">
      <Navbar />
      <PageTransition>
        <main className="relative z-10 mx-auto w-full max-w-[896px] px-4 pb-12 pt-24 sm:px-7 sm:pt-28">
          <Link href="/timeline" className="mb-4 inline-flex items-center gap-1.5 text-[10px] font-medium text-[#917c76] transition hover:text-[#a35f68]">
            <ArrowLeft size={13} /> 返回列表
          </Link>

          <article className="overflow-hidden rounded-xl border border-[#eadfd5]/85 bg-[#fffdf9]/94 shadow-[0_10px_34px_rgba(118,76,69,.08)] backdrop-blur-xl">
            <div className="mx-auto max-w-[784px] px-5 py-8 sm:px-7 sm:py-9">
              <span className="inline-flex rounded-full border border-[#dcbfc1] bg-[#f8eee5] px-2.5 py-0.5 text-[9px] font-semibold text-[#8b6b6f]">文章</span>
              <h1 className="mt-3 text-[23px] font-bold leading-[1.3] tracking-[-.02em] text-[#493d3a]">{post.title}</h1>
              {post.description && <p className="mt-1.5 text-[13px] leading-6 text-[#806e69]">{post.description}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-[#9a847e]">
                <time dateTime={post.date}>{formattedDate}</time>
                {post.tags.map((tag) => <span key={tag} className={`rounded-full border px-2 py-0.5 text-[9px] ${getArticleCategoryStyle(tag).chip}`}># {tag}</span>)}
              </div>
              <svg className="mt-4 h-[10px] w-24 text-[#c58f94]" viewBox="0 0 96 10" fill="none" aria-hidden="true"><path d="M1 6C13 0 21 10 33 4s20 4 31 0 19 5 31-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>

              <div id="article-content" className="claw-article mt-5" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            </div>

            <section className="border-t border-[#eadfd5]/80 px-5 pb-8 pt-6 sm:px-7" aria-label="文章互动">
              <div className="mx-auto max-w-[784px]">
                <div className="flex justify-center"><PostLikeButton slug={post.slug} /></div>
                <div className="mt-5 border-t border-[#eadfd5]/70 pt-5">
                  <h2 className="text-sm font-semibold text-[#493d3a]">评论</h2>
                  <Comments compact />
                </div>
              </div>
            </section>
          </article>
        </main>
      </PageTransition>
    </div>
  );
}
