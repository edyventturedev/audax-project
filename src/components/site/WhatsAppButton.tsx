"use client";

import { MotionConfig, motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageProvider";

// Número de Audax (WhatsApp): +52 985 227 5335 → wa.me usa 52 + 10 dígitos.
const WHATSAPP_NUMBER = "529852275335";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.738 5.478 2.031 7.78L0 32l8.44-2.212A15.9 15.9 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.2c-2.5 0-4.9-.67-6.99-1.93l-.5-.3-5.01 1.31 1.34-4.88-.33-.51A13.16 13.16 0 012.8 16C2.8 8.72 8.72 2.8 16 2.8S29.2 8.72 29.2 16 23.28 29.2 16 29.2zm7.24-9.86c-.4-.2-2.35-1.16-2.72-1.29-.36-.13-.63-.2-.9.2-.26.4-1.03 1.29-1.26 1.55-.23.26-.46.3-.86.1-.4-.2-1.68-.62-3.2-1.97-1.18-1.05-1.98-2.35-2.21-2.75-.23-.4-.02-.61.18-.81.18-.18.4-.46.6-.7.2-.23.26-.4.4-.66.13-.26.06-.5-.03-.7-.1-.2-.9-2.17-1.23-2.97-.32-.78-.65-.67-.9-.68-.23-.01-.5-.01-.76-.01-.26 0-.7.1-1.06.5-.36.4-1.39 1.36-1.39 3.32s1.43 3.85 1.62 4.12c.2.26 2.8 4.28 6.79 6 .95.41 1.69.65 2.27.83.95.3 1.82.26 2.5.16.76-.11 2.35-.96 2.68-1.89.33-.93.33-1.72.23-1.89-.1-.16-.36-.26-.76-.46z" />
    </svg>
  );
}

/**
 * Botón flotante de WhatsApp. En móvil se coloca por ENCIMA de la barra
 * inferior (no la tapa); en escritorio va abajo a la derecha y muestra una
 * etiqueta al pasar el cursor. z bajo la hoja móvil para no encimarse a ella.
 */
export function WhatsAppButton() {
  const { lang } = useLanguage();
  const es = lang === "es";

  const message = es
    ? "Hola Audax 👋, me interesa conocer más sobre sus servicios."
    : "Hi Audax 👋, I'd like to know more about your services.";
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const label = es ? "¿Dudas? Escríbenos" : "Questions? Chat with us";
  const aria = es ? "Escríbenos por WhatsApp" : "Chat with us on WhatsApp";

  return (
    <MotionConfig reducedMotion="user">
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={aria}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 420, damping: 22 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        className="group fixed right-4 z-[880] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_22px_rgba(37,211,102,0.45)] bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] lg:bottom-6 lg:right-6 lg:h-14 lg:w-14"
      >
        {/* Etiqueta: solo escritorio, aparece al pasar el cursor */}
        <span className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-full border border-line bg-ink-2 px-3.5 py-2 text-sm font-medium text-fg opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 lg:block">
          {label}
        </span>
        <WhatsAppIcon className="h-7 w-7 lg:h-8 lg:w-8" />
      </motion.a>
    </MotionConfig>
  );
}
