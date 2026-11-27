import { Boxes, Monitor, Music2, Package, Sparkles, type LucideIcon } from "lucide-react"

const ICONS: Record<string, { icon: LucideIcon; color: string }> = {
  Audio: { icon: Music2, color: "text-brand-ink" },
  Iluminación: { icon: Boxes, color: "text-warn-ink" },
  Video: { icon: Monitor, color: "text-info-ink" },
  Estructuras: { icon: Package, color: "text-ok-ink" },
}
const DEFAULT_ICON = { icon: Sparkles, color: "text-brand-ink" }

interface CategoryIconProps {
  categoria: string
  size?: number
}

export function CategoryIcon({ categoria, size = 20 }: CategoryIconProps) {
  const { icon: Icon, color } = ICONS[categoria] ?? DEFAULT_ICON
  return <Icon size={size} className={color} aria-hidden="true" />
}
