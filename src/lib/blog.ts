import { createClient } from "@/lib/supabase/server";

export { slugify, estimateReadMin } from "@/lib/blogText";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  title_en: string | null;
  excerpt: string;
  excerpt_en: string | null;
  tag: string;
  tag_en: string | null;
  cover_image: string | null;
  body: string; // Markdown
  body_en: string | null;
  read_min: number;
  status: "draft" | "scheduled" | "published";
  published_at: string | null;
};

const FIELDS =
  "id, slug, title, title_en, excerpt, excerpt_en, tag, tag_en, cover_image, body, body_en, read_min, status, published_at";

/** Posts visibles al público (no borradores y con fecha ya alcanzada). */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(FIELDS)
    .neq("status", "draft")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  return (data as BlogPost[]) ?? [];
}

/** Un post publicado por slug (o null si no existe / no está publicado). */
export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(FIELDS)
    .eq("slug", slug)
    .neq("status", "draft")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  return (data as BlogPost) ?? null;
}
