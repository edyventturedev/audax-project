export type BlogBlock = { h?: string; p?: string; list?: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readMin: number;
  tag: string;
  body: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "cuanto-cuesta-una-pagina-web-en-mexico",
    title: "¿Cuánto cuesta una página web en México en 2026?",
    excerpt:
      "Precios reales por tipo de sitio (landing, negocio, e-commerce), qué incluye cada uno y cómo saber cuál necesitas.",
    date: "2026-07-07",
    readMin: 6,
    tag: "Desarrollo web",
    body: [
      {
        p: "Es la primera pregunta de todo negocio que quiere estar en internet: ¿cuánto cuesta una página web? La respuesta honesta es «depende» — pero aquí te damos rangos reales para que no te vendan humo.",
      },
      { h: "1. Landing page: desde $9,000 MXN" },
      {
        p: "Una sola página, enfocada en una acción (vender un producto, captar contactos o promocionar un evento). Es la opción ideal para empezar rápido y con presupuesto acotado.",
      },
      {
        list: [
          "Diseño a la medida optimizado para conversión",
          "Formulario de contacto o botón de WhatsApp",
          "Optimización básica de SEO y velocidad",
        ],
      },
      { h: "2. Sitio de negocio: desde $22,000 MXN" },
      {
        p: "Varias páginas (inicio, servicios, nosotros, contacto), gestor de contenido para que actualices tú mismo, y buenas prácticas de SEO para posicionar en Google.",
      },
      { h: "3. Tienda en línea (e-commerce): desde $45,000 MXN" },
      {
        p: "Catálogo de productos, carrito, pagos en línea y gestión de inventario. El precio varía según la cantidad de productos y las integraciones (envíos, facturación, etc.).",
      },
      { h: "¿Qué hace que el precio suba o baje?" },
      {
        list: [
          "Cantidad de páginas y secciones",
          "Diseño a la medida vs. plantilla",
          "Integraciones (pagos, reservas, CRM)",
          "Contenido: ¿tú lo entregas o lo creamos nosotros?",
        ],
      },
      { h: "La forma sin fricción de cotizar" },
      {
        p: "En Audax puedes elegir tu servicio, recibir una cotización clara y pagar en línea — sin llamadas ni esperas. Y una vez que arranca, ves el avance de tu proyecto en tu panel privado.",
      },
    ],
  },
  {
    slug: "por-que-tu-negocio-necesita-una-pagina-web",
    title: "5 razones por las que tu negocio necesita una página web (aunque tengas redes)",
    excerpt:
      "Instagram y Facebook no son suficientes. Te explicamos por qué una web propia sigue siendo tu mejor inversión digital.",
    date: "2026-07-06",
    readMin: 5,
    tag: "Estrategia",
    body: [
      {
        p: "«Ya tengo Instagram, ¿para qué quiero página web?» Lo escuchamos seguido. La verdad: las redes son rentadas; tu página web es tuya. Aquí las razones.",
      },
      { h: "1. Las redes son prestadas, tu web es tuya" },
      {
        p: "Si mañana cambia el algoritmo o suspenden tu cuenta, pierdes el acceso a tus clientes. Tu página web es un activo que controlas al 100%.",
      },
      { h: "2. Apareces en Google cuando te buscan" },
      {
        p: "Cuando alguien busca «tu servicio + tu ciudad», una web bien hecha te pone frente a clientes con intención de compra. Una cuenta de redes no rankea igual.",
      },
      { h: "3. Generas confianza al instante" },
      {
        p: "Un negocio con sitio propio se percibe más serio y establecido. Es la diferencia entre «parece formal» y «mejor busco otro».",
      },
      { h: "4. Vendes y agendas 24/7" },
      {
        p: "Tu web trabaja mientras duermes: recibe pedidos, reservas o mensajes sin que tú tengas que responder cada DM manualmente.",
      },
      { h: "5. Controlas tu marca y tu mensaje" },
      {
        p: "Sin distracciones de otros anuncios ni límites de formato. Tú decides cómo se ve y qué historia cuentas.",
      },
      { h: "El siguiente paso" },
      {
        p: "No tiene que ser complicado ni caro para empezar. Explora nuestros servicios y cotiza en línea en un par de minutos.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
