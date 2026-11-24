import { Download, Mail, Sparkles } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailAction,
  DetailEmptyNote,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailHighlight,
  DetailList,
  DetailSection,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { ESTADO_ICONS, TRANSICIONES } from "../constants"
import type { CotizacionItem, EstadoCotizacion } from "../types"
import { cotizacionMailto, getCotizacionLineas, printCotizacion } from "../utils"

interface CotizacionDetailDrawerProps extends DetailDrawerProps<CotizacionItem> {
  onStatusChange: (id: string, estado: EstadoCotizacion) => unknown
  onCreateEvento: (cotizacion: CotizacionItem) => void
}

export function CotizacionDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onStatusChange,
  onCreateEvento,
}: CotizacionDetailDrawerProps) {
  if (!item) return null
  const lineas = getCotizacionLineas(item)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de cotización"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar cotización"
        />
      }
    >
      <DetailHeader
        badges={<StatusBadge status={item.estado} />}
        title={<span className="font-mono text-[#A78BFA]">{item.codigo}</span>}
        subtitle={item.cliente}
        meta={
          <span>
            Emisión: {item.fecha}
            {item.fechaVence && ` · Vence: ${item.fechaVence}`}
          </span>
        }
      />

      <DetailGrid>
        <DetailField
          label="Evento"
          span={2}
          value={item.nombre_evento || "Sin definir"}
        />
        {item.fecha_evento && (
          <DetailField label="Fecha del evento" value={item.fecha_evento} />
        )}
        {(item.hora_inicio || item.hora_fin) && (
          <DetailField
            label="Horario"
            value={`${item.hora_inicio || "--:--"} - ${item.hora_fin || "--:--"}`}
          />
        )}
        {item.direccion && (
          <DetailField label="Ubicación" span={2} value={item.direccion} />
        )}
        {item.aforo_esperado && (
          <DetailField label="Aforo esperado" value={`${item.aforo_esperado} personas`} />
        )}
        {item.asesor && <DetailField label="Empleado" value={item.asesor} />}
        {item.notas && <DetailField label="Observaciones" span={2} value={item.notas} />}
      </DetailGrid>

      <DetailSection title="Servicios incluidos" count={lineas.length}>
        {lineas.length === 0 ? (
          <DetailEmptyNote text="Sin servicios." />
        ) : (
          <DetailList>
            {lineas.map((linea) => (
              <div
                key={linea.descripcion}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-medium text-[#F1F5F9]">{linea.descripcion}</span>
                <span className="font-semibold text-[#10B981] tabular-nums">
                  {linea.valor}
                </span>
              </div>
            ))}
          </DetailList>
        )}
        <DetailHighlight label="Total" value={item.total} tone="accent" />
      </DetailSection>

      <DetailSection title="Cambiar estado">
        <div className="space-y-2">
          {TRANSICIONES[item.estado].map((estado) => (
            <DetailAction
              key={estado}
              icon={ESTADO_ICONS[estado]}
              label={`Marcar como ${estado.toLowerCase()}`}
              onClick={() => onStatusChange(item.id, estado)}
            />
          ))}
        </div>
      </DetailSection>

      <DetailSection title="Acciones">
        <div className="space-y-2">
          {item.estado === "Aceptada" && (
            <DetailAction
              icon={Sparkles}
              label="Crear evento"
              tone="accent"
              onClick={() => onCreateEvento(item)}
            />
          )}
          <DetailAction
            icon={Download}
            label="Descargar PDF"
            onClick={() => printCotizacion(item)}
          />
          <DetailAction
            icon={Mail}
            label="Enviar por correo"
            tone="info"
            onClick={() => window.location.assign(cotizacionMailto(item))}
          />
        </div>
      </DetailSection>
    </Drawer>
  )
}
