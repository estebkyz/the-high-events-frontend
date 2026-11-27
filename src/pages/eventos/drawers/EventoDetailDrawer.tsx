import { useState } from "react"
import { Calendar, DollarSign, MapPin, UserCheck, Users } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { SegmentedControl } from "@/components/SegmentedControl"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailEmptyNote,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailHighlight,
  DetailList,
  DetailUbicacion,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import type { EquipoItem } from "@/pages/equipos/types"
import { formatCOP } from "@/utils/format"
import { formatSchedule } from "../schedule"
import { EventoDocumentos } from "../components/EventoDocumentos"
import { EventoEstadoAcciones } from "../components/EventoEstadoAcciones"
import type { EstadoEvento, EventoDocumento, EventoItem } from "../types"

interface EventoDetailDrawerProps extends Omit<DetailDrawerProps<EventoItem>, "onEdit"> {
  onEdit?: (item: EventoItem) => void
  equipos: EquipoItem[]
  onOpenDocumento: (documento: EventoDocumento) => void
  /** `undefined` si quien mira no puede ver las ventas. */
  tieneVenta?: boolean
  /** Sin estas acciones (p. ej. desde Agendamiento) el detalle es solo de consulta. */
  onStatusChange?: (item: EventoItem, estado: EstadoEvento) => void
  onCancelar?: (item: EventoItem) => void
  onRegistrarVenta?: (item: EventoItem) => void
}

type ResourceTab = "servicios" | "equipos" | "empleados"

interface ResourceRow {
  id: string
  title: string
  subtitle?: string
  badge?: string
}

function getRows(
  evento: EventoItem,
  equipos: EquipoItem[],
): Record<ResourceTab, ResourceRow[]> {
  return {
    servicios: (evento.servicios ?? []).map((nombre) => ({
      id: nombre,
      title: nombre,
      subtitle: evento.serviciosDetalles?.find((d) => d.nombre === nombre)
        ?.proveedor_nombre,
    })),
    equipos: (evento.equiposAsignados ?? []).map((id) => {
      const equipo = equipos.find((eq) => eq.id === id)
      return {
        id,
        title: equipo?.nombre ?? `Equipo ${id}`,
        subtitle: equipo?.serie,
        badge: equipo?.propiedad,
      }
    }),
    empleados: (evento.empleadosAsignados ?? []).map((emp, index) => ({
      id: `${emp.empleado_id}-${index}`,
      title: emp.nombre,
      subtitle: emp.nombre_tarea || emp.cargo,
      badge: emp.fase,
    })),
  }
}

export function EventoDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  equipos,
  onOpenDocumento,
  tieneVenta,
  onStatusChange,
  onCancelar,
  onRegistrarVenta,
}: EventoDetailDrawerProps) {
  const [tab, setTab] = useState<ResourceTab>("servicios")
  if (!item) return null
  const rows = getRows(item, equipos)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de evento"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={onEdit && (() => onEdit(item))}
          editLabel="Editar evento"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={item.modalidad} />
            <StatusBadge status={item.estado} />
          </>
        }
        title={item.nombre}
        subtitle={[item.cliente_nombre, item.cotizacion_codigo]
          .filter(Boolean)
          .join(" · ")}
      />
      {/* La API lo omite a quien ve el evento desde otro módulo. */}
      {/* La API omite los montos a quien ve el evento desde otro módulo. */}
      {item.presupuesto_estimado !== undefined && (
        <DetailHighlight
          icon={DollarSign}
          label="Valor del evento"
          value={item.valor_total ? formatCOP(item.valor_total) : "Sin definir"}
          sublabel={`Presupuesto de gastos: ${formatCOP(item.presupuesto_estimado)}`}
          tone="accent"
        />
      )}
      {onStatusChange && onCancelar && onRegistrarVenta && (
        <EventoEstadoAcciones
          evento={item}
          tieneVenta={tieneVenta}
          onStatusChange={(estado) => onStatusChange(item, estado)}
          onCancelar={() => onCancelar(item)}
          onRegistrarVenta={() => onRegistrarVenta(item)}
        />
      )}
      <DetailGrid>
        <DetailField
          icon={Calendar}
          label="Horario"
          span={2}
          value={formatSchedule(item)}
        />
        <DetailUbicacion
          icon={MapPin}
          label="Ubicación"
          span={2}
          value={item.direccion}
          fallback="Sin ubicación"
        />
        <DetailField
          icon={Users}
          label="Aforo esperado"
          value={item.aforo_esperado || "Sin definir"}
        />
        <DetailField
          icon={UserCheck}
          label="Responsable"
          value={item.responsable_nombre || "Sin asignar"}
        />
        {item.concepto_evento && (
          <DetailField label="Concepto" value={item.concepto_evento} />
        )}
        {item.observaciones && (
          <DetailField label="Observaciones" span={2} value={item.observaciones} />
        )}
      </DetailGrid>

      <div className="pt-4 border-t border-line-soft space-y-2">
        <SegmentedControl
          label="Recursos del evento"
          value={tab}
          onChange={(val) => setTab(val as ResourceTab)}
          options={[
            { value: "servicios", label: `Servicios (${rows.servicios.length})` },
            { value: "equipos", label: `Equipos (${rows.equipos.length})` },
            { value: "empleados", label: `Personal (${rows.empleados.length})` },
          ]}
        />
        {rows[tab].length === 0 ? (
          <DetailEmptyNote text="Sin registros." />
        ) : (
          <DetailList>
            {rows[tab].map((row) => (
              <div
                key={row.id}
                className="py-2.5 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">{row.title}</p>
                  {row.subtitle && (
                    <p className="text-xs text-ink-muted">{row.subtitle}</p>
                  )}
                </div>
                {row.badge && <StatusBadge status={row.badge} />}
              </div>
            ))}
          </DetailList>
        )}
      </div>

      <EventoDocumentos evento={item} onOpen={onOpenDocumento} />
    </Drawer>
  )
}
