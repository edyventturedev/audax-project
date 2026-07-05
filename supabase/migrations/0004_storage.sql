-- Storage: bucket privado "deliverables" + políticas.
-- Convención de ruta: <order_id>/<archivo>. Así el primer segmento identifica el pedido.
-- NOTA: crea el bucket "deliverables" (privado) desde el panel Storage, o descomenta:
-- insert into storage.buckets (id, name, public) values ('deliverables','deliverables',false)
--   on conflict (id) do nothing;

-- Admin: control total sobre los archivos del bucket.
drop policy if exists "deliverables admin all" on storage.objects;
create policy "deliverables admin all" on storage.objects
  for all
  using (bucket_id = 'deliverables' and public.is_admin())
  with check (bucket_id = 'deliverables' and public.is_admin());

-- Cliente: puede LEER/descargar solo los archivos de SUS pedidos
-- (el primer segmento de la ruta es el order_id).
drop policy if exists "deliverables owner read" on storage.objects;
create policy "deliverables owner read" on storage.objects
  for select
  using (
    bucket_id = 'deliverables'
    and exists (
      select 1 from public.orders o
      where o.id = ((storage.foldername(name))[1])::uuid
        and o.user_id = auth.uid()
    )
  );
