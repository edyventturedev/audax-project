-- Paquetes de LUTs: agrupan varios LUTs y se venden juntos (normalmente con descuento).
-- Al comprar un paquete se otorga acceso a TODOS sus LUTs (vía lut_downloads),
-- reutilizando la misma ruta de descarga que un LUT individual.

-- ─────────────────────────────────────────────────────────────
-- lut_packs (catálogo de paquetes)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.lut_packs (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name_es      text not null,
  name_en      text not null default '',
  desc_es      text not null default '',
  desc_en      text not null default '',
  price        integer not null default 0,     -- centavos MXN; 0 = gratis
  cover_image  text,                            -- URL pública
  featured     boolean not null default false,
  status       text not null default 'draft'
    check (status in ('draft', 'published')),
  downloads    integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists lut_packs_status_idx
  on public.lut_packs (status, featured desc, created_at desc);

alter table public.lut_packs enable row level security;

drop policy if exists "lut_packs public read" on public.lut_packs;
create policy "lut_packs public read" on public.lut_packs
  for select using (status = 'published' or public.is_admin());

drop policy if exists "lut_packs admin all" on public.lut_packs;
create policy "lut_packs admin all" on public.lut_packs
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists trg_lut_packs_touch on public.lut_packs;
create trigger trg_lut_packs_touch
  before update on public.lut_packs
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- lut_pack_items (qué LUTs contiene cada paquete)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.lut_pack_items (
  id        uuid primary key default gen_random_uuid(),
  pack_id   uuid not null references public.lut_packs (id) on delete cascade,
  lut_id    uuid not null references public.luts (id) on delete cascade,
  position  integer not null default 0,
  unique (pack_id, lut_id)
);

create index if not exists lut_pack_items_pack_idx on public.lut_pack_items (pack_id);

alter table public.lut_pack_items enable row level security;

-- Lectura pública si el paquete está publicado (o admin). Escritura solo admin.
drop policy if exists "lut_pack_items public read" on public.lut_pack_items;
create policy "lut_pack_items public read" on public.lut_pack_items
  for select using (
    exists (
      select 1 from public.lut_packs p
      where p.id = pack_id and (p.status = 'published' or public.is_admin())
    )
  );

drop policy if exists "lut_pack_items admin write" on public.lut_pack_items;
create policy "lut_pack_items admin write" on public.lut_pack_items
  for all using (public.is_admin()) with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- lut_pack_purchases (compra de un paquete por usuario)
-- La escribe siempre el servidor (service role); no hay política de escritura para clientes.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.lut_pack_purchases (
  id                          uuid primary key default gen_random_uuid(),
  pack_id                     uuid not null references public.lut_packs (id) on delete cascade,
  user_id                     uuid not null references public.profiles (id) on delete cascade,
  kind                        text not null check (kind in ('free', 'paid')),
  amount                      integer not null default 0,
  status                      text not null default 'granted'
    check (status in ('pending', 'granted')),
  stripe_checkout_session_id  text,
  created_at                  timestamptz not null default now(),
  unique (pack_id, user_id)
);

create index if not exists lut_pack_purchases_user_idx on public.lut_pack_purchases (user_id);

alter table public.lut_pack_purchases enable row level security;

drop policy if exists "lut_pack_purchases owner read" on public.lut_pack_purchases;
create policy "lut_pack_purchases owner read" on public.lut_pack_purchases
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "lut_pack_purchases admin write" on public.lut_pack_purchases;
create policy "lut_pack_purchases admin write" on public.lut_pack_purchases
  for all using (public.is_admin()) with check (public.is_admin());
