import { useState } from "react"
import { Calendar, DollarSign, MapPin, Users } from "lucide-react"
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
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import type { EquipoItem } from "@/pages/equipos/types"
import { formatCOP } from "@/utils/format"
import { formatSchedule } from "../schedule"
import type { EventoItem } from "../types"

interface EventoDetailDrawerProps extends DetailDrawerProps<EventoItem> {
  equipos: EquipoItem[]
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
          onEdit={() => onEdit(item)}
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
      <DetailHighlight
        icon={DollarSign}
        label="Presupuesto estimado"
        value={formatCOP(item.presupuesto_estimado)}
        tone="success"
      />
      <DetailGrid>
        <DetailField
          icon={Calendar}
          label="Horario"
          span={2}
          value={formatSchedule(item)}
        />
        <DetailField
          icon={MapPin}
          label="Ubicación"
          span={2}
          value={item.direccion || "Sin ubicación"}
        />
        <DetailField
          icon={Users}
          label="Aforo esperado"
          value={item.aforo_esperado || "Sin definir"}
        />
        {item.concepto_espectaculo && (
          <DetailField label="Concepto" value={item.concepto_espectaculo} />
        )}
        {item.observaciones && (
          <DetailField label="Observaciones" span={2} value={item.observaciones} />
        )}
      </DetailGrid>

      <div className="pt-4 border-t border-[#2D3748]/60 space-y-2">
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
                  <p className="text-xs font-semibold text-[#F1F5F9]">{row.title}</p>
                  {row.subtitle && (
                    <p className="text-[11px] text-[#94A3B8]">{row.subtitle}</p>
                  )}
                </div>
                {row.badge && <StatusBadge status={row.badge} />}
              </div>
            ))}
          </DetailList>
        )}
      </div>
    </Drawer>
  )
}
