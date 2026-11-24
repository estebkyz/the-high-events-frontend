import { FilePlus } from "lucide-react"
import { EmptyState } from "@/components/EmptyState"
import { DetailField, DetailGrid } from "@/components/detail"
import { FormSelect } from "@/components/form/FormSelect"
import type { ClienteItem } from "@/pages/clientes/types"
import { getClienteName } from "@/pages/clientes/utils"
import type { CotizacionItem } from "@/pages/cotizaciones/types"
import { formatCOP } from "@/utils/format"
import { ESTADO_EVENTO_OPTIONS } from "../constants"
import { aplicarCotizacion, cotizacionesDeCliente, seleccionarCliente } from "../form"
import type { EstadoEvento, EventoSectionProps } from "../types"
import { EventoLugarFields } from "./EventoLugarFields"

interface EventoClienteFieldsProps extends EventoSectionProps {
  clientes: ClienteItem[]
  cotizaciones: CotizacionItem[]
  onCreateCotizacion: () => void
}

export function EventoClienteFields({
  form,
  onChange,
  clientes,
  cotizaciones,
  onCreateCotizacion,
}: EventoClienteFieldsProps) {
  const cliente = clientes.find((c) => c.id === form.cliente_id)
  const disponibles = cotizacionesDeCliente(cliente, cotizaciones)
  // Al editar, la cotización vinculada se muestra aunque ya no esté "Aceptada".
  const vinculada = cotizaciones.find((c) => c.id === form.cotizacion_id)
  const opciones =
    vinculada && !disponibles.includes(vinculada)
      ? [vinculada, ...disponibles]
      : disponibles

  const handleCliente = (id: string) => {
    const next = clientes.find((c) => c.id === id)
    if (next) onChange(seleccionarCliente(next, cotizaciones))
  }

  const handleCotizacion = (id: string) => {
    const next = opciones.find((c) => c.id === id)
    if (next) onChange(aplicarCotizacion(next))
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormSelect
          label="Cliente"
          required
          searchable
          placeholder="Selecciona un cliente"
          options={clientes.map((c) => ({ label: getClienteName(c), value: c.id }))}
          value={form.cliente_id ?? ""}
          onChange={handleCliente}
        />
        <FormSelect
          label="Cotización aceptada"
          required
          searchable
          disabled={opciones.length === 0}
          placeholder={cliente ? "Sin cotizaciones aceptadas" : "Selecciona un cliente"}
          options={opciones.map((c) => ({
            label: `${c.codigo} — ${c.nombre_evento}`,
            value: c.id,
            sublabel: c.total,
          }))}
          value={form.cotizacion_id ?? ""}
          onChange={handleCotizacion}
        />
        <FormSelect
          label="Estado"
          options={ESTADO_EVENTO_OPTIONS}
          value={form.estado}
          onChange={(val) => onChange({ estado: val as EstadoEvento })}
        />
      </div>

      {cliente && opciones.length === 0 && (
        <EmptyState
          compact
          icon={FilePlus}
          title="Este cliente no tiene cotizaciones aceptadas"
          description="El evento de cliente hereda nombre, lugar, horario y servicios de una cotización aceptada."
          action={{ label: "Ir a cotizaciones", onClick: onCreateCotizacion }}
        />
      )}

      {form.cotizacion_id && (
        <div className="pt-5 border-t border-[#262D3D] space-y-3">
          <p className="text-[11px] text-[#94A3B8]">
            Datos heredados de la cotización{" "}
            <span className="font-mono text-[#A78BFA]">{form.cotizacion_codigo}</span>
          </p>
          <DetailGrid>
            <DetailField label="Nombre del evento" value={form.nombre || "Sin nombre"} />
            <DetailField
              label="Presupuesto"
              value={formatCOP(form.presupuesto_estimado)}
              valueClassName="text-[#10B981]"
            />
            <DetailField
              label="Aforo esperado"
              value={
                form.aforo_esperado ? `${form.aforo_esperado} personas` : "Sin definir"
              }
            />
            <DetailField label="Observaciones" value={form.observaciones || "Ninguna"} />
          </DetailGrid>
          <div className="space-y-4 pt-2">
            <EventoLugarFields form={form} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  )
}
