import type { ReactNode } from "react";

/**
 * Renderizador Markdown mínimo y seguro (sin dangerouslySetInnerHTML).
 * Soporta: encabezados (##, ###), listas (-, *), párrafos, **negritas** y
 * enlaces [texto](url). Suficiente para artículos del blog.
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-fg">
          {m[2]}
        </strong>,
      );
    } else if (m[3]) {
      const href = m[5];
      const external = /^https?:\/\//.test(href);
      nodes.push(
        <a
          key={`${keyPrefix}-a${i}`}
          href={href}
          className="text-orange underline hover:no-underline"
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {m[4]}
        </a>,
      );
    }
    last = regex.lastIndex;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = (content ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let key = 0;

  const flush = () => {
    if (paragraph.length) {
      const text = paragraph.join(" ").trim();
      if (text)
        blocks.push(
          <p key={`p${key++}`} className="text-[1.02rem]">
            {renderInline(text, `p${key}`)}
          </p>,
        );
      paragraph = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (!t) {
      flush();
      i++;
      continue;
    }
    if (t.startsWith("### ")) {
      flush();
      blocks.push(
        <h3
          key={`h${key++}`}
          className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-fg"
        >
          {renderInline(t.slice(4), `h${key}`)}
        </h3>,
      );
      i++;
      continue;
    }
    if (t.startsWith("## ") || t.startsWith("# ")) {
      flush();
      const text = t.startsWith("## ") ? t.slice(3) : t.slice(2);
      blocks.push(
        <h2
          key={`h${key++}`}
          className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-fg"
        >
          {renderInline(text, `h${key}`)}
        </h2>,
      );
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(t)) {
      flush();
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`u${key++}`} className="flex flex-col gap-2 pl-1">
          {items.map((it, j) => (
            <li key={j} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              <span>{renderInline(it, `li${key}-${j}`)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    paragraph.push(t);
    i++;
  }
  flush();

  return (
    <div className="flex flex-col gap-5 leading-relaxed text-fg-muted">
      {blocks}
    </div>
  );
}
