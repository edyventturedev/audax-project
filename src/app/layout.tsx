import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageProvider";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Audax Project — Estudio creativo · Mérida, Yucatán",
    template: "%s · Audax Project",
  },
  description:
    "Foto, video, diseño y desarrollo digital para negocios que quieren destacar. Solicita, cotiza y da seguimiento a tu proyecto en un solo lugar.",
  metadataBase: new URL("https://audaxproject.mx"),
  openGraph: {
    title: "Audax Project — Estudio creativo",
    description:
      "Solicita un servicio, recibe tu cotización y sigue el progreso de tu proyecto.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${syne.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
