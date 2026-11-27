import type { ReactNode } from "react"
import { useCan } from "@/hooks/useAccess"
import NoAccessPage from "@/pages/NoAccessPage"

interface RequireAccessProps {
  codes: readonly string[]
  children: ReactNode
}

/** Muestra la pantalla solo con alguno de los privilegios indicados. */
export function RequireAccess({ codes, children }: RequireAccessProps) {
  return useCan()(codes) ? children : <NoAccessPage />
}
