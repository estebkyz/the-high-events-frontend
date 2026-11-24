import { DetailEmptyNote } from "@/components/detail"
import { formatCOP } from "@/utils/format"
import { COLORS, PANEL } from "../constants"
import type { CategoriaVenta } from "../types"

const MAX_CATEGORIAS = 6

interface CategoriasPanelProps {
  categorias: CategoriaVenta[]
}

export function CategoriasPanel({ categorias }: CategoriasPanelProps) {
  return (
    <section className={PANEL}>
      <h2 className="text-[15px] font-semibold text-[#F8FAFC]">
        Servicios por categoría
      </h2>
      <p className="text-[12px] text-[#94A3B8] mb-4">Valor de los servicios en eventos</p>
      {categorias.length === 0 && <DetailEmptyNote text="Sin servicios en el período." />}
      <ul className="space-y-3.5">
        {categorias.slice(0, MAX_CATEGORIAS).map((item) => (
          <li key={item.categoria} className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-[#F1F5F9] truncate">
                {item.categoria}
              </span>
              <span className="text-[#CBD5E1] font-semibold tabular-nums">
                {formatCOP(item.monto)}{" "}
                <span className="text-[#94A3B8] font-normal">({item.porcentaje}%)</span>
              </span>
            </div>
            <div className="w-full h-2 bg-[#111318] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${item.porcentaje}%`, backgroundColor: COLORS.accent }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
