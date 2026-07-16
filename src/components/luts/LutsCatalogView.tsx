"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Loader2, Lock, ShoppingCart, CheckCircle2, Layers, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { createClient } from "@/lib/supabase/client";
import { formatCentsMXN } from "@/lib/orders";
import { localizeLut, isFree, type Lut } from "@/lib/lutText";
import { localizePack, itemsValue, type LutPack } from "@/lib/packText";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function LutsCatalogView({
  luts,
  packs = [],
}: {
  luts: Lut[];
  packs?: LutPack[];
}) {
  const { lang } = useLanguage();
  const es = lang === "es";
  const router = useRouter();
  const { user } = useSupabaseUser();
  const searchParams = useSearchParams();
  const justPurchased = searchParams.get("purchased");
  const packPurchased = searchParams.get("pack_purchased");

  // Slugs que el usuario ya posee (descarga gratis registrada o compra pagada).
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [ownedPacks, setOwnedPacks] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOwned = useCallback(async () => {
    if (!user) {
      setOwned(new Set());
      setOwnedPacks(new Set());
      return;
    }
    const supabase = createClient();
    const [{ data: dl }, { data: pp }] = await Promise.all([
      supabase.from("lut_downloads").select("lut_id").eq("status", "granted"),
      supabase.from("lut_pack_purchases").select("pack_id").eq("status", "granted"),
    ]);
    const bySlug = new Map(luts.map((l) => [l.id, l.slug]));
    const slugs = new Set<string>();
    for (const row of (dl as { lut_id: string }[]) ?? []) {
      const slug = bySlug.get(row.lut_id);
      if (slug) slugs.add(slug);
    }
    setOwned(slugs);
    const packById = new Map(packs.map((p) => [p.id, p.slug]));
    const packSlugs = new Set<string>();
    for (const row of (pp as { pack_id: string }[]) ?? []) {
      const slug = packById.get(row.pack_id);
      if (slug) packSlugs.add(slug);
    }
    setOwnedPacks(packSlugs);
  }, [user, luts, packs]);

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

  async function packAction(pack: LutPack) {
    if (requireLogin()) return;
    setError(null);
    setBusy(`pack:${pack.slug}`);
    try {
      const free = isFree(pack);
      const endpoint = free ? "/api/luts/pack-claim" : "/api/luts/pack-checkout";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: pack.slug }),
      });
      const data = await res.json();
      if (free) {
        if (res.ok) {
          setOwnedPacks((prev) => new Set(prev).add(pack.slug));
          await loadOwned();
        } else {
          setError(data.error ?? (es ? "No se pudo obtener el paquete." : "Could not claim the pack."));
        }
        setBusy(null);
      } else if (res.ok && data.url) {
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

      {(justPurchased || packPurchased) && (
        <Reveal>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-sm text-success">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {packPurchased
              ? es
                ? "¡Paquete confirmado! Todos sus LUTs quedaron desbloqueados — descárgalos abajo."
                : "Pack confirmed! All its LUTs are unlocked — download them below."
              : es
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

      {/* Paquetes */}
      {packs.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center gap-2 text-sm font-semibold text-fg">
            <Layers className="h-4 w-4 text-orange" />
            {es ? "Paquetes" : "Bundles"}
          </div>
          <p className="mt-1 text-sm text-fg-dim">
            {es
              ? "Varios LUTs juntos, a mejor precio."
              : "Several LUTs together, at a better price."}
          </p>
          <RevealGroup className="mt-5 grid gap-6 sm:grid-cols-2">
            {packs.map((pack) => (
              <RevealItem key={pack.slug}>
                <PackCard
                  pack={pack}
                  es={es}
                  lang={lang}
                  owned={ownedPacks.has(pack.slug)}
                  busy={busy === `pack:${pack.slug}`}
                  onAction={() => packAction(pack)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {packs.length > 0 && luts.length > 0 && (
        <div className="mt-14 flex items-center gap-2 text-sm font-semibold text-fg">
          <Download className="h-4 w-4 text-orange" />
          {es ? "LUTs individuales" : "Individual LUTs"}
        </div>
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

function PackCard({
  pack,
  es,
  lang,
  owned,
  busy,
  onAction,
}: {
  pack: LutPack;
  es: boolean;
  lang: "es" | "en";
  owned: boolean;
  busy: boolean;
  onAction: () => void;
}) {
  const l = localizePack(pack, lang);
  const free = isFree(pack);
  const value = itemsValue(pack.items);
  const savings = value - pack.price;
  const count = pack.items.length;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-orange/30 bg-ink-3 transition-colors hover:border-orange/60">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-ink-2 to-ink-3">
        {pack.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pack.cover_image}
            alt={l.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Layers className="h-10 w-10 text-fg-faint" />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Layers className="h-3 w-3" />
          {count} LUT{count === 1 ? "" : "s"}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            free ? "bg-success/90 text-white" : "bg-orange text-white"
          }`}
        >
          {free ? (es ? "Gratis" : "Free") : formatCentsMXN(pack.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold leading-snug tracking-tight text-balance">
          {l.name}
        </h3>
        {l.desc && <p className="mt-1.5 line-clamp-2 text-sm text-fg-muted">{l.desc}</p>}

        {count > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pack.items.slice(0, 6).map((it) => (
              <span
                key={it.slug}
                className="rounded-full bg-glass px-2.5 py-1 text-[11px] text-fg-dim"
              >
                {(lang === "en" && it.name_en) || it.name_es}
              </span>
            ))}
            {count > 6 && (
              <span className="rounded-full bg-glass px-2.5 py-1 text-[11px] text-fg-dim">
                +{count - 6}
              </span>
            )}
          </div>
        )}

        {!free && savings > 0 && value > 0 && (
          <p className="mt-3 text-xs text-success">
            {es ? "Ahorras" : "You save"} {formatCentsMXN(savings)} ·{" "}
            {es ? "valor individual" : "individual value"} {formatCentsMXN(value)}
          </p>
        )}

        <div className="mt-5 flex-1" />

        {owned ? (
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-success/40 bg-success/10 px-5 py-2.5 text-sm font-semibold text-success">
            <Check className="h-4 w-4" />
            {es ? "Desbloqueado · descárgalos abajo" : "Unlocked · download below"}
          </div>
        ) : (
          <button
            onClick={onAction}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-mid disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : free ? (
              <Download className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            {free
              ? es
                ? "Obtener gratis"
                : "Get for free"
              : es
                ? `Comprar paquete · ${formatCentsMXN(pack.price)}`
                : `Buy pack · ${formatCentsMXN(pack.price)}`}
          </button>
        )}
      </div>
    </div>
  );
}
