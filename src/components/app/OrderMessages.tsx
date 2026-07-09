"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import { MEETING_URL, CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/cn";

// Logo de Google Meet (SVG oficial simplificado).
function GoogleMeetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 87 72" className={className} aria-hidden>
      <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z" />
      <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z" />
      <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
      <path fill="#2684fc" d="M0 20.5h20.5v31H0z" />
      <path
        fill="#00ac47"
        d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"
      />
      <path
        fill="#ffba00"
        d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"
      />
    </svg>
  );
}

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export function OrderMessages({
  orderId,
  currentUserId,
}: {
  orderId: string;
  currentUserId: string;
}) {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const es = lang === "es";

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("order_messages")
        .select("id, sender_id, body, created_at")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });
      if (active) setMessages((data as Message[]) ?? []);
    }
    load();

    const channel = supabase
      .channel(`messages-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "order_messages",
          filter: `order_id=eq.${orderId}`,
        },
        // Refetch on any new message so the payload shape never matters.
        () => load(),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("order_messages")
      .insert({ order_id: orderId, sender_id: currentUserId, body });
    if (!error) setText("");
    setSending(false);
  }

  // Enlace para agendar: agenda de citas de Google (crea Meet + entra al
  // calendario). Si no está configurada, cae a un correo con asunto.
  const meetingHref =
    MEETING_URL ||
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      es ? "Agendar videollamada" : "Schedule a video call",
    )}`;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-fg-faint">
          {es ? "Mensajes" : "Messages"}
        </h3>
        <a
          href={meetingHref}
          target={MEETING_URL ? "_blank" : undefined}
          rel={MEETING_URL ? "noreferrer" : undefined}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-ink-2 px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
        >
          <GoogleMeetIcon className="h-4 w-4" />
          {es ? "Agendar videollamada" : "Schedule a call"}
        </a>
      </div>

      <div className="mb-4 max-h-80 flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-fg-dim">
            {es
              ? "Escríbenos aquí sobre tu proyecto."
              : "Message us here about your project."}
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            return (
              <div
                key={m.id}
                className={cn("flex", mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    mine
                      ? "bg-orange text-white"
                      : "bg-ink-2 text-fg border border-line",
                  )}
                >
                  {!mine && (
                    <span className="mb-0.5 block text-[11px] font-semibold text-orange">
                      Audax
                    </span>
                  )}
                  <p className="whitespace-pre-wrap">{m.body}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={es ? "Escribe un mensaje…" : "Type a message…"}
          className="flex-1 rounded-full border border-line bg-ink-2 px-4 py-2.5 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-orange"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange text-white transition-colors hover:bg-orange-mid disabled:opacity-50"
          aria-label={es ? "Enviar" : "Send"}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}
