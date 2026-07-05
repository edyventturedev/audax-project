"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

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

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-faint">
        {es ? "Mensajes" : "Messages"}
      </h3>

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
