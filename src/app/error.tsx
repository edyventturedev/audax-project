"use client";

import { useEffect } from "react";
import { RotateCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-[family-name:var(--font-display)] text-5xl font-extrabold text-orange">
        ¡Ups!
      </p>
      <h1 className="mt-4 text-2xl font-bold">Algo salió mal</h1>
      <p className="mt-2 max-w-sm text-fg-dim">
        Ocurrió un error inesperado. Intenta de nuevo; si persiste,
        contáctanos.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-mid"
        >
          <RotateCw className="h-4 w-4" />
          Reintentar
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-glass"
        >
          <Home className="h-4 w-4" />
          Ir al inicio
        </a>
      </div>
    </main>
  );
}
