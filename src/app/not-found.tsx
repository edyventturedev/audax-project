import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/site/Logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-[600px] -translate-x-1/2 rounded-full opacity-40 blur-[64px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,41,0.25) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <Logo />
        <p className="mt-10 font-[family-name:var(--font-display)] text-7xl font-extrabold text-orange">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold">Página no encontrada</h1>
        <p className="mt-2 max-w-sm text-fg-dim">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-mid"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Link>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-glass"
          >
            <ArrowLeft className="h-4 w-4" />
            Ver servicios
          </Link>
        </div>
      </div>
    </main>
  );
}
