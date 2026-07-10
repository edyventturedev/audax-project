import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FORUM_CATEGORY_SLUGS } from "@/data/forum";
import { moderateText } from "@/lib/forumModeration";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Inicia sesión para publicar." }, { status: 401 });
  }

  const { category, title, body } = (await request.json().catch(() => ({}))) as {
    category?: string;
    title?: string;
    body?: string;
  };

  if (!category || !FORUM_CATEGORY_SLUGS.includes(category)) {
    return NextResponse.json({ error: "Elige una categoría válida." }, { status: 400 });
  }
  const titleCheck = moderateText(title ?? "", { min: 5, max: 140 });
  if (!titleCheck.ok) return NextResponse.json({ error: titleCheck.reason }, { status: 400 });
  const bodyCheck = moderateText(body ?? "", { min: 10, max: 8000 });
  if (!bodyCheck.ok) return NextResponse.json({ error: bodyCheck.reason }, { status: 400 });

  const { data, error } = await supabase
    .from("forum_threads")
    .insert({
      category,
      user_id: user.id,
      title: (title ?? "").trim(),
      body: (body ?? "").trim(),
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "No se pudo publicar el tema." }, { status: 500 });
  }
  return NextResponse.json({ id: data.id });
}
