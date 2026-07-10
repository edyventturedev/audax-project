-- Blog CMS: posts editables/programables desde el panel admin.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  tag text not null default 'General',
  cover_image text,
  body text not null default '',              -- Markdown
  read_min int not null default 4,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_live_idx
  on public.blog_posts (published_at desc);

alter table public.blog_posts enable row level security;

-- Público: solo posts publicados/programados cuya fecha ya llegó.
drop policy if exists "blog public read" on public.blog_posts;
create policy "blog public read" on public.blog_posts
  for select using (
    status <> 'draft'
    and published_at is not null
    and published_at <= now()
  );

-- Admin: control total.
drop policy if exists "blog admin all" on public.blog_posts;
create policy "blog admin all" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- updated_at automático.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_blog_touch on public.blog_posts;
create trigger trg_blog_touch
  before update on public.blog_posts
  for each row execute function public.touch_updated_at();

-- Semilla: los dos artículos que ya existían (convertidos a Markdown).
insert into public.blog_posts
  (slug, title, excerpt, tag, body, read_min, status, published_at)
values
(
  'cuanto-cuesta-una-pagina-web-en-mexico',
  $t$¿Cuánto cuesta una página web en México en 2026?$t$,
  $e$Precios reales por tipo de sitio (landing, negocio, e-commerce), qué incluye cada uno y cómo saber cuál necesitas.$e$,
  'Desarrollo web',
  $md$Es la primera pregunta de todo negocio que quiere estar en internet: ¿cuánto cuesta una página web? La respuesta honesta es «depende» — pero aquí te damos rangos reales para que no te vendan humo.

## 1. Landing page: desde $9,000 MXN

Una sola página, enfocada en una acción (vender un producto, captar contactos o promocionar un evento). Es la opción ideal para empezar rápido y con presupuesto acotado.

- Diseño a la medida optimizado para conversión
- Formulario de contacto o botón de WhatsApp
- Optimización básica de SEO y velocidad

## 2. Sitio de negocio: desde $22,000 MXN

Varias páginas (inicio, servicios, nosotros, contacto), gestor de contenido para que actualices tú mismo, y buenas prácticas de SEO para posicionar en Google.

## 3. Tienda en línea (e-commerce): desde $45,000 MXN

Catálogo de productos, carrito, pagos en línea y gestión de inventario. El precio varía según la cantidad de productos y las integraciones (envíos, facturación, etc.).

## ¿Qué hace que el precio suba o baje?

- Cantidad de páginas y secciones
- Diseño a la medida vs. plantilla
- Integraciones (pagos, reservas, CRM)
- Contenido: ¿tú lo entregas o lo creamos nosotros?

## La forma sin fricción de cotizar

En Audax puedes elegir tu servicio, recibir una cotización clara y pagar en línea — sin llamadas ni esperas. Y una vez que arranca, ves el avance de tu proyecto en tu panel privado.$md$,
  6, 'published', '2026-07-07T12:00:00Z'
),
(
  'por-que-tu-negocio-necesita-una-pagina-web',
  $t$5 razones por las que tu negocio necesita una página web (aunque tengas redes)$t$,
  $e$Instagram y Facebook no son suficientes. Te explicamos por qué una web propia sigue siendo tu mejor inversión digital.$e$,
  'Estrategia',
  $md$«Ya tengo Instagram, ¿para qué quiero página web?» Lo escuchamos seguido. La verdad: las redes son rentadas; tu página web es tuya. Aquí las razones.

## 1. Las redes son prestadas, tu web es tuya

Si mañana cambia el algoritmo o suspenden tu cuenta, pierdes el acceso a tus clientes. Tu página web es un activo que controlas al 100%.

## 2. Apareces en Google cuando te buscan

Cuando alguien busca «tu servicio + tu ciudad», una web bien hecha te pone frente a clientes con intención de compra. Una cuenta de redes no rankea igual.

## 3. Generas confianza al instante

Un negocio con sitio propio se percibe más serio y establecido. Es la diferencia entre «parece formal» y «mejor busco otro».

## 4. Vendes y agendas 24/7

Tu web trabaja mientras duermes: recibe pedidos, reservas o mensajes sin que tú tengas que responder cada DM manualmente.

## 5. Controlas tu marca y tu mensaje

Sin distracciones de otros anuncios ni límites de formato. Tú decides cómo se ve y qué historia cuentas.

## El siguiente paso

No tiene que ser complicado ni caro para empezar. Explora nuestros servicios y cotiza en línea en un par de minutos.$md$,
  5, 'published', '2026-07-06T12:00:00Z'
)
on conflict (slug) do nothing;
