"use client";

import { Reveal } from "@/components/motion/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <Reveal>
      <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        <div
          className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
        >
          <span className="h-px w-8 bg-orange" />
          <span className="text-xs font-semibold uppercase tracking-wider text-orange">
            {eyebrow}
          </span>
        </div>
        <h2 className="mt-4 whitespace-pre-line font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h2>
        {sub && <p className="mt-4 text-fg-muted">{sub}</p>}
      </div>
    </Reveal>
  );
}
