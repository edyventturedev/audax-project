import type { Metadata } from "next";
import Link from "next/link";
import {
  MousePointerClick,
  FileText,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Centro de ayuda — Cómo funciona Audax",
  description:
    "Aprende cómo funciona la plataforma de Audax: solicita un servicio, recibe tu cotización, paga en línea y sigue el avance de tu proyecto. Preguntas frecuentes.",
  alternates: { canonical: "/ayuda" },
  openGraph: {
    title: "Centro de ayuda — Audax Project",
    description: "Cómo solicitar, pagar y dar seguimiento a tu proyecto.",
    url: "/ayuda",
    type: "website",
  },
};

const steps = [
  {
    icon: MousePointerClick,
    title: "1. Elige tu servicio",
    text: "Explora el catálogo y elige lo que necesitas: diseño, web, apps, foto o video.",
  },
  {
    icon: FileText,
    title: "2. Recibe tu cotización",
    text: "Servicios de precio fijo se pagan al instante; los proyectos a medida reciben una cotización clara.",
  },
  {
    icon: CreditCard,
    title: "3. Paga en línea, seguro",
    text: "Pago protegido con Stripe (tarjeta). Primero se confirma el pago y luego arranca el trabajo.",
  },
  {
    icon: LayoutDashboard,
    title: "4. Sigue tu proyecto",
    text: "Desde tu panel ves el avance por etapas, chateas con nosotros y descargas tus entregables.",
  },
];

const faqs = [
  {
    q: "¿Cómo pido un servicio?",
    a: "Entra a Servicios, elige el que necesitas y sigue los pasos. Si es de precio fijo, pagas al momento; si es a medida, nos cuentas tu proyecto y te enviamos una cotización para pagar con un clic.",
  },
  {
    q: "¿Qué formas de pago aceptan?",
    a: "Pagos con tarjeta a través de Stripe, de forma 100% segura. El cobro se procesa en línea y recibes confirmación al instante.",
  },
  {
    q: "¿Primero pago o primero entregan?",
    a: "Trabajamos con el modelo de pago primero: una vez confirmado el pago, arrancamos tu proyecto y se activan las herramientas de seguimiento en tu panel.",
  },
  {
    q: "¿Cómo veo el avance de mi proyecto?",
    a: "En tu panel privado verás las etapas (hitos) de tu proyecto en tiempo real, podrás enviarnos mensajes y descargar los archivos finales cuando estén listos.",
  },
  {
    q: "¿Trabajan con negocios de todo México?",
    a: "Sí. Trabajamos 100% en línea, así que atendemos negocios de cualquier parte del país.",
  },
  {
    q: "¿Puedo pedir cambios a mi proyecto?",
    a: "Claro. A través del chat de tu pedido nos comunicas tus comentarios y coordinamos los ajustes según el servicio contratado.",
  },
];

export default function AyudaPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-[900px] px-6 pt-32 pb-16 sm:pt-40">
      <JsonLd data={faqSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Centro de ayuda", path: "/ayuda" },
        ])}
      />

      <header className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-orange" />
          <span className="text-xs font-semibold uppercase tracking-wider text-orange">
            Centro de ayuda
          </span>
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
          Cómo funciona Audax
        </h1>
        <p className="mt-4 text-fg-muted">
          Solicitar un servicio es simple y sin fricción. Así funciona de
          principio a fin.
        </p>
      </header>

      {/* Pasos */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="rounded-3xl border border-line bg-ink-3 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-soft text-orange">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
              <p className="mt-1.5 text-sm text-fg-muted">{s.text}</p>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <h2 className="mt-16 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        Preguntas frecuentes
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {faqs.map((f) => (
          <div
            key={f.q}
            className="rounded-2xl border border-line bg-ink-3 p-6"
          >
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{f.a}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-3xl border border-line bg-ink-3 p-8 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
          ¿Aún tienes dudas?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
          Escríbenos y con gusto te orientamos para elegir el servicio ideal.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/servicios" size="lg">
            Ver servicios
          </Button>
          <Link
            href="/foro"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-glass"
          >
            Visitar el foro
          </Link>
        </div>
      </div>
    </div>
  );
}
