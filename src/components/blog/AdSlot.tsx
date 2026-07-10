"use client";

import { useEffect } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const DEFAULT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

/**
 * Bloque de anuncio de Google AdSense (solo en el blog). Si no hay
 * NEXT_PUBLIC_ADSENSE_CLIENT + slot configurados, no renderiza nada
 * (así no quedan huecos vacíos mientras no está aprobado AdSense).
 */
export function AdSlot({
  slot = DEFAULT_SLOT,
  className = "",
}: {
  slot?: string;
  className?: string;
}) {
  useEffect(() => {
    if (!CLIENT || !slot) return;
    try {
      // @ts-expect-error adsbygoogle lo inyecta el script de AdSense
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, [slot]);

  if (!CLIENT || !slot) return null;

  return (
    <div className={`my-8 overflow-hidden rounded-2xl ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
