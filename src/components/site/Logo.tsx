import Image from "next/image";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
      aria-label="Audax Project — inicio"
    >
      <Image
        src="/logo.png"
        alt=""
        width={34}
        height={34}
        className="h-8 w-8 object-contain"
        priority
      />
      <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
        Audax
      </span>
    </Link>
  );
}
