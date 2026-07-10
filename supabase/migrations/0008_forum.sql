-- Foro de la comunidad: hilos y respuestas por categoría (solo rubro Audax).
-- Lectura pública; escribir requiere cuenta. Moderación por reportes + admin.

create table if not exists public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  category text not null
    check (category in ('desarrollo-web', 'diseno-marca', 'marketing', 'soporte')),
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default 'Miembro',
  title text not null,
  body text not null,
  locked boolean not null default false,
  pinned boolean not null default false,
  reply_count int not null default 0,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default 'Miembro',
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.forum_reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('thread', 'reply')),
  target_id uuid not null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists forum_threads_cat_idx
  on public.forum_threads (category, pinned desc, last_activity_at desc);
create index if not exists forum_replies_thread_idx
  on public.forum_replies (thread_id, created_at);

-- Rellena user_id + author_name desde el perfil autenticado (no falsificable).
create or replace function public.set_forum_author()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  fname text;
begin
  new.user_id := auth.uid();
  select nullif(full_name, '') into fname from public.profiles where id = auth.uid();
  new.author_name := coalesce(fname, 'Miembro');
  return new;
end;
$$;

drop trigger if exists trg_thread_author on public.forum_threads;
create trigger trg_thread_author before insert on public.forum_threads
  for each row execute function public.set_forum_author();

drop trigger if exists trg_reply_author on public.forum_replies;
create trigger trg_reply_author before insert on public.forum_replies
  for each row execute function public.set_forum_author();

-- Mantiene el contador de respuestas y la última actividad del hilo.
create or replace function public.bump_thread_on_reply()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.forum_threads
      set reply_count = reply_count + 1, last_activity_at = now()
      where id = new.thread_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.forum_threads
      set reply_count = greatest(reply_count - 1, 0)
      where id = old.thread_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_reply_bump on public.forum_replies;
create trigger trg_reply_bump
  after insert or delete on public.forum_replies
  for each row execute function public.bump_thread_on_reply();

-- RLS
alter table public.forum_threads enable row level security;
alter table public.forum_replies enable row level security;
alter table public.forum_reports enable row level security;

-- Hilos: lectura pública; crea el dueño; modera el admin; borra dueño o admin.
drop policy if exists "threads read" on public.forum_threads;
create policy "threads read" on public.forum_threads for select using (true);

drop policy if exists "threads insert" on public.forum_threads;
create policy "threads insert" on public.forum_threads
  for insert with check (auth.uid() = user_id);

drop policy if exists "threads update admin" on public.forum_threads;
create policy "threads update admin" on public.forum_threads
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "threads delete" on public.forum_threads;
create policy "threads delete" on public.forum_threads
  for delete using (auth.uid() = user_id or public.is_admin());

-- Respuestas: lectura pública; crea el dueño solo si el hilo no está cerrado.
drop policy if exists "replies read" on public.forum_replies;
create policy "replies read" on public.forum_replies for select using (true);

drop policy if exists "replies insert" on public.forum_replies;
create policy "replies insert" on public.forum_replies
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.forum_threads t
      where t.id = thread_id and t.locked = false
    )
  );

drop policy if exists "replies delete" on public.forum_replies;
create policy "replies delete" on public.forum_replies
  for delete using (auth.uid() = user_id or public.is_admin());

-- Reportes: cualquiera autenticado crea; solo el admin ve/gestiona.
drop policy if exists "reports insert" on public.forum_reports;
create policy "reports insert" on public.forum_reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists "reports admin read" on public.forum_reports;
create policy "reports admin read" on public.forum_reports
  for select using (public.is_admin());

drop policy if exists "reports admin update" on public.forum_reports;
create policy "reports admin update" on public.forum_reports
  for update using (public.is_admin()) with check (public.is_admin());
