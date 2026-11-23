import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
  DetailList,
  DetailEmptyNote,
} from "../../../components/detail"
import { ArrowDownCircle, Package } from "lucide-react"
import type { PrestamoItem } from "../types"

interface PrestamoDetailDrawerProps {
  isOpen: boolean; onClose: () => void
  prestamo: PrestamoItem | null
  onOpenReturn: (prestamo: PrestamoItem) => void
}

export function PrestamoDetailDrawer({
  isOpen,
  onClose,
  prestamo,
  onOpenReturn,
}: PrestamoDetailDrawerProps) {
  if (!prestamo) return null

  const canReturn =
    prestamo.estado === "Activo" || prestamo.estado === "Con Retraso"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title={`Préstamo ${prestamo.codigo}`}
      subtitle="Detalle completo del préstamo"
      footer={
        canReturn ? (
          <button
            type="button"
            onClick={() => onOpenReturn(prestamo)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[#10B981] text-white hover:bg-[#059669] transition-colors cursor-pointer"
          >
            <ArrowDownCircle size={15} aria-hidden="true" />
            Registrar Devolución
          </button>
        ) : undefined
      }
    >
      <div className="space-y-4 text-xs">
        <DetailHeader
          badges={<StatusBadge status={prestamo.estado} />}
          title={prestamo.codigo}
          subtitle={prestamo.evento}
        />

        <DetailSection title="Información del préstamo" noBorder>
          <DetailGrid>
            <DetailField label="Responsable del préstamo" span={2}>
              <div className="flex items-center gap-2.5 mt-0.5">
                <div
                  className="w-7 h-7 rounded-full bg-[#7C3AED]/30 text-[#A78BFA] flex items-center justify-center font-bold text-xs shrink-0"
                  aria-hidden="true"
                >
                  {prestamo.responsable.charAt(0)}
                </div>
                <span className="font-semibold text-[#F1F5F9] text-[13px]">
                  {prestamo.responsable}
                </span>
              </div>
            </DetailField>
            <DetailField label="Evento" value={prestamo.evento} span={2} />
            <DetailField label="Fecha Salida" value={prestamo.fechaSalida} />
            <DetailField
              label="Devolución Esperada"
              value={prestamo.fechaDevolucion}
            />
          </DetailGrid>
        </DetailSection>

        <DetailSection
          title="Equipos en Préstamo"
          count={prestamo.equipos.length}
        >
          {prestamo.equipos.length === 0 ? (
            <DetailEmptyNote text="No hay equipos registrados en este préstamo." />
          ) : (
            <DetailList>
              {prestamo.equipos.map((eq) => (
                <div
                  key={eq.id}
                  className="py-2.5 flex items-center gap-3"
                >
                  <div
                    className="w-7 h-7 rounded bg-[#242830] flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <Package size={13} className="text-[#64748B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#F1F5F9] text-[12px] leading-tight truncate">
                      {eq.nombre}
                    </p>
                    <p className="text-[10px] text-[#64748B]">{eq.serie}</p>
                  </div>
                  <StatusBadge
                    status={eq.condicionSalida}
                    className="text-[10px] px-2 shrink-0"
                  />
                </div>
              ))}
            </DetailList>
          )}
        </DetailSection>
      </div>
    </Drawer>
  )
}
