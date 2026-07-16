-- Semilla del catálogo de servicios (precios en pesos MXN).
-- Idempotente: on conflict (slug) actualiza.

insert into public.services
  (slug, category, name_es, name_en, desc_es, desc_en, price_min, price_max, unit_es, unit_en, pricing_type, popular)
values
  ('logo-design','design','Diseño de logo','Logo Design','Logotipo profesional con variantes y guía de uso básica.','Professional logo with variants and a basic usage guide.',4400,9600,null,null,'quote',true),
  ('business-cards','design','Tarjetas de presentación','Business Cards','Diseño de tarjetas listo para imprenta.','Print-ready business card design.',960,2000,null,null,'fixed',false),
  ('flyers','design','Flyers','Flyers','Flyer promocional digital o para imprenta.','Promotional flyer for digital or print.',720,1600,null,null,'fixed',false),
  ('menu-design','design','Diseño de menú','Menu Design','Menú para restaurante o bar, físico o digital.','Restaurant or bar menu, physical or digital.',2800,6400,null,null,'quote',false),
  ('packaging-labels','design','Packaging & etiquetas','Packaging & Labels','Diseño de empaque y etiquetas de producto.','Product packaging and label design.',3200,7200,null,null,'quote',false),
  ('landing-page','tech','Landing page','Landing Page','Página de una sola sección optimizada para conversión.','Single-page site optimized for conversion.',7200,14400,null,null,'quote',true),
  ('business-website','tech','Sitio web de negocio','Business Website','Sitio multipágina con CMS y buenas prácticas SEO.','Multi-page website with CMS and SEO best practices.',17600,44000,null,null,'quote',false),
  ('e-commerce','tech','E-commerce','E-Commerce','Tienda en línea con pagos y gestión de inventario.','Online store with payments and inventory management.',36000,96000,null,null,'quote',false),
  ('app-ui-ux','tech','Diseño UI/UX de app','App UI/UX Design','Diseño de interfaz y experiencia para tu aplicación.','Interface and experience design for your app.',9600,24000,null,null,'quote',false),
  ('multiplatform-app','tech','App multiplataforma','Multiplatform App','Aplicación iOS + Android desde una base de código.','iOS + Android application from a single codebase.',44000,160000,null,null,'quote',false),
  ('restaurant-session','photo','Sesión restaurante & bar','Restaurant & Bar Session','Sesión fotográfica de platillos, bebidas y ambiente.','Photo session of dishes, drinks and atmosphere.',3600,7200,null,null,'quote',true),
  ('photo-editing','photo','Edición de fotos','Photo Editing','Retoque y edición profesional por foto.','Professional retouching and editing per photo.',64,160,'/ foto','/ photo','fixed',false),
  ('video-editing','photo','Edición de video','Video Editing','Edición profesional por minuto de video final.','Professional editing per minute of final video.',400,960,'/ min','/ min','quote',false),
  ('reels-social','photo','Reels / Redes sociales','Reels / Social Media','Paquete mensual de reels y contenido para redes.','Monthly package of reels and social content.',2800,5600,'/ mes','/ month','quote',false)
on conflict (slug) do update set
  category = excluded.category,
  name_es = excluded.name_es, name_en = excluded.name_en,
  desc_es = excluded.desc_es, desc_en = excluded.desc_en,
  price_min = excluded.price_min, price_max = excluded.price_max,
  unit_es = excluded.unit_es, unit_en = excluded.unit_en,
  pricing_type = excluded.pricing_type, popular = excluded.popular;
