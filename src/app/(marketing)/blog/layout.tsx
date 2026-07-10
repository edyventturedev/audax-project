import Script from "next/script";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Layout del blog. Carga el script de Google AdSense SOLO en el área del blog
 * (para monetizar los artículos). Se activa cuando NEXT_PUBLIC_ADSENSE_CLIENT
 * está definido. Respeta el consentimiento de cookies vía Google Consent Mode
 * (los anuncios arrancan no personalizados hasta que el usuario acepta).
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {CLIENT && (
        <Script
          id="adsense"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
        />
      )}
      {children}
    </>
  );
}
