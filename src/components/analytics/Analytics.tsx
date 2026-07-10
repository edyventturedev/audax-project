import Script from "next/script";

/**
 * Google Analytics 4 + Meta (Facebook) Pixel, con consentimiento.
 * Ambos arrancan en estado DENEGADO (Google Consent Mode v2 + fbq consent
 * 'revoke') y solo se activan cuando el usuario acepta en el banner de cookies
 * (o si ya lo aceptó en una visita anterior).
 * Solo se inyectan si están definidos NEXT_PUBLIC_GA_ID y/o NEXT_PUBLIC_FB_PIXEL_ID.
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const fb = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  return (
    <>
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('audax:cookie-consent')==='all'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}
gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}

      {fb && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('consent','revoke');
fbq('init','${fb}');
fbq('track','PageView');
try{if(localStorage.getItem('audax:cookie-consent')==='all'){fbq('consent','grant');}}catch(e){}`}
          </Script>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${fb}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
    </>
  );
}
