import { DetailEmptyNote } from "@/components/detail"
import { formatCOP } from "@/utils/format"
import { COLORS, PANEL } from "../constants"
import { agruparCategorias } from "../metrics"
import type { CategoriaVenta, ViewState } from "../types"
import { PanelBody } from "./PanelBody"

const MAX_CATEGORIAS = 6

interface CategoriasPanelProps {
  categorias: CategoriaVenta[]
  state: ViewState
}

export function CategoriasPanel({ categorias, state }: CategoriasPanelProps) {
  return (
    <section className={PANEL}>
      <h2 className="text-[14px] font-semibold text-ink">Servicios por categoría</h2>
      <p className="text-xs text-ink-muted mb-4">Valor de los servicios en eventos</p>
      <PanelBody state={state} skeleton="h-[140px]">
        {categorias.length === 0 && (
          <DetailEmptyNote text="Sin servicios en el período." />
        )}
        <ul className="space-y-3.5">
          {agruparCategorias(categorias, MAX_CATEGORIAS).map((item) => (
            <li key={item.categoria} className="space-y-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-x-2">
                <span className="font-medium text-ink min-w-0 break-words">
                  {item.categoria}
                </span>
                <span className="text-ink-soft font-semibold tabular-nums">
                  {formatCOP(item.monto)}{" "}
                  <span className="text-ink-muted font-normal">({item.porcentaje}%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-fill rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.porcentaje}%`, backgroundColor: COLORS.accent }}
                />
              </div>
            </li>
          ))}
        </ul>
      </PanelBody>
    </section>
  )
}
