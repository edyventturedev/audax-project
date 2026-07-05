-- Audax v4 — esquema inicial (Postgres / Supabase)
-- Ejecutar en Supabase: SQL Editor → pega este archivo → Run.
-- Incluye tablas, seguridad por fila (RLS) y trigger de creación de perfil.

-- ─────────────────────────────────────────────────────────────
-- Extensiones
-- ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('client', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pricing_type as enum ('fixed', 'quote');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'pending_quote', 'quoted', 'paid', 'in_progress', 'review', 'delivered', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type milestone_status as enum ('pending', 'active', 'done');
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────
-- profiles (1:1 con auth.users)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  phone       text,
  role        user_role not null default 'client',
  created_at  timestamptz not null default now()
);

-- Función auxiliar: ¿el usuario actual es admin? (SECURITY DEFINER evita recursión RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- services (catálogo)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  category      text not null,
  name_es       text not null,
  name_en       text not null,
  desc_es       text,
  desc_en       text,
  price_min     integer not null,
  price_max     integer not null,
  unit_es       text,
  unit_en       text,
  pricing_type  pricing_type not null default 'quote',
  popular       boolean not null default false,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- orders
-- ─────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references public.profiles (id) on delete cascade,
  service_slug              text,
  service_name              text not null,
  category                  text,
  pricing_type              pricing_type not null,
  status                    order_status not null default 'pending_quote',
  amount_total              integer,            -- en centavos MXN
  currency                  text not null default 'mxn',
  brief                     text,               -- descripción del cliente
  stripe_checkout_session_id text,
  stripe_payment_intent      text,
  stripe_invoice_id          text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

-- ─────────────────────────────────────────────────────────────
-- order_milestones (barra de progreso)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.order_milestones (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  title       text not null,
  description text,
  status      milestone_status not null default 'pending',
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists milestones_order_idx on public.order_milestones (order_id);

-- ─────────────────────────────────────────────────────────────
-- order_messages (hilo cliente ↔ Audax)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.order_messages (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  sender_id  uuid not null references auth.users (id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_order_idx on public.order_messages (order_id);

-- ─────────────────────────────────────────────────────────────
-- deliverables (archivos finales en Storage)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.deliverables (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  file_path  text not null,   -- ruta en el bucket de Storage
  file_name  text not null,
  size_bytes bigint,
  created_at timestamptz not null default now()
);
create index if not exists deliverables_order_idx on public.deliverables (order_id);

-- updated_at automático en orders
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- ═════════════════════════════════════════════════════════════
-- RLS
-- ═════════════════════════════════════════════════════════════
alter table public.profiles         enable row level security;
alter table public.services         enable row level security;
alter table public.orders           enable row level security;
alter table public.order_milestones enable row level security;
alter table public.order_messages   enable row level security;
alter table public.deliverables     enable row level security;

-- profiles
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- services (lectura pública de los activos; escritura solo admin)
drop policy if exists "services public read" on public.services;
create policy "services public read" on public.services
  for select using (active or public.is_admin());
drop policy if exists "services admin write" on public.services;
create policy "services admin write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- orders
drop policy if exists "orders owner read" on public.orders;
create policy "orders owner read" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "orders owner insert" on public.orders;
create policy "orders owner insert" on public.orders
  for insert with check (user_id = auth.uid());
drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- helper: ¿el pedido pertenece al usuario o es admin?
create or replace function public.can_access_order(oid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.orders o
    where o.id = oid and (o.user_id = auth.uid() or public.is_admin())
  );
$$;

-- order_milestones (lectura dueño/admin; escritura admin)
drop policy if exists "milestones read" on public.order_milestones;
create policy "milestones read" on public.order_milestones
  for select using (public.can_access_order(order_id));
drop policy if exists "milestones admin write" on public.order_milestones;
create policy "milestones admin write" on public.order_milestones
  for all using (public.is_admin()) with check (public.is_admin());

-- order_messages (dueño y admin pueden leer y escribir)
drop policy if exists "messages read" on public.order_messages;
create policy "messages read" on public.order_messages
  for select using (public.can_access_order(order_id));
drop policy if exists "messages insert" on public.order_messages;
create policy "messages insert" on public.order_messages
  for insert with check (public.can_access_order(order_id) and sender_id = auth.uid());

-- deliverables (lectura dueño/admin; escritura admin)
drop policy if exists "deliverables read" on public.deliverables;
create policy "deliverables read" on public.deliverables
  for select using (public.can_access_order(order_id));
drop policy if exists "deliverables admin write" on public.deliverables;
create policy "deliverables admin write" on public.deliverables
  for all using (public.is_admin()) with check (public.is_admin());
