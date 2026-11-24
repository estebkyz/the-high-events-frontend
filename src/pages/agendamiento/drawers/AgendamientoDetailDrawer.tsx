import { Clock, Sparkles, Trash2 } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailAction,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailSection,
  DetailStatusPicker,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { ESTADOS_AGENDA, MESES, TIPO_LABELS } from "../constants"
import type { AgendaEvent, EstadoAgendamiento } from "../types"
import { isReunion } from "../utils"

interface AgendamientoDetailDrawerProps extends DetailDrawerProps<AgendaEvent> {
  onStatusChange: (id: string, estado: EstadoAgendamiento) => unknown
  onCreateCotizacion: (event: AgendaEvent) => void
  onDelete: (event: AgendaEvent) => void
}

export function AgendamientoDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onStatusChange,
  onCreateCotizacion,
  onDelete,
}: AgendamientoDetailDrawerProps) {
  if (!item) return null
  const estado = item.estado
  const reunion = isReunion(item)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de agendamiento"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar agendamiento"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={TIPO_LABELS[item.tipo_agendamiento] ?? "Evento"} />
            <StatusBadge status={estado} />
          </>
        }
        title={item.title}
        subtitle={item.client}
        meta={
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Clock size={12} aria-hidden="true" />
            {item.day} de {MESES[item.month]} de {item.year} · {item.time}
          </span>
        }
      />
      <DetailGrid>
        <DetailField
          label={reunion ? "Motivo" : "Actividad"}
          value={item.motivo || "Sin definir"}
        />
        {reunion ? (
          <DetailField label="Modalidad" value={item.modalidadCita || "Sin definir"} />
        ) : (
          <DetailField label="Ubicación" value={item.venue || "Sin ubicación"} />
        )}
        {item.notas && <DetailField label="Notas" value={item.notas} span={2} />}
        {item.fechaTentativaEvento && (
          <DetailField
            label="Fecha tentativa del evento"
            value={item.fechaTentativaEvento}
          />
        )}
        {item.tipoEventoTentativo && (
          <DetailField label="Tipo de evento" value={item.tipoEventoTentativo} />
        )}
        {item.lugarTentativo && (
          <DetailField label="Lugar tentativo" value={item.lugarTentativo} span={2} />
        )}
      </DetailGrid>

      <DetailSection title="Estado">
        <DetailStatusPicker
          value={estado}
          options={ESTADOS_AGENDA}
          onChange={(next) => onStatusChange(item.id, next)}
        />
      </DetailSection>

      <DetailSection title="Acciones">
        <div className="space-y-2">
          {reunion && (
            <DetailAction
              icon={Sparkles}
              label="Crear cotización"
              tone="accent"
              onClick={() => onCreateCotizacion(item)}
            />
          )}
          <DetailAction
            icon={Trash2}
            label="Eliminar agendamiento"
            onClick={() => onDelete(item)}
          />
        </div>
      </DetailSection>
    </Drawer>
  )
}
