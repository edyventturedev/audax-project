"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "./GoogleIcon";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const a = t.auth;
  const isSignup = mode === "signup";

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!isSupabaseConfigured) {
      setError("Auth aún no configurado. Falta conectar Supabase.");
      return;
    }
    setLoading(true);
    const supabase = createClient();

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) throw error;
        setInfo(
          "Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Auth aún no configurado. Falta conectar Supabase.");
      return;
    }
    setOauthLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setOauthLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md rounded-3xl border border-line bg-ink-3 p-8"
    >
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">
        {isSignup ? a.signupTitle : a.loginTitle}
      </h1>
      <p className="mt-2 text-sm text-fg-dim">
        {isSignup ? a.signupSub : a.loginSub}
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={oauthLoading}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-line-strong bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:opacity-60"
      >
        {oauthLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        {a.google}
      </button>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs uppercase tracking-wide text-fg-faint">
          {a.or}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleEmail} className="space-y-4">
        {isSignup && (
          <Field
            id="name"
            label={a.name}
            icon={User}
            type="text"
            value={name}
            onChange={setName}
            autoComplete="name"
            required
          />
        )}
        <Field
          id="email"
          label={a.email}
          icon={Mail}
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <Field
          id="password"
          label={a.password}
          icon={Lock}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          minLength={6}
        />

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-xl bg-success/10 px-3 py-2 text-sm text-success">
            {info}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSignup ? a.signup : a.login}
        </Button>

        {isSignup && (
          <p className="text-center text-xs leading-relaxed text-fg-faint">
            Al crear tu cuenta aceptas nuestros{" "}
            <Link href="/terminos" className="text-fg-dim underline hover:text-fg">
              Términos
            </Link>{" "}
            y el{" "}
            <Link
              href="/aviso-de-privacidad"
              className="text-fg-dim underline hover:text-fg"
            >
              Aviso de Privacidad
            </Link>
            .
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-fg-dim">
        {isSignup ? a.hasAccount : a.noAccount}{" "}
        <Link
          href={`${isSignup ? "/login" : "/signup"}${
            next && next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""
          }`}
          className="font-medium text-orange hover:underline"
        >
          {isSignup ? a.loginLink : a.signupLink}
        </Link>
      </p>
    </motion.div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg-muted">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-faint" />
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-line bg-ink-2 py-3 pl-10 pr-4 text-sm text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-orange"
          {...rest}
        />
      </div>
    </div>
  );
}
