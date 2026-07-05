# Audax v4 — Guía de configuración

Sigue estos pasos para activar el inicio de sesión, la base de datos y los pagos.
Todo empieza en **modo de prueba**: nada cobra dinero real hasta que lo actives.

---

## 1. Supabase (base de datos + autenticación)

1. Entra a <https://supabase.com> → **New project** (plan gratis).
   - Guarda la contraseña de la base de datos.
2. Cuando esté listo, ve a **Project Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (¡secreta, solo servidor!)
3. Pega esos 3 valores en el archivo **`.env.local`** del proyecto.
4. Ve a **SQL Editor** → pega y ejecuta, en orden:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_seed_services.sql`
5. **Storage** → crea un bucket **privado** llamado `deliverables` (para los archivos finales).

### Hacerte administrador
Después de crear tu cuenta (paso 3 de la sección Google, o con email), corre en el SQL Editor:
```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'TU-CORREO');
```

---

## 2. Login con Google

1. En Supabase: **Authentication → Providers → Google** → habilítalo.
2. En <https://console.cloud.google.com>:
   - Crea un proyecto → **APIs & Services → OAuth consent screen** (tipo *External*, agrega tu correo).
   - **Credentials → Create credentials → OAuth client ID → Web application**.
   - En **Authorized redirect URIs** agrega la URL que Supabase te muestra en la pantalla del provider
     (algo como `https://TU-PROYECTO.supabase.co/auth/v1/callback`).
   - Copia el **Client ID** y **Client secret** y pégalos en el provider Google de Supabase.
3. En Supabase **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` (y luego tu dominio de producción).
   - **Redirect URLs**: agrega `http://localhost:3000/auth/callback`.

> Email/contraseña ya viene activado por defecto en Supabase.

---

## 3. Stripe (pagos) — se conecta en la Fase 3

1. Crea cuenta en <https://stripe.com> (México). Mantente en **Test mode**.
2. **Developers → API keys**:
   - `Secret key` (test) → `STRIPE_SECRET_KEY`
   - `Publishable key` (test) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Webhook (para confirmar pagos): en desarrollo usa el CLI de Stripe:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copia el `whsec_...` que imprime → `STRIPE_WEBHOOK_SECRET`.
4. Tarjeta de prueba: `4242 4242 4242 4242`, cualquier fecha futura y CVC.

---

## 4. Correr el proyecto

```bash
npm run dev     # http://localhost:3000
npm run build   # verificar que compila
```

Cuando tengas la sección 1 y 2 listas, avísame y verificamos el login de punta a punta,
luego seguimos con la Fase 3 (pagos).
