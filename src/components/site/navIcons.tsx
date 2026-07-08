import {
  Code2,
  Palette,
  LifeBuoy,
  Globe,
  LayoutTemplate,
  ShoppingBag,
  Smartphone,
  PenTool,
  Sparkles,
  Camera,
  Clapperboard,
  Film,
  MessagesSquare,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Code2,
  Palette,
  LifeBuoy,
  Globe,
  LayoutTemplate,
  ShoppingBag,
  Smartphone,
  PenTool,
  Sparkles,
  Camera,
  Clapperboard,
  Film,
  MessagesSquare,
  Newspaper,
};

/** Renderiza un ícono de lucide por su nombre (usado por la navegación). */
export function NavIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = MAP[name] ?? Sparkles;
  return <Icon className={className} />;
}
