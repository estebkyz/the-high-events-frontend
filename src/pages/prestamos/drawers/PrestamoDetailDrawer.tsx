import { Camera, FileCheck, PackageCheck, RotateCcw } from "lucide-react"
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
import { admiteDevolucion, admiteSalida } from "../form"
import type { PrestamoItem } from "../types"
import { MODULE_ACCESS } from "@/constants/access"

interface PrestamoDetailDrawerProps extends DetailDrawerProps<PrestamoItem> {
  onSalida: (prestamo: PrestamoItem) => void
  onDevolucion: (prestamo: PrestamoItem) => void
  onOpenRecepcion: (codigo: string) => void
}

export function PrestamoDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onSalida,
  onDevolucion,
  onOpenRecepcion,
}: PrestamoDetailDrawerProps) {
  if (!item) return null
  const { recepcion } = item

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
                  <p className="font-medium text-ink text-xs truncate">{eq.nombre}</p>
                  <p className="text-xs text-ink-muted">{eq.serie}</p>
                  {eq.evidencia && (
                    <a
                      href={eq.evidencia}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-ink hover:underline"
                    >
                      <Camera size={11} aria-hidden="true" />
                      Ver evidencia
                    </a>
                  )}
                </div>
                <StatusBadge status={eq.condicionRetorno ?? eq.condicionSalida} />
              </div>
            ))}
          </DetailList>
        )}
      </DetailSection>

      {admiteSalida(item) && (
        <DetailSection title="Borrador del evento">
          <p className="text-xs text-ink-muted pb-2">
            Los equipos siguen en bodega. Al confirmar, se registra la salida con la fecha
            de hoy y quedan prestados.
          </p>
          <DetailAction
            icon={PackageCheck}
            label="Confirmar salida de bodega"
            tone="success"
            onClick={() => onSalida(item)}
            needs={MODULE_ACCESS.prestamos.status}
          />
        </DetailSection>
      )}
      {recepcion && (
        <DetailAction
          icon={FileCheck}
          label={`Ver recepción ${recepcion}`}
          tone="accent"
          onClick={() => onOpenRecepcion(recepcion)}
          needs={MODULE_ACCESS.recepciones.view}
        />
      )}
      {admiteDevolucion(item) && (
        <DetailAction
          icon={RotateCcw}
          label="Registrar devolución"
          tone="success"
          onClick={() => onDevolucion(item)}
          needs={MODULE_ACCESS.prestamos.status}
        />
      )}
    </Drawer>
  )
}
