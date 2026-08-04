import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import matter from "gray-matter";

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (extname(p) === ".md") acc.push(p);
  }
  return acc;
}

if (!existsSync("content")) {
  console.log("[*] content/ 不存在，跳过内容索引生成");
  process.exit(0);
}

const files = walk("content");
const entries = files.map((f) => {
  const raw = readFileSync(f, "utf8");
  const { data, content } = matter(raw);
  const rel = relative("content", f).replace(/\\/g, "/").replace(/\.md$/, "");
  const parts = rel.split("/");
  const category = parts[0];
  const slug = parts.slice(1).join("/") || category;
  return {
    slug,
    category,
    title: data.title || parts[parts.length - 1] || category,
    date: data.date || "",
    tags: data.tags || [],
    summary: data.summary || "",
    draft: !!data.draft,
    markdown: content.trim(),
  };
});

writeFileSync("src/data/content-index.json", JSON.stringify(entries, null, 2));
console.log("[*] content-index.json 生成完成:", entries.length, "条");
