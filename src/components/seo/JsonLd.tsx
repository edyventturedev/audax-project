/**
 * Inserta datos estructurados (JSON-LD) que Google lee para entender el
 * negocio y sus servicios. Se renderiza en el servidor.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es nuestro (no viene del usuario): seguro de inyectar.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
