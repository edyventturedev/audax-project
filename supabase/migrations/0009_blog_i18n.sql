-- Blog bilingüe (ES/EN) + 4 artículos iniciales con portada.

alter table public.blog_posts
  add column if not exists title_en text,
  add column if not exists excerpt_en text,
  add column if not exists body_en text,
  add column if not exists tag_en text;

insert into public.blog_posts
  (slug, title, title_en, excerpt, excerpt_en, tag, tag_en, cover_image, body, body_en, read_min, status, published_at)
values
(
  'cuanto-cuesta-un-logo-profesional-en-mexico',
  $t$¿Cuánto cuesta un logo profesional en México en 2026?$t$,
  $t$How much does a professional logo cost in Mexico in 2026?$t$,
  $e$Rangos reales de precio para el diseño de un logo, qué incluye cada nivel y cómo saber cuánto invertir según tu negocio.$e$,
  $e$Real price ranges for logo design, what each tier includes, and how to know how much to invest for your business.$e$,
  'Diseño y marca', 'Design & Brand',
  'https://picsum.photos/seed/audax-brand/1280/720?grayscale',
  $md$Un logo es la cara de tu negocio: lo primero que ve un cliente y lo que queda en su memoria. Por eso la pregunta no es solo «cuánto cuesta», sino «cuánto vale hacerlo bien». Aquí te damos rangos reales para México en 2026.

## Los rangos de precio

- **$1,500 – $3,000 MXN — Básico.** Un logo sencillo, normalmente de un freelancer que apenas empieza o de plantillas. Sirve para salir del paso, pero rara vez incluye variantes ni guía de uso.
- **$5,500 – $12,000 MXN — Profesional.** Diseño a la medida con investigación de tu marca, propuestas, variantes y una guía básica de uso. Es el punto ideal para la mayoría de los negocios.
- **$15,000+ MXN — Identidad completa.** Además del logo, incluye paleta, tipografías, aplicaciones y manual de marca. Para negocios que quieren una imagen sólida desde el día uno.

## ¿Qué incluye un logo bien hecho?

- Varias versiones (color, blanco y negro, ícono suelto)
- Archivos en todos los formatos (vector, PNG, SVG) listos para web e imprenta
- Una guía de uso para que tu marca se vea consistente en todos lados

## Por qué el más barato sale caro

Un logo genérico te obliga a rediseñar en un año, reimprimir papelería y perder consistencia. Invertir bien una vez es más barato que hacerlo dos veces.

## Cómo cotizar sin fricción

En Audax eliges el servicio, respondes unas preguntas y recibes una cotización clara — sin llamadas ni esperas. Y sigues el avance de tu marca en tu panel privado.$md$,
  $md$Your logo is the face of your business: the first thing a customer sees and what sticks in their memory. So the question isn't only "how much does it cost," but "how much is it worth to do it right." Here are real ranges for Mexico in 2026.

## Price ranges

- **$1,500 – $3,000 MXN — Basic.** A simple logo, usually from a beginner freelancer or templates. It gets you started, but rarely includes variants or a usage guide.
- **$5,500 – $12,000 MXN — Professional.** Custom design with brand research, proposals, variants and a basic usage guide. The sweet spot for most businesses.
- **$15,000+ MXN — Full identity.** Beyond the logo: palette, typography, applications and a brand manual. For businesses that want a solid image from day one.

## What a well-made logo includes

- Several versions (color, black and white, standalone icon)
- Files in every format (vector, PNG, SVG) ready for web and print
- A usage guide so your brand looks consistent everywhere

## Why the cheapest ends up expensive

A generic logo forces you to redesign within a year, reprint stationery and lose consistency. Investing once, well, is cheaper than doing it twice.

## Quoting without friction

At Audax you pick the service, answer a few questions and get a clear quote — no calls, no waiting. And you track your brand's progress in your private dashboard.$md$,
  4, 'published', '2026-07-10T14:00:00Z'
),
(
  'pagina-web-vs-redes-sociales',
  $t$Página web vs. redes sociales: ¿qué necesita tu negocio?$t$,
  $t$Website vs. social media: what does your business need?$t$,
  $e$No compiten, se complementan. Te explicamos qué hace cada una y por qué tu negocio necesita ambas para vender más.$e$,
  $e$They don't compete, they complement each other. Here's what each one does and why your business needs both to sell more.$e$,
  'Estrategia', 'Strategy',
  'https://picsum.photos/seed/audax-web/1280/720?grayscale',
  $md$«Ya tengo Instagram, ¿para qué una página web?» Es una de las dudas más comunes. La respuesta corta: no compiten, se complementan — pero cada una cumple un papel muy distinto.

## Las redes son para descubrir; la web es para convertir

En redes la gente te encuentra y te conoce. Pero cuando ya está lista para comprar o confiar, una página web propia cierra la venta con información clara, precios y un botón de acción.

## Lo que solo tu web puede hacer

- **Aparecer en Google** cuando alguien busca tu servicio con intención de compra.
- **Vender o agendar 24/7**, sin depender de responder cada mensaje.
- **Ser tuya de verdad**: si cambia el algoritmo o suspenden tu cuenta, no pierdes a tus clientes.

## Lo que las redes hacen mejor

- Construir comunidad y mostrar tu día a día.
- Llegar a gente nueva con contenido que se comparte.

## La combinación ganadora

Usa las redes para atraer y tu web para convertir. El flujo ideal: te descubren en Instagram, entran a tu web, ven tu oferta y compran o cotizan en línea.

## Da el paso

En Audax puedes tener tu sitio profesional y cotizar en minutos, sin fricción.$md$,
  $md$"I already have Instagram, why would I need a website?" It's one of the most common questions. The short answer: they don't compete, they complement each other — but each plays a very different role.

## Social is for discovery; your site is for conversion

On social, people find you and get to know you. But when they're ready to buy or trust, your own website closes the sale with clear information, pricing and a call to action.

## What only your website can do

- **Show up on Google** when someone searches your service with intent to buy.
- **Sell or book 24/7**, without depending on replying to every message.
- **Truly be yours**: if the algorithm changes or your account is suspended, you don't lose your customers.

## What social does better

- Build community and show your day to day.
- Reach new people with shareable content.

## The winning combination

Use social to attract and your website to convert. The ideal flow: they discover you on Instagram, visit your site, see your offer and buy or request a quote online.

## Take the step

At Audax you can have your professional site and get a quote in minutes, with zero friction.$md$,
  4, 'published', '2026-07-09T14:00:00Z'
),
(
  '5-senales-tu-negocio-necesita-tienda-en-linea',
  $t$5 señales de que tu negocio necesita una tienda en línea$t$,
  $t$5 signs your business needs an online store$t$,
  $e$Vender por mensajes funciona… hasta que deja de funcionar. Estas señales indican que ya es momento de una tienda en línea.$e$,
  $e$Selling through DMs works… until it doesn't. These signs mean it's time for an online store.$e$,
  'E-commerce', 'E-commerce',
  'https://picsum.photos/seed/audax-store/1280/720?grayscale',
  $md$Vender por mensajes directos funciona… hasta que deja de funcionar. Si te identificas con estas señales, tu negocio ya está listo para una tienda en línea.

## 1. Pasas horas respondiendo «¿precio?» y «¿disponible?»

Una tienda muestra catálogo, precios y existencias 24/7. Dejas de repetir lo mismo y el cliente compra solo.

## 2. Pierdes ventas fuera de horario

Con una tienda en línea, tu negocio vende mientras duermes. El cliente paga en el momento en que se decide, no cuando tú contestas.

## 3. El cobro es un caos

Transferencias, capturas, confirmaciones… Una tienda cobra con tarjeta y te confirma el pago al instante, sin fricción.

## 4. No sabes qué se vende más

Una tienda te da datos: qué productos se mueven, cuánto vendes y de dónde llegan tus clientes. Decisiones con información, no a ciegas.

## 5. Quieres crecer más allá de tu ciudad

Las redes tienen alcance limitado; una tienda te abre a todo México. Envíos, catálogo y pagos, todo en un lugar.

## El siguiente paso

En Audax armamos tu tienda con pagos, inventario y una experiencia lista para vender. Cotiza en línea en minutos.$md$,
  $md$Selling through direct messages works… until it doesn't. If these signs sound familiar, your business is ready for an online store.

## 1. You spend hours answering "price?" and "in stock?"

A store shows your catalog, prices and stock 24/7. You stop repeating yourself and customers buy on their own.

## 2. You lose sales after hours

With an online store, your business sells while you sleep. Customers pay the moment they decide, not when you reply.

## 3. Payments are chaos

Transfers, screenshots, confirmations… A store charges by card and confirms payment instantly, with no friction.

## 4. You don't know what sells best

A store gives you data: which products move, how much you sell and where customers come from. Decisions with information, not blind guesses.

## 5. You want to grow beyond your city

Social has limited reach; a store opens you to all of Mexico. Shipping, catalog and payments, all in one place.

## The next step

At Audax we build your store with payments, inventory and an experience ready to sell. Get a quote online in minutes.$md$,
  4, 'published', '2026-07-08T14:00:00Z'
),
(
  'como-elegir-nombre-y-marca-de-tu-negocio',
  $t$Cómo elegir el nombre y la marca de tu negocio$t$,
  $t$How to choose your business name and brand$t$,
  $e$El nombre y la marca son tu primera impresión. Una guía práctica para elegir bien desde el inicio.$e$,
  $e$Your name and brand are your first impression. A practical guide to choosing well from the start.$e$,
  'Diseño y marca', 'Design & Brand',
  'https://picsum.photos/seed/audax-name/1280/720?grayscale',
  $md$El nombre y la marca de tu negocio son la primera impresión — y no hay segunda oportunidad para causarla. Aquí una guía práctica para elegir bien.

## 1. Que sea fácil de decir y recordar

Si la gente no puede pronunciarlo o escribirlo, no te va a buscar. Corto, claro y sin complicaciones gana.

## 2. Revisa que esté disponible

Antes de enamorarte de un nombre, verifica el dominio (.com o .mx) y el usuario en redes. Que todo coincida te ahorra dolores de cabeza.

## 3. Piensa en el futuro, no solo en hoy

Evita nombres que te encasillen. Un nombre con margen te deja expandirte a otros productos o ciudades.

## 4. La marca es más que el logo

Es cómo suena, cómo se ve y cómo hace sentir a tu cliente. Colores, tipografía y tono consistentes construyen confianza con el tiempo.

## 5. Prueba antes de lanzar

Dilo en voz alta, pídelo a conocidos, escríbelo. Si genera dudas o malas asociaciones, mejor ajústalo ahora que después.

## Hazlo con quien sabe

En Audax diseñamos tu identidad completa — nombre, logo y marca — para que tu negocio se vea profesional desde el primer día.$md$,
  $md$Your business name and brand are the first impression — and there's no second chance to make it. Here's a practical guide to choosing well.

## 1. Make it easy to say and remember

If people can't pronounce or spell it, they won't search for you. Short, clear and simple wins.

## 2. Check that it's available

Before falling in love with a name, verify the domain (.com or .mx) and the social handle. Having everything match saves you headaches.

## 3. Think about the future, not just today

Avoid names that box you in. A name with room to grow lets you expand into other products or cities.

## 4. A brand is more than a logo

It's how it sounds, how it looks and how it makes your customer feel. Consistent colors, typography and tone build trust over time.

## 5. Test before you launch

Say it out loud, ask people, write it down. If it raises doubts or bad associations, adjust it now rather than later.

## Do it with pros

At Audax we design your full identity — name, logo and brand — so your business looks professional from day one.$md$,
  4, 'published', '2026-07-07T14:00:00Z'
)
on conflict (slug) do nothing;
