import type { Metadata } from "next";
import { LegalShell, Section } from "@/components/legal/Legal";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de Privacidad de Audax Project conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México).",
  alternates: { canonical: "/aviso-de-privacidad" },
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Aviso de Privacidad"
      updated="9 de julio de 2026"
      intro={`En ${SITE_NAME} valoramos y protegemos tus datos personales. Este Aviso de Privacidad se emite en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.`}
    >
      <Section title="1. Responsable de tus datos">
        <p>
          {SITE_NAME}, estudio creativo digital con domicilio en Mérida,
          Yucatán, México, es responsable del uso y protección de tus datos
          personales. Para cualquier tema relacionado con este aviso puedes
          contactarnos en{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="2. Datos que recabamos">
        <p>Para prestarte nuestros servicios podemos recabar:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Datos de identificación y contacto: nombre, correo electrónico y, en su caso, teléfono.</li>
          <li>Información sobre tu proyecto o negocio que nos proporciones al solicitar una cotización.</li>
          <li>
            Datos de pago: procesados de forma segura por nuestro proveedor de
            pagos (Stripe). <strong>No almacenamos los datos de tu tarjeta</strong> en
            nuestros servidores.
          </li>
        </ul>
      </Section>

      <Section title="3. Finalidades del tratamiento">
        <p>Usamos tus datos para las siguientes finalidades primarias:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Crear y administrar tu cuenta.</li>
          <li>Elaborar cotizaciones y prestar los servicios contratados.</li>
          <li>Procesar pagos y, en su caso, emitir comprobantes.</li>
          <li>Dar seguimiento a tu proyecto y mantener comunicación contigo.</li>
          <li>Atender dudas, aclaraciones y solicitudes de soporte.</li>
        </ul>
        <p>
          De manera secundaria podemos usarlos para enviarte novedades o
          promociones. Puedes oponerte a estas finalidades en cualquier momento
          escribiéndonos al correo indicado.
        </p>
      </Section>

      <Section title="4. Transferencias y encargados">
        <p>
          Para operar la plataforma utilizamos proveedores que actúan como
          encargados del tratamiento y cumplen sus propios estándares de
          seguridad: <strong>Supabase</strong> (base de datos y autenticación),{" "}
          <strong>Stripe</strong> (pagos), <strong>Google</strong> (inicio de
          sesión y calendario) y <strong>Vercel</strong> (alojamiento). No
          vendemos ni comercializamos tus datos personales con terceros.
        </p>
      </Section>

      <Section title="5. Uso de cookies y tecnologías">
        <p>
          Nuestro sitio puede utilizar cookies y herramientas de analítica (como
          Google Analytics y Meta Pixel) para entender el uso del sitio y mejorar
          tu experiencia. Puedes deshabilitar las cookies desde la configuración
          de tu navegador.
        </p>
      </Section>

      <Section title="6. Tus derechos ARCO">
        <p>
          Tienes derecho a Acceder, Rectificar y Cancelar tus datos personales,
          así como a Oponerte a su tratamiento o revocar tu consentimiento. Para
          ejercer cualquiera de estos derechos envía tu solicitud a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange hover:underline">
            {CONTACT_EMAIL}
          </a>
          , indicando tu nombre y el derecho que deseas ejercer. Responderemos en
          los plazos que marca la ley.
        </p>
      </Section>

      <Section title="7. Cambios a este aviso">
        <p>
          Podemos actualizar este Aviso de Privacidad para reflejar cambios en
          nuestras prácticas o en la legislación aplicable. La versión vigente
          siempre estará disponible en esta página con su fecha de última
          actualización.
        </p>
      </Section>
    </LegalShell>
  );
}
