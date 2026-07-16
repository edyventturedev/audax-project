"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Loader2, Lock, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { createClient } from "@/lib/supabase/client";
import { formatCentsMXN } from "@/lib/orders";
import { localizeLut, isFree, type Lut } from "@/lib/lutText";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function LutsCatalogView({ luts }: { luts: Lut[] }) {
  const { lang } = useLanguage();
  const es = lang === "es";
  const router = useRouter();
  const { user } = useSupabaseUser();
  const searchParams = useSearchParams();
  const justPurchased = searchParams.get("purchased");

  // Slugs que el usuario ya posee (descarga gratis registrada o compra pagada).
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOwned = useCallback(async () => {
    if (!user) {
      setOwned(new Set());
      return;
    }
    const supabase = createClient();
    const { data } = await supabase
      .from("lut_downloads")
      .select("lut_id")
      .eq("status", "granted");
    const byId = new Map(luts.map((l) => [l.id, l.slug]));
    const slugs = new Set<string>();
    for (const row of (data as { lut_id: string }[]) ?? []) {
      const slug = byId.get(row.lut_id);
      if (slug) slugs.add(slug);
    }
    setOwned(slugs);
  }, [user, luts]);

  useEffect(() => {
    loadOwned();
  }, [loadOwned]);

  function requireLogin(): boolean {
    if (user) return false;
    router.push(`/login?next=${encodeURIComponent("/luts")}`);
    return true;
  }

  async function download(lut: Lut) {
    if (requireLogin()) return;
    setError(null);
    setBusy(lut.slug);
    try {
      const res = await fetch("/api/luts/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: lut.slug }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setOwned((prev) => new Set(prev).add(lut.slug));
        window.location.href = data.url;
      } else {
        setError(
          data.error ??
            (es ? "No se pudo generar la descarga." : "Could not start the download."),
        );
      }
    } finally {
      setBusy(null);
    }
  }

  async function buy(lut: Lut) {
    if (requireLogin()) return;
    setError(null);
    setBusy(lut.slug);
    try {
      const res = await fetch("/api/luts/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: lut.slug }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? (es ? "No se pudo iniciar el pago." : "Could not start checkout."));
        setBusy(null);
      }
    } catch {
      setBusy(null);
    }
  }

  const freeCount = luts.filter((l) => isFree(l)).length;

  return (
    <div className="mx-auto max-w-[1080px] px-6 pt-32 pb-20 sm:pt-40">
      <Reveal>
        <header className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-orange" />
            <span className="text-xs font-semibold uppercase tracking-wider text-orange">
              LUTs
            </span>
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            {es
              ? "Presets de color para tus fotos y videos"
              : "Color presets for your photos and videos"}
          </h1>
          <p className="mt-4 text-lg text-fg-muted">
            {es
              ? "Aplica un look cinematográfico en un clic. Compatibles con Premiere, DaVinci, Final Cut, CapCut y Lightroom. Descarga gratis o compra los packs premium."
              : "Apply a cinematic look in one click. Works with Premiere, DaVinci, Final Cut, CapCut and Lightroom. Download for free or buy the premium packs."}
          </p>
          {freeCount > 0 && (
            <p className="mt-3 text-sm text-fg-dim">
              {es
                ? `${freeCount} LUT${freeCount === 1 ? "" : "s"} gratis disponibles.`
                : `${freeCount} free LUT${freeCount === 1 ? "" : "s"} available.`}
            </p>
          )}
        </header>
      </Reveal>

      {justPurchased && (
        <Reveal>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-sm text-success">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {es
              ? "¡Compra confirmada! Tu LUT ya está desbloqueado — pulsa Descargar en la tarjeta."
              : "Purchase confirmed! Your LUT is unlocked — hit Download on its card."}
          </div>
        </Reveal>
      )}

      {error && (
        <p className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      {luts.length === 0 ? (
        <p className="mt-16 text-fg-dim">
          {es ? "Pronto publicaremos nuevos LUTs." : "New LUTs coming soon."}
        </p>
      ) : (
        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {luts.map((lut) => (
            <RevealItem key={lut.slug}>
              <LutCard
                lut={lut}
                es={es}
                lang={lang}
                owned={owned.has(lut.slug)}
                busy={busy === lut.slug}
                onDownload={() => download(lut)}
                onBuy={() => buy(lut)}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}

function LutCard({
  lut,
  es,
  lang,
  owned,
  busy,
  onDownload,
  onBuy,
}: {
  lut: Lut;
  es: boolean;
  lang: "es" | "en";
  owned: boolean;
  busy: boolean;
  onDownload: () => void;
  onBuy: () => void;
}) {
  const l = localizeLut(lut, lang);
  const free = isFree(lut);
  const canDownload = free || owned;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-3 transition-colors hover:border-line-strong">
      {/* Portada con comparación antes/después al pasar el cursor */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-ink-2 to-ink-3">
        {lut.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lut.cover_image}
            alt={l.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        {lut.preview_before && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lut.preview_before}
              alt={`${l.name} — ${es ? "antes" : "before"}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {es ? "Pasa el cursor: antes" : "Hover: before"}
            </span>
          </>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            free ? "bg-success/90 text-white" : "bg-orange text-white"
          }`}
        >
          {free ? (es ? "Gratis" : "Free") : formatCentsMXN(lut.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-fg-dim">
          <span className="rounded-full bg-orange-soft px-2.5 py-1 font-medium text-orange">
            {lut.category}
          </span>
          {lut.format && (
            <span className="uppercase tracking-wider text-fg-faint">.{lut.format}</span>
          )}
        </div>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold leading-snug tracking-tight text-balance">
          {l.name}
        </h3>
        {l.desc && (
          <p className="mt-1.5 line-clamp-2 text-sm text-fg-muted">{l.desc}</p>
        )}

        <div className="mt-5 flex-1" />

        {canDownload ? (
          <button
            onClick={onDownload}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-mid disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {owned && !free
              ? es
                ? "Descargar"
                : "Download"
              : es
                ? "Descargar gratis"
                : "Download free"}
          </button>
        ) : (
          <button
            onClick={onBuy}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-mid disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            {es ? `Comprar · ${formatCentsMXN(lut.price)}` : `Buy · ${formatCentsMXN(lut.price)}`}
          </button>
        )}

        {!canDownload && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-fg-faint">
            <Lock className="h-3 w-3" />
            {es ? "Descarga inmediata tras el pago" : "Instant download after payment"}
          </p>
        )}
      </div>
    </div>
  );
}
