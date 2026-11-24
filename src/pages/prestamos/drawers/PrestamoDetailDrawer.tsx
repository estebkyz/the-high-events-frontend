import { RotateCcw } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailAction,
  DetailEmptyNote,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailList,
  DetailSection,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { admiteDevolucion } from "../form"
import type { PrestamoItem } from "../types"

interface PrestamoDetailDrawerProps extends DetailDrawerProps<PrestamoItem> {
  onDevolucion: (prestamo: PrestamoItem) => void
}

export function PrestamoDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onDevolucion,
}: PrestamoDetailDrawerProps) {
  if (!item) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de préstamo"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar préstamo"
        />
      }
    >
      <DetailHeader
        badges={<StatusBadge status={item.estado} />}
        title={item.codigo}
        subtitle={item.evento}
      />
      <DetailGrid>
        <DetailField label="Responsable" value={item.responsable} span={2} />
        <DetailField label="Fecha de salida" value={item.fechaSalida} />
        <DetailField label="Devolución esperada" value={item.fechaDevolucion} />
        {item.fecha_devolucion_real && (
          <DetailField label="Devolución real" value={item.fecha_devolucion_real} />
        )}
        {item.observaciones_entrega && (
          <DetailField
            label="Observaciones de entrega"
            value={item.observaciones_entrega}
            span={2}
          />
        )}
        {item.observaciones_devolucion && (
          <DetailField
            label="Observaciones de devolución"
            value={item.observaciones_devolucion}
            span={2}
          />
        )}
      </DetailGrid>

      <DetailSection title="Equipos" count={item.equipos.length}>
        {item.equipos.length === 0 ? (
          <DetailEmptyNote text="No hay equipos registrados en este préstamo." />
        ) : (
          <DetailList>
            {item.equipos.map((eq) => (
              <div key={eq.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-[#F1F5F9] text-[12px] truncate">
                    {eq.nombre}
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">{eq.serie}</p>
                </div>
                <StatusBadge status={eq.condicionRetorno ?? eq.condicionSalida} />
              </div>
            ))}
          </DetailList>
        )}
      </DetailSection>

      {admiteDevolucion(item) && (
        <DetailAction
          icon={RotateCcw}
          label="Registrar devolución"
          tone="success"
          onClick={() => onDevolucion(item)}
        />
      )}
    </Drawer>
  )
}
