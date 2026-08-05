import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const manifest = JSON.parse(readFileSync("content/manifest.json", "utf8"));
const titleMap = new Map();
for (const m of manifest) if (m.title) titleMap.set(m.title, "/" + m.category + "/" + m.slug);

let copied = 0;
const missing = [];
const sources = {};
const now = new Date().toISOString();
for (const m of manifest) {
  if (!existsSync(m.source)) {
    missing.push(m.source);
    continue;
  }
  const dest = join("content", m.category, m.slug + ".md");
  mkdirSync(dirname(dest), { recursive: true });
  let text = readFileSync(m.source, "utf8");
  text = text.replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, (all, title) => {
    const href = titleMap.get(title.trim());
    return href ? "[" + title.trim() + "](" + href + ")" : all;
  });
  writeFileSync(dest, text, "utf8");
  sources[m.category + "/" + m.slug] = { path: m.source, syncedAt: now };
  copied++;
}
writeFileSync("content/sources.json", JSON.stringify(sources, null, 2), "utf8");
console.log("[*] 同步完成:", copied, "个文件；缺失:", missing.length);
if (missing.length) missing.forEach((m) => console.log("    !", m));
