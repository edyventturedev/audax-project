/**
 * Envío de correos transaccionales vía Resend (API REST, sin dependencias).
 * Se activa con RESEND_API_KEY en Vercel. Si no está, se omite en silencio
 * (registra un aviso) para no romper ningún flujo.
 *
 * Notas de configuración:
 * - EMAIL_FROM: remitente. Por defecto usa el dominio de pruebas de Resend
 *   (onboarding@resend.dev), que solo entrega al correo de tu cuenta Resend.
 *   Para escribir a clientes, verifica un dominio en Resend y pon algo como
 *   "Audax Project <hola@tudominio.com>".
 * - ADMIN_EMAIL: a dónde llegan los avisos de nuevas solicitudes/pagos.
 */
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
const FROM = process.env.EMAIL_FROM || `${SITE_NAME} <onboarding@resend.dev>`;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

async function sendRaw(
  to: string | string[],
  subject: string,
  html: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY ausente; correo omitido:", subject);
    return;
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) {
      console.error("[email] fallo:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[email] error de red:", err);
  }
}

/** Plantilla base de la marca (naranja sobre blanco, compatible con correo). */
function template(opts: {
  heading: string;
  intro: string;
  rows?: { label: string; value: string }[];
  cta?: { label: string; href: string };
  footnote?: string;
}): string {
  const { heading, intro, rows = [], cta, footnote } = opts;
  const rowsHtml = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:6px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap;">${r.label}</td>
        <td style="padding:6px 0 6px 16px;color:#111827;font-size:14px;">${r.value}</td>
      </tr>`,
    )
    .join("");
  const ctaHtml = cta
    ? `<a href="${cta.href}" style="display:inline-block;margin-top:24px;background:#ff6b29;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:9999px;">${cta.label}</a>`
    : "";
  return `<!doctype html>
<html><body style="margin:0;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:#0a0a0a;padding:20px 28px;">
          <span style="color:#ffffff;font-weight:800;font-size:18px;letter-spacing:-0.02em;">Audax<span style="color:#ff6b29;">.</span></span>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 8px;font-size:20px;color:#111827;">${heading}</h1>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#374151;">${intro}</p>
          ${rows.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e5e7eb;margin-top:8px;padding-top:8px;">${rowsHtml}</table>` : ""}
          ${ctaHtml}
          ${footnoteHtml(footnote)}
        </td></tr>
        <tr><td style="padding:18px 28px;background:#fafafa;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">${SITE_NAME} · <a href="${SITE_URL}" style="color:#9ca3af;">${SITE_URL.replace("https://", "")}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function footnoteHtml(text?: string): string {
  return text
    ? `<p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#9ca3af;">${text}</p>`
    : "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

/** Aviso al admin: llegó una nueva solicitud de cotización. */
export async function notifyAdminNewQuote(opts: {
  serviceName: string;
  brief: string;
  clientEmail?: string;
  orderId: string;
}): Promise<void> {
  const html = template({
    heading: "🔔 Nueva solicitud de cotización",
    intro: `Un cliente solicitó una cotización de <strong>${opts.serviceName}</strong>. Respóndele pronto para no perder la venta.`,
    rows: [
      { label: "Servicio", value: opts.serviceName },
      { label: "Cliente", value: opts.clientEmail ?? "—" },
      {
        label: "Brief",
        value: opts.brief ? escapeHtml(opts.brief) : "(sin detalles)",
      },
    ],
    cta: { label: "Ver y cotizar", href: `${SITE_URL}/admin/orders/${opts.orderId}` },
  });
  await sendRaw(ADMIN_EMAIL, `🔔 Nueva solicitud: ${opts.serviceName}`, html);
}

/** Confirmación al cliente: recibimos tu solicitud. */
export async function confirmQuoteToClient(opts: {
  to: string;
  serviceName: string;
  orderId: string;
}): Promise<void> {
  const html = template({
    heading: "Recibimos tu solicitud ✅",
    intro: `Gracias por confiar en Audax. Ya tenemos tu solicitud de <strong>${opts.serviceName}</strong> y te enviaremos una cotización a la brevedad.`,
    cta: { label: "Ver mi solicitud", href: `${SITE_URL}/dashboard/orders/${opts.orderId}` },
    footnote:
      "También puedes escribirnos por el chat de tu panel o por WhatsApp si tienes dudas.",
  });
  await sendRaw(opts.to, `Recibimos tu solicitud · ${opts.serviceName}`, html);
}

/** Aviso al admin: se recibió un pago. */
export async function notifyAdminPayment(opts: {
  serviceName: string;
  clientEmail?: string;
  amountLabel?: string;
  orderId: string;
}): Promise<void> {
  const html = template({
    heading: "💰 Pago recibido",
    intro: `Entró un pago por <strong>${opts.serviceName}</strong>. Arranca el proyecto y actualiza el avance en el panel.`,
    rows: [
      { label: "Servicio", value: opts.serviceName },
      { label: "Cliente", value: opts.clientEmail ?? "—" },
      ...(opts.amountLabel ? [{ label: "Monto", value: opts.amountLabel }] : []),
    ],
    cta: { label: "Abrir pedido", href: `${SITE_URL}/admin/orders/${opts.orderId}` },
  });
  await sendRaw(ADMIN_EMAIL, `💰 Pago recibido: ${opts.serviceName}`, html);
}

/** Confirmación al cliente: pago confirmado. */
export async function confirmPaymentToClient(opts: {
  to: string;
  serviceName: string;
  orderId: string;
}): Promise<void> {
  const html = template({
    heading: "¡Pago confirmado! 🎉",
    intro: `Recibimos tu pago de <strong>${opts.serviceName}</strong>. Ya arrancamos: sigue el avance de tu proyecto en tiempo real desde tu panel.`,
    cta: { label: "Ver mi proyecto", href: `${SITE_URL}/dashboard/orders/${opts.orderId}` },
  });
  await sendRaw(opts.to, `Pago confirmado · ${opts.serviceName}`, html);
}
