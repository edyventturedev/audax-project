# Audax v4 — Despliegue a producción (Vercel)

Guía para publicar el sitio. Todo empieza en **modo test** de Stripe; cambias a **live**
solo cuando estés listo para cobrar dinero real.

---

## 1. Subir el código a GitHub

```bash
git checkout main
git merge feature/audax-v4-webapp      # o abre un Pull Request y haz merge
git push origin main
```

Si aún no tienes repo remoto: créalo en https://github.com/new (privado) y:
```bash
git remote add origin https://github.com/TU-USUARIO/audax-web.git
git push -u origin main
```

---

## 2. Importar el proyecto en Vercel

1. Entra a https://vercel.com → **Add New → Project** → importa tu repo de GitHub.
2. Framework: **Next.js** (se detecta solo). No cambies el build command.
3. **Antes de hacer Deploy**, agrega las **Environment Variables** (siguiente sección).

---

## 3. Variables de entorno en Vercel

En **Project → Settings → Environment Variables**, agrega (Production **y** Preview):

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dydsxlvudpdzisfytzjv.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tu anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | tu service-role key (secreta) |
| `NEXT_PUBLIC_SITE_URL` | `https://TU-DOMINIO` (ej. `https://audaxproject.mx`) |
| `STRIPE_SECRET_KEY` | `sk_test_...` (o `sk_live_...` en producción) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` (o `pk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | el `whsec_...` del webhook de producción (paso 5) |

Luego **Deploy**.

---

## 4. Ajustes en Supabase para el dominio de producción

En **Authentication → URL Configuration**:
- **Site URL**: `https://TU-DOMINIO`
- **Redirect URLs**: agrega `https://TU-DOMINIO/**`

En **Google Cloud** (si usas login con Google): el redirect URI de Google **no cambia**
(sigue siendo el de Supabase `https://dydsxlvudpdzisfytzjv.supabase.co/auth/v1/callback`).
Solo asegúrate de que la app OAuth esté **publicada** (no en Testing) para usuarios reales.

---

## 5. Webhook de Stripe en producción

En desarrollo usábamos `stripe listen`. En producción se crea un endpoint permanente:

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. **Endpoint URL**: `https://TU-DOMINIO/api/stripe/webhook`
3. **Events to send**: selecciona `checkout.session.completed` e `invoice.paid`.
4. Crea → copia el **Signing secret** (`whsec_...`) → pégalo en la variable
   `STRIPE_WEBHOOK_SECRET` de Vercel → **Redeploy**.

---

## 6. Pasar Stripe a LIVE (cuando quieras cobrar de verdad)

1. Completa la activación de tu cuenta en Stripe (datos fiscales/bancarios).
2. Cambia a **live keys** (`sk_live_...`, `pk_live_...`) en Vercel.
3. Crea el webhook de nuevo pero en **modo live** y actualiza `STRIPE_WEBHOOK_SECRET`.
4. Prueba con una compra real pequeña.

---

## 7. Checklist post-deploy

- [ ] La home carga en `https://TU-DOMINIO`
- [ ] Registro/login (email y Google) funcionan
- [ ] Solicitar un servicio de precio fijo → pago → el pedido pasa a "Pagado"
- [ ] El webhook aparece con entregas **exitosas** en Stripe → Webhooks
- [ ] `https://TU-DOMINIO/robots.txt` y `/sitemap.xml` responden
- [ ] Tu cuenta admin ve `/admin`

> Recomendado: conectar un dominio propio en Vercel (**Settings → Domains**) y activar
> analítica (Vercel Analytics) para medir conversión.
