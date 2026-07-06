import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/site/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-50 blur-[64px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,41,0.22) 0%, transparent 70%)",
        }}
      />
      <div className="relative mb-8 flex w-full max-w-md items-center justify-between">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-fg-dim transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" />
          Inicio
        </Link>
      </div>
      {children}
    </main>
  );
}
