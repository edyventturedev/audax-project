import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { moderateText } from "@/lib/forumModeration";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Inicia sesión para responder." }, { status: 401 });
  }

  const { threadId, body } = (await request.json().catch(() => ({}))) as {
    threadId?: string;
    body?: string;
  };
  if (!threadId) {
    return NextResponse.json({ error: "Falta el hilo." }, { status: 400 });
  }
  const check = moderateText(body ?? "", { min: 2, max: 8000 });
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 400 });

  const { data, error } = await supabase
    .from("forum_replies")
    .insert({ thread_id: threadId, user_id: user.id, body: (body ?? "").trim() })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "No se pudo responder (¿el hilo está cerrado?)." },
      { status: 500 },
    );
  }
  return NextResponse.json({ id: data.id });
}
