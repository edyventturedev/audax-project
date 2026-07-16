import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { categories, services } from "@/data/services";
import { getPublishedPosts } from "@/lib/blog";
import { getRecentThreads } from "@/lib/forum";
import { FORUM_CATEGORIES } from "@/data/forum";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [blogPosts, threads] = await Promise.all([
    getPublishedPosts(),
    getRecentThreads(500),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/servicios`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/luts`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/ayuda`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/foro`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/aviso-de-privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terminos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug !== "packages")
    .map((c) => ({
      url: `${SITE_URL}/servicios/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/servicios/detalle/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const forumCategoryPages: MetadataRoute.Sitemap = FORUM_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/foro/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const forumThreadPages: MetadataRoute.Sitemap = threads.map((t) => ({
    url: `${SITE_URL}/foro/hilo/${t.id}`,
    lastModified: new Date(t.last_activity_at),
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...servicePages,
    ...blogPages,
    ...forumCategoryPages,
    ...forumThreadPages,
  ];
}
