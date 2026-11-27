import { CalendarCheck, Clock, Sparkles, Trash2 } from "lucide-react"
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
  DetailUbicacion,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { ESTADOS_AGENDA, MESES, TIPO_LABELS } from "../constants"
import type { AgendaEvent, EstadoAgendamiento } from "../types"
import { isReunion } from "../utils"
import { MODULE_ACCESS } from "@/constants/access"

interface AgendamientoDetailDrawerProps extends DetailDrawerProps<AgendaEvent> {
  onStatusChange: (id: string, estado: EstadoAgendamiento) => unknown
  onOpenEvento: (eventoId: string) => void
  onCreateCotizacion: (reunion: AgendaEvent) => void
  onDelete: (reunion: AgendaEvent) => void
}

export function AgendamientoDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onStatusChange,
  onOpenEvento,
  onCreateCotizacion,
  onDelete,
}: AgendamientoDetailDrawerProps) {
  if (!item) return null
  const reunion = isReunion(item)
  const eventoId = item.evento_id
  const canCreate = reunion && !eventoId && item.estado !== "Cancelado"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de reunión"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={reunion ? () => onEdit(item) : undefined}
          editLabel="Editar reunión"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={TIPO_LABELS[item.tipo_agendamiento]} />
            <StatusBadge status={item.estado} />
          </>
        }
        title={item.title}
        subtitle={item.client}
        meta={
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Clock size={12} aria-hidden="true" />
            {item.day} de {MESES[item.month]} de {item.year} · {item.time}
            {item.timeEnd ? ` a ${item.timeEnd}` : ""}
          </span>
        }
      />
      <DetailGrid>
        <DetailField label="Motivo" value={item.motivo || "Sin definir"} />
        <DetailField label="Atiende" value={item.responsable || "Sin asignar"} />
        {item.evento && <DetailField label="Evento" value={item.evento} />}
        {item.notas && <DetailField label="Notas" value={item.notas} span={2} />}
      </DetailGrid>

      {reunion && (
        <DetailSection title="Datos tentativos del evento">
          <DetailGrid>
            <DetailField
              label="Fecha tentativa"
              value={item.fechaTentativaEvento || "Sin definir"}
            />
            <DetailField
              label="Tipo de evento"
              value={item.tipoEventoTentativo || "Sin definir"}
            />
            <DetailUbicacion
              label="Lugar tentativo"
              value={item.lugarTentativo}
              fallback="Sin definir"
              span={2}
            />
          </DetailGrid>
        </DetailSection>
      )}

      <DetailSection title="Estado">
        <DetailStatusPicker
          value={item.estado}
          options={ESTADOS_AGENDA}
          onChange={(next) => onStatusChange(item.id, next)}
        />
      </DetailSection>

      <DetailSection title="Acciones">
        <div className="space-y-2">
          {eventoId && (
            <DetailAction
              icon={CalendarCheck}
              label="Ver evento creado"
              tone="success"
              onClick={() => onOpenEvento(eventoId)}
            />
          )}
          {canCreate && (
            // Un evento de cliente nace de su cotización: la reunión lleva a cotizar
            <DetailAction
              icon={Sparkles}
              label="Crear cotización"
              tone="accent"
              onClick={() => onCreateCotizacion(item)}
              needs={MODULE_ACCESS.cotizaciones.create}
            />
          )}
          <DetailAction
            icon={Trash2}
            label="Eliminar reunión"
            onClick={() => onDelete(item)}
            needs={MODULE_ACCESS.agendamiento.remove}
          />
        </div>
      </DetailSection>
    </Drawer>
  )
}
