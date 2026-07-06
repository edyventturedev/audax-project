-- Audax v4 — permitir que el ADMIN elimine pedidos.
-- La tabla orders solo tenía políticas de select/insert/update; sin una
-- política de delete, RLS bloquea el borrado incluso para el admin.
-- Al borrar un pedido, el "on delete cascade" de las llaves foráneas elimina
-- automáticamente sus hitos, mensajes y filas de entregables.
-- (Los archivos en Storage se limpian aparte desde la app antes de borrar.)

drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete" on public.orders
  for delete using (public.is_admin());
