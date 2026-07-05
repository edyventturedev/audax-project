-- Habilita Realtime (para el panel de progreso en vivo) en las tablas del cliente.
-- Realtime respeta las políticas RLS: cada usuario solo recibe cambios de SUS filas.

alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_milestones;
alter publication supabase_realtime add table public.order_messages;
