-- LUTs: tienda de presets de color descargables/comprables.
-- Catálogo gestionado desde el panel admin (como el blog), con archivos en Storage.

-- ─────────────────────────────────────────────────────────────
-- luts (catálogo)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.luts (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name_es        text not null,
  name_en        text not null default '',
  desc_es        text not null default '',
  desc_en        text not null default '',
  category       text not null default 'General',
  price          integer not null default 0,        -- centavos MXN; 0 = gratis
  cover_image    text,                               -- URL pública (look "después")
  preview_before text,                               -- URL pública (opcional, "antes")
  file_path      text,                               -- ruta en el bucket privado 'lut-files'
  file_name      text,
  format         text not null default 'cube',       -- cube, 3dl, zip…
  featured       boolean not null default false,
  status         text not null default 'draft'
    check (status in ('draft', 'published')),
  downloads      integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists luts_status_idx on public.luts (status, featured desc, created_at desc);

alter table public.luts enable row level security;

-- Público: solo los publicados.
drop policy if exists "luts public read" on public.luts;
create policy "luts public read" on public.luts
  for select using (status = 'published' or public.is_admin());

-- Admin: control total.
drop policy if exists "luts admin all" on public.luts;
create policy "luts admin all" on public.luts
  for all using (public.is_admin()) with check (public.is_admin());

-- updated_at automático (reutiliza el trigger touch_updated_at del esquema inicial).
drop trigger if exists trg_luts_touch on public.luts;
create trigger trg_luts_touch
  before update on public.luts
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- lut_downloads (accesos: descargas gratis registradas + compras)
-- Un renglón por (lut, usuario). 'granted' = puede descargar.
-- Los renglones los crea/actualiza SIEMPRE el servidor (service role);
-- por eso no hay política de inserción/actualización para clientes.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.lut_downloads (
  id                          uuid primary key default gen_random_uuid(),
  lut_id                      uuid not null references public.luts (id) on delete cascade,
  user_id                     uuid not null references public.profiles (id) on delete cascade,
  kind                        text not null check (kind in ('free', 'paid')),
  amount                      integer not null default 0,   -- centavos pagados
  status                      text not null default 'granted'
    check (status in ('pending', 'granted')),
  stripe_checkout_session_id  text,
  created_at                  timestamptz not null default now(),
  unique (lut_id, user_id)
);

create index if not exists lut_downloads_user_idx on public.lut_downloads (user_id);

alter table public.lut_downloads enable row level security;

-- El usuario ve sus propios accesos (para saber qué ya tiene). Escritura solo servidor/admin.
drop policy if exists "lut_downloads owner read" on public.lut_downloads;
create policy "lut_downloads owner read" on public.lut_downloads
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "lut_downloads admin write" on public.lut_downloads;
create policy "lut_downloads admin write" on public.lut_downloads
  for all using (public.is_admin()) with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- Storage: dos buckets.
--   • lut-files  (privado): los archivos descargables (.cube/.zip).
--     Las descargas se sirven con URLs firmadas desde el servidor (service role),
--     así que no hace falta política de lectura para clientes.
--   • lut-covers (público): portadas y previsualizaciones.
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('lut-files',  'lut-files',  false),
  ('lut-covers', 'lut-covers', true)
on conflict (id) do nothing;

-- lut-files: solo admin gestiona (subir/borrar). Lectura de clientes vía service role.
drop policy if exists "lut-files admin all" on storage.objects;
create policy "lut-files admin all" on storage.objects
  for all
  using (bucket_id = 'lut-files' and public.is_admin())
  with check (bucket_id = 'lut-files' and public.is_admin());

-- lut-covers: lectura pública, escritura admin.
drop policy if exists "lut-covers public read" on storage.objects;
create policy "lut-covers public read" on storage.objects
  for select using (bucket_id = 'lut-covers');

drop policy if exists "lut-covers admin write" on storage.objects;
create policy "lut-covers admin write" on storage.objects
  for all
  using (bucket_id = 'lut-covers' and public.is_admin())
  with check (bucket_id = 'lut-covers' and public.is_admin());
