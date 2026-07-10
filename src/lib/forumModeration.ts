// Filtro básico de contenido para el foro (servidor). No sustituye a la
// moderación humana ni a los reportes, pero frena lo obvio: vacíos, spam de
// enlaces y groserías/insultos evidentes.

const BANNED = [
  // insultos/obscenidades evidentes (ES/EN) — lista corta e intencional
  "puto",
  "puta",
  "pendejo",
  "pendeja",
  "mierda",
  "cabron",
  "cabrón",
  "verga",
  "coño",
  "fuck",
  "shit",
  "bitch",
  "asshole",
];

export type ModerationResult = { ok: true } | { ok: false; reason: string };

export function moderateText(
  text: string,
  { min = 2, max = 8000 }: { min?: number; max?: number } = {},
): ModerationResult {
  const value = (text ?? "").trim();
  if (value.length < min) {
    return { ok: false, reason: "El contenido es demasiado corto." };
  }
  if (value.length > max) {
    return { ok: false, reason: "El contenido es demasiado largo." };
  }

  const lower = value.toLowerCase();
  if (BANNED.some((w) => new RegExp(`\\b${w}\\b`, "i").test(lower))) {
    return {
      ok: false,
      reason: "Tu mensaje contiene lenguaje que no permitimos. Edítalo, por favor.",
    };
  }

  // Anti-spam: demasiados enlaces.
  const links = (value.match(/https?:\/\//gi) ?? []).length;
  if (links > 3) {
    return { ok: false, reason: "Demasiados enlaces. Comparte solo lo necesario." };
  }

  return { ok: true };
}
