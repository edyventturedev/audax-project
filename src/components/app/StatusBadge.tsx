"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { STATUS_META, TONE_CLASSES, type OrderStatus } from "@/lib/orders";
import { cn } from "@/lib/cn";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { lang } = useLanguage();
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        TONE_CLASSES[meta.tone],
      )}
    >
      {meta[lang]}
    </span>
  );
}
