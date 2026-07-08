import type { Metadata } from "next";
import Link from "next/link";
import { MessagesSquare, LifeBuoy, Newspaper } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Foro de la comunidad — Próximamente",
  description:
    "La comunidad de Audax: un espacio para resolver dudas, compartir ideas y aprender entre negocios. Muy pronto. Mientras tanto, visita el Centro de ayuda.",
  alternates: { canonical: "/foro" },
  openGraph: {
    title: "Foro de la comunidad — Audax Project",
    description: "Un espacio para la comunidad. Muy pronto.",
    url: "/foro",
    type: "website",
  },
};

export default function ForoPage() {
  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-[720px] flex-col items-center justify-center px-6 pt-32 pb-16 text-center sm:pt-40">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Foro", path: "/foro" },
        ])}
      />

      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-soft text-orange">
        <MessagesSquare className="h-7 w-7" />
      </span>

      <span className="mt-6 rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fg-dim">
        Próximamente
      </span>

      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
        La comunidad Audax
        <br />
        <span className="text-orange">está en camino</span>
      </h1>
      <p className="mt-4 max-w-md text-fg-muted">
        Estamos construyendo un foro donde los negocios podrán resolver dudas,
        compartir ideas y aprender juntos. Mientras tanto, tenemos otras formas
        de ayudarte:
      </p>

      <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
        <Link
          href="/ayuda"
          className="group rounded-3xl border border-line bg-ink-3 p-6 text-left transition-colors hover:border-line-strong"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-soft text-orange">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-semibold">Centro de ayuda</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Cómo funciona la plataforma y preguntas frecuentes.
          </p>
        </Link>
        <Link
          href="/blog"
          className="group rounded-3xl border border-line bg-ink-3 p-6 text-left transition-colors hover:border-line-strong"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-soft text-orange">
            <Newspaper className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-semibold">Blog</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Guías e ideas para hacer crecer tu negocio en línea.
          </p>
        </Link>
      </div>
    </div>
  );
}
