import type { ReactNode } from "react";

/** Contenedor con estilo para documentos legales (aviso, términos). */
export function LegalShell({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-16 sm:py-20">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-fg-faint">
        Última actualización: {updated}
      </p>
      {intro && (
        <p className="mt-6 text-sm leading-relaxed text-fg-muted">{intro}</p>
      )}
      <div className="mt-10 space-y-8">{children}</div>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-fg-muted">
        {children}
      </div>
    </section>
  );
}
