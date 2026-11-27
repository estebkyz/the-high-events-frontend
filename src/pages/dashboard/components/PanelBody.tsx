import type { ReactNode } from "react"
import { DetailEmptyNote } from "@/components/detail"
import { Skeleton } from "@/components/Skeleton"
import type { ViewState } from "../types"

interface PanelBodyProps {
  state: ViewState
  /** Alto aproximado del contenido, para que la página no salte al llegar. */
  skeleton: string
  children: ReactNode
}

/** Contenido de un panel: nunca muestra ceros mientras carga ni si falló. */
export function PanelBody({ state, skeleton, children }: PanelBodyProps) {
  if (state === "loading") return <Skeleton className={`w-full ${skeleton}`} />
  if (state === "error") return <DetailEmptyNote text="No se pudo cargar." />
  return children
}
