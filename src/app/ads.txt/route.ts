// ads.txt para Google AdSense. Se genera solo si hay publisher id configurado.
// El id viene como "ca-pub-XXXX"; ads.txt necesita solo "pub-XXXX".
export const dynamic = "force-static";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
  const pub = client.replace(/^ca-/, "");
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# ads.txt — configura NEXT_PUBLIC_ADSENSE_CLIENT para habilitar AdSense\n";
  return new Response(body, {
    headers: { "content-type": "text/plain" },
  });
}
