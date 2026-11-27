import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/Button"
import { useCan } from "@/hooks/useAccess"

interface HeaderButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  /** Privilegios que la habilitan (basta uno); sin ellos no se muestra. */
  needs?: readonly string[]
}

/** Botón secundario del encabezado (`PageHeader.extraControls`). */
export function HeaderButton({ icon, label, onClick, needs }: HeaderButtonProps) {
  const can = useCan()
  if (needs && !can(needs)) return null
  return (
    <Button icon={icon} onClick={onClick}>
      {label}
    </Button>
  )
}
