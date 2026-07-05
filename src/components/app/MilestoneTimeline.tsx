"use client";

import { Check, Loader2, Circle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Milestone } from "@/lib/orders";
import { cn } from "@/lib/cn";

export function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const { lang } = useLanguage();
  const sorted = [...milestones].sort((a, b) => a.position - b.position);
  const done = sorted.filter((m) => m.status === "done").length;
  const pct = sorted.length ? Math.round((done / sorted.length) * 100) : 0;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-fg-faint">
          {lang === "es" ? "Progreso" : "Progress"}
        </h3>
        <span className="text-sm font-semibold text-orange tabular-nums">
          {pct}%
        </span>
      </div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-glass">
        <div
          className="h-full rounded-full bg-orange transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="relative space-y-1">
        {sorted.map((m, i) => {
          const isLast = i === sorted.length - 1;
          return (
            <li key={m.id} className="relative flex gap-4 pb-5">
              {!isLast && (
                <span
                  className={cn(
                    "absolute left-[11px] top-7 h-full w-px",
                    m.status === "done" ? "bg-orange/50" : "bg-line",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  m.status === "done"
                    ? "bg-orange text-white"
                    : m.status === "active"
                      ? "bg-orange-soft text-orange"
                      : "bg-glass text-fg-faint",
                )}
              >
                {m.status === "done" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : m.status === "active" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Circle className="h-2 w-2 fill-current" />
                )}
              </span>
              <div className="pt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium",
                    m.status === "pending" ? "text-fg-dim" : "text-fg",
                  )}
                >
                  {m.title}
                </p>
                {m.description && (
                  <p className="mt-0.5 text-xs text-fg-dim">{m.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
