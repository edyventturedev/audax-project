import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt =
  "Audax Project — Desarrollo web y diseño en Mérida, Yucatán";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen que se muestra al compartir el enlace (WhatsApp, Facebook, X…).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(1000px 600px at 78% -10%, rgba(255,107,41,0.35), transparent 60%), #0a0a0a",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "9999px",
              background: "#ff6b29",
            }}
          />
          <div style={{ fontSize: "34px", color: "#ffffff", fontWeight: 700 }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "82px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            Desarrollo web y diseño
          </div>
          <div
            style={{
              fontSize: "82px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              color: "#ff6b29",
            }}
          >
            que impacta.
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "34px",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Diseño · Web · Apps · Foto & Video — Mérida, Yucatán
          </div>
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Solicita, cotiza y paga en línea. Sigue tu proyecto en un solo lugar.
        </div>
      </div>
    ),
    { ...size },
  );
}
