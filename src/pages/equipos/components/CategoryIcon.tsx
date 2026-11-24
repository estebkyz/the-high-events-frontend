import { Boxes, Monitor, Music2, Package, Sparkles, type LucideIcon } from "lucide-react"

const ICONS: Record<string, { icon: LucideIcon; color: string }> = {
  Audio: { icon: Music2, color: "text-[#A78BFA]" },
  Iluminación: { icon: Boxes, color: "text-[#F59E0B]" },
  Video: { icon: Monitor, color: "text-[#3B82F6]" },
  Estructuras: { icon: Package, color: "text-[#10B981]" },
}
const DEFAULT_ICON = { icon: Sparkles, color: "text-[#EC4899]" }

interface CategoryIconProps {
  categoria: string
  size?: number
}

export function CategoryIcon({ categoria, size = 20 }: CategoryIconProps) {
  const { icon: Icon, color } = ICONS[categoria] ?? DEFAULT_ICON
  return <Icon size={size} className={color} aria-hidden="true" />
}
