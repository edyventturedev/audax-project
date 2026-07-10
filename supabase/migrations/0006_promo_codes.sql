-- Códigos de descuento para campañas (creadores/influencers).

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  percent_off int not null check (percent_off > 0 and percent_off <= 100),
  description text,
  active boolean not null default true,
  max_redemptions int,               -- null = ilimitado
  times_redeemed int not null default 0,
  created_at timestamptz not null default now()
);

-- Normaliza el código a MAYÚSCULAS y sin espacios, en insert/update.
create or replace function public.normalize_promo_code()
returns trigger language plpgsql as $$
begin
  new.code := upper(regexp_replace(new.code, '\s', '', 'g'));
  return new;
end;
$$;

drop trigger if exists trg_normalize_promo_code on public.promo_codes;
create trigger trg_normalize_promo_code
  before insert or update on public.promo_codes
  for each row execute function public.normalize_promo_code();

alter table public.promo_codes enable row level security;

-- Solo el admin gestiona los códigos. La validación pública se hace en el
-- servidor con la service-role key (rutas API), no leyendo la tabla en cliente.
drop policy if exists "promo admin all" on public.promo_codes;
create policy "promo admin all" on public.promo_codes
  for all using (public.is_admin()) with check (public.is_admin());

-- Registrar en el pedido qué código se usó (para atribución de campañas).
alter table public.orders add column if not exists promo_code text;

-- Incrementa el uso de un código. Se llama desde el webhook (service role)
-- solo cuando el pago se completa, para contar canjes reales.
create or replace function public.redeem_promo_code(p_code text)
returns void language sql security definer
set search_path = public as $$
  update public.promo_codes
  set times_redeemed = times_redeemed + 1
  where code = upper(regexp_replace(p_code, '\s', '', 'g'));
$$;
