import index from "../data/content-index.json";
import rawSources from "../data/sources.json";

export type ContentEntry = {
  slug: string;
  category: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  draft: boolean;
  markdown: string;
};

export const entries = index as ContentEntry[];
export const posts = entries.filter((e) => e.category === "blog" && !e.draft);
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();

export const sources = rawSources as Record<string, { path: string; syncedAt: string }>;
export const sourceOf = (slug: string) => sources[slug] ?? null;
export const lastSyncAt = Object.values(sources)[0]?.syncedAt ?? "";
