import { Clock } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailSection,
  DetailStatusPicker,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { ESTADOS_TAREA } from "../constants"
import type { EstadoTarea, TareaItem } from "../types"

interface TareaDetailDrawerProps extends DetailDrawerProps<TareaItem> {
  onStatusChange: (id: string, estado: EstadoTarea) => unknown
}

export function TareaDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onStatusChange,
}: TareaDetailDrawerProps) {
  if (!item) return null
  const horario = [item.hora_inicio_estimada, item.hora_fin_estimada].filter(Boolean)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de tarea"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar tarea"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={item.fase} />
            <StatusBadge status={item.prioridad} />
            <StatusBadge status={item.estado} />
          </>
        }
        title={item.tarea}
        subtitle={item.evento}
        meta={
          horario.length > 0 && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock size={12} aria-hidden="true" />
              {horario.join(" – ")}
            </span>
          )
        }
      />
      <DetailGrid>
        <DetailField label="Responsable" value={item.responsable} />
        <DetailField label="Cargo" value={item.cargo_responsable || "Sin definir"} />
        <DetailField label="Fecha programada" value={item.fechaLimite} />
        <DetailField label="Código" value={item.codigo_tarea || "Sin código"} />
        {item.descripcion_catalogo && (
          <DetailField label="Descripción" value={item.descripcion_catalogo} span={2} />
        )}
        {item.notas && <DetailField label="Novedades" value={item.notas} span={2} />}
      </DetailGrid>
      <DetailSection title="Estado">
        <DetailStatusPicker
          value={item.estado}
          options={ESTADOS_TAREA}
          onChange={(estado) => onStatusChange(item.id, estado)}
        />
      </DetailSection>
    </Drawer>
  )
}
