import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailEmptyNote,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailHighlight,
  DetailList,
  DetailSection,
  DetailUbicacion,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { formatFecha, formatFechaLarga, todayISO } from "@/utils/format"
import { CotizacionAcciones } from "../components/CotizacionAcciones"
import { VIGENCIA_TONES } from "../constants"
import type { CotizacionItem, EstadoCotizacion } from "../types"
import { formatHorario, getCotizacionLineas, getVigencia } from "../utils"

interface CotizacionDetailDrawerProps extends DetailDrawerProps<CotizacionItem> {
  correoCliente: string | undefined
  onStatusChange: (id: string, estado: EstadoCotizacion) => unknown
  onOpenEvento: (cotizacion: CotizacionItem) => void
}

export function CotizacionDetailDrawer({
  isOpen,
  item,
  correoCliente,
  onClose,
  onEdit,
  onStatusChange,
  onOpenEvento,
}: CotizacionDetailDrawerProps) {
  if (!item) return null
  const lineas = getCotizacionLineas(item)
  const vigencia = getVigencia(item, todayISO())
  const horario = formatHorario(item.hora_inicio, item.hora_fin)

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
        badges={
          <>
            <StatusBadge status={item.estado} />
            <span className="text-xs font-semibold text-ink-soft tabular-nums">
              {item.codigo}
            </span>
          </>
        }
        title={item.nombre_evento || "Evento sin nombre"}
        subtitle={item.cliente}
        meta={
          <>
            <span>Emitida: {formatFecha(item.fecha)}</span>
            <span className={`font-semibold ${VIGENCIA_TONES[vigencia.tone]}`}>
              {vigencia.texto}
            </span>
          </>
        }
      />

      <DetailHighlight label="Total cotizado" value={item.total} tone="accent" />

      <CotizacionAcciones
        item={item}
        correoCliente={correoCliente}
        onStatusChange={onStatusChange}
        onOpenEvento={onOpenEvento}
      />

      <DetailSection title="Datos del evento">
        <DetailGrid>
          <DetailField label="Fecha" span={2}>
            <span className="inline-block first-letter:uppercase">
              {item.fecha_evento ? formatFechaLarga(item.fecha_evento) : "Por definir"}
            </span>
          </DetailField>
          <DetailField label="Horario" span={2} value={horario ?? "Por definir"} />
          <DetailUbicacion
            label="Ubicación"
            span={2}
            value={item.direccion}
            fallback="Por definir"
          />
          <DetailField
            label="Aforo esperado"
            value={
              item.aforo_esperado ? `${item.aforo_esperado} personas` : "Por definir"
            }
          />
          <DetailField label="Responsable" value={item.asesor || "Sin asignar"} />
          {item.notas && (
            <DetailField
              label="Observaciones"
              span={2}
              value={item.notas}
              valueClassName="whitespace-pre-line"
            />
          )}
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Servicios incluidos" count={lineas.length}>
        {lineas.length === 0 ? (
          <DetailEmptyNote text="Sin servicios." />
        ) : (
          <DetailList>
            {lineas.map((linea) => (
              <div
                key={linea.nombre}
                className="py-2.5 flex items-baseline justify-between gap-3 text-xs"
              >
                <span className="min-w-0">
                  <span className="block font-medium text-ink break-words">
                    {linea.nombre}
                  </span>
                  {linea.desglose && (
                    <span className="block mt-0.5 text-xs text-ink-muted tabular-nums">
                      {linea.desglose}
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-semibold text-ink tabular-nums">
                  {linea.valor}
                </span>
              </div>
            ))}
            <div className="py-2.5 flex items-baseline justify-between gap-3 text-xs font-semibold">
              <span className="text-ink">Total</span>
              <span className="text-ink tabular-nums">{item.total}</span>
            </div>
          </DetailList>
        )}
      </DetailSection>
    </Drawer>
  )
}
