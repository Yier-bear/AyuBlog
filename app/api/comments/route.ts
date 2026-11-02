import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 本地评论区后端：评论与回复统一存放在 data/comments.json
// 结构：{ "pages": { "<pageId>": [ { id, name, content, date, parentId, replyTo } ] } }

const DATA_FILE = path.join(process.cwd(), "data", "comments.json");

export type LocalComment = {
  id: string;
  name: string;
  content: string;
  date: string;
  parentId: string | null;
  replyTo?: string;
};

type Store = { pages: Record<string, LocalComment[]> };

function readStore(): Store {
  try {
    if (!fs.existsSync(DATA_FILE)) return { pages: {} };
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.pages && typeof parsed.pages === "object") {
      return parsed as Store;
    }
  } catch {
    // 文件损坏时重置，避免整站评论接口挂掉
  }
  return { pages: {} };
}

function writeStore(store: Store) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

function sanitize(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = sanitize(searchParams.get("pageId"), 64);
  if (!pageId) return NextResponse.json({ comments: [] });
  const store = readStore();
  return NextResponse.json({ comments: store.pages[pageId] || [] });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const pageId = sanitize(payload.pageId, 64);
  const content = sanitize(payload.content, 500);
  const name = sanitize(payload.name, 20) || "匿名访客";
  const parentId = sanitize(payload.parentId, 40) || null;

  if (!pageId || !content) {
    return NextResponse.json({ error: "页面标识与评论内容不能为空" }, { status: 400 });
  }

  const store = readStore();
  const page = store.pages[pageId] || (store.pages[pageId] = []);

  // 回复必须指向本页已存在的评论
  let replyTo: string | undefined;
  if (parentId) {
    const parent = page.find((item) => item.id === parentId);
    if (!parent) {
      return NextResponse.json({ error: "回复的评论不存在" }, { status: 400 });
    }
    replyTo = parent.name;
  }

  const comment: LocalComment = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    content,
    date: new Date().toISOString(),
    parentId,
    replyTo,
  };

  page.push(comment);
  writeStore(store);

  return NextResponse.json({ comment }, { status: 201 });
}
