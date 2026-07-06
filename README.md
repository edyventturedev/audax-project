# Audax Project — Web app

Plataforma de servicios creativos (tipo Fiverr, sin la fricción de "en quién confiar"):
el cliente elige un servicio, recibe cotización o paga precio fijo, **paga en línea** y
**sigue el progreso** de su proyecto en un panel privado. Incluye panel de administración
para cotizar, gestionar avances y entregar archivos.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Framer Motion** (animaciones)
- **Supabase** — Postgres + Auth (Google + email) + Storage, con **RLS**
- **Stripe** — pagos (Checkout) + webhooks
- i18n ligero **ES/EN**

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:3000
```

Necesitas un archivo `.env.local` con las claves de Supabase y Stripe.
Ver **[SETUP.md](./SETUP.md)** para la configuración completa (Supabase, Google OAuth,
Stripe, migraciones SQL).

Para el webhook de Stripe en local:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Base de datos

Migraciones en [`supabase/migrations/`](./supabase/migrations) — ejecútalas en orden en el
SQL Editor de Supabase. Definen tablas, RLS, trigger de perfiles, semilla de servicios,
realtime y políticas de Storage.

## Despliegue

Ver **[DEPLOY.md](./DEPLOY.md)** (Vercel + variables de entorno + webhook de producción).

## Estructura

```
src/
  app/                 rutas (marketing, auth, app/dashboard, admin, api)
  components/          UI: site, landing, auth, app, service, ui, motion
  data/services.ts     catálogo de servicios (fuente + semilla)
  i18n/                diccionario ES/EN + provider
  lib/                 supabase (client/server/admin), stripe, orders, utils
supabase/migrations/   esquema SQL + RLS + seeds
legacy/                sitio estático anterior (referencia)
```
