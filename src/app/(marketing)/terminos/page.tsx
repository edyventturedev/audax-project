import type { Metadata } from "next";
import { LegalShell, Section } from "@/components/legal/Legal";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y Condiciones de uso de la plataforma y los servicios de Audax Project.",
  alternates: { canonical: "/terminos" },
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Términos y Condiciones"
      updated="9 de julio de 2026"
      intro={`Estos Términos y Condiciones regulan el uso de la plataforma y la contratación de los servicios de ${SITE_NAME}. Al crear una cuenta o contratar un servicio, aceptas estos términos.`}
    >
      <Section title="1. Servicios">
        <p>
          {SITE_NAME} ofrece servicios de diseño gráfico, desarrollo web y de
          aplicaciones, fotografía, video y contenido para redes, entre otros.
          El alcance específico de cada proyecto se define en la cotización o
          descripción del servicio contratado.
        </p>
      </Section>

      <Section title="2. Cuenta">
        <p>
          Para contratar necesitas crear una cuenta con información veraz y
          mantener la confidencialidad de tus credenciales. Eres responsable de
          la actividad realizada desde tu cuenta.
        </p>
      </Section>

      <Section title="3. Cotizaciones y precios">
        <p>
          Los precios se expresan en pesos mexicanos (MXN). Algunos servicios
          tienen precio fijo y otros se cotizan según el alcance. Las
          cotizaciones tienen una vigencia y pueden ajustarse si el alcance del
          proyecto cambia respecto a lo acordado.
        </p>
      </Section>

      <Section title="4. Pagos">
        <p>
          Los pagos se procesan de forma segura a través de Stripe. Según el
          servicio, el pago puede requerirse por adelantado o conforme a hitos.
          El trabajo inicia una vez confirmado el pago correspondiente.
        </p>
      </Section>

      <Section title="5. Revisiones y entregables">
        <p>
          Cada servicio incluye un número de revisiones indicado en su
          descripción o cotización. Las revisiones adicionales o cambios fuera
          del alcance acordado pueden generar un costo extra. Los entregables se
          liberan al cliente una vez cubierto el pago total del proyecto.
        </p>
      </Section>

      <Section title="6. Plazos">
        <p>
          Los tiempos de entrega son estimados y dependen de que el cliente
          proporcione a tiempo la información, textos y materiales necesarios.
          Los retrasos en la entrega de estos materiales pueden extender el
          plazo del proyecto.
        </p>
      </Section>

      <Section title="7. Cancelaciones y reembolsos">
        <p>
          Si cancelas un proyecto ya iniciado, se te cobrará por el trabajo
          realizado hasta ese momento. Los montos correspondientes a trabajo ya
          entregado o avanzado no son reembolsables. Cualquier reembolso
          procedente se realizará por el mismo medio de pago.
        </p>
      </Section>

      <Section title="8. Propiedad intelectual">
        <p>
          Una vez cubierto el pago total, los derechos de los entregables
          finales se transfieren al cliente. {SITE_NAME} se reserva el derecho de
          mostrar el trabajo realizado en su portafolio, salvo acuerdo de
          confidencialidad en contrario.
        </p>
      </Section>

      <Section title="9. Limitación de responsabilidad">
        <p>
          {SITE_NAME} no será responsable por daños indirectos o pérdidas
          derivadas del uso de los entregables una vez entregados, ni por
          servicios de terceros (hosting, dominios, plataformas) que el cliente
          contrate de forma independiente.
        </p>
      </Section>

      <Section title="10. Legislación aplicable">
        <p>
          Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.
          Para cualquier controversia, las partes se someten a la jurisdicción
          de los tribunales competentes en Mérida, Yucatán, renunciando a
          cualquier otro fuero.
        </p>
      </Section>

      <Section title="11. Contacto">
        <p>
          Para cualquier duda sobre estos términos, escríbenos a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </LegalShell>
  );
}
