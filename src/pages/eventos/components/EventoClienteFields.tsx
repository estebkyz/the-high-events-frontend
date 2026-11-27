import { Link } from "react-router-dom"
import { FormSelect } from "@/components/form/FormSelect"
import type { CotizacionItem } from "@/pages/cotizaciones/types"
import { ROUTE_PATHS } from "@/routes/paths"
import { cambiarModalidad, cotizacionesPorPlanificar, desdeCotizacion } from "../form"
import type { EventoItem, EventoSectionProps } from "../types"
import { EventoPropioFields } from "./EventoPropioFields"

interface EventoClienteFieldsProps extends EventoSectionProps {
  /** Al editar, el evento ya tiene su cotización y su cliente. */
  editing: boolean
  eventos: EventoItem[]
  cotizaciones: CotizacionItem[]
}

/**
 * Evento de cliente: nace de su cotización aceptada. Al crearlo se elige esa cotización y se carga su
 * evento (cliente, nombre, fecha, lugar, valor y servicios); aquí se completan personal y equipos.
 */
export function EventoClienteFields({
  form,
  onChange,
  editing,
  eventos,
  cotizaciones,
}: EventoClienteFieldsProps) {
  if (editing) {
    return (
      <div className="space-y-5">
        <FormSelect
          label="Cliente"
          disabled
          options={[{ label: form.cliente_nombre, value: form.cliente_id ?? "" }]}
          value={form.cliente_id ?? ""}
          onChange={() => undefined}
          hint={
            form.cotizacion_codigo
              ? `Cotización ${form.cotizacion_codigo}: el cliente y los servicios vienen de ella`
              : undefined
          }
        />
        <EventoPropioFields form={form} onChange={onChange} />
      </div>
    )
  }

  const pendientes = cotizacionesPorPlanificar(cotizaciones, eventos)
  // Solo los clientes con cotizaciones aceptadas por planificar, sin repetir
  const clientes = [
    ...new Map(
      pendientes.map(({ evento }) => [evento.cliente_id ?? "", evento.cliente_nombre]),
    ).entries(),
  ]
  const delCliente = pendientes.filter(
    ({ evento }) => evento.cliente_id === form.cliente_id,
  )

  const cargar = ({ evento }: (typeof pendientes)[number]) =>
    onChange(desdeCotizacion(evento, form))
  const handleCliente = (clienteId: string) => {
    if (clienteId === form.cliente_id) return
    const suyas = pendientes.filter(({ evento }) => evento.cliente_id === clienteId)
    // Con una sola cotización se carga de una vez
    if (suyas.length === 1) cargar(suyas[0])
    else
      onChange({
        ...cambiarModalidad("Cliente"),
        cliente_id: clienteId,
        cliente_nombre: suyas[0]?.evento.cliente_nombre ?? "",
      })
  }
  const handleCotizacion = (id: string) => {
    const elegida = delCliente.find((p) => p.cotizacion.id === id)
    if (elegida) cargar(elegida)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect
          label="Cliente"
          required
          searchable
          placeholder={
            clientes.length
              ? "Selecciona un cliente"
              : "Sin cotizaciones aceptadas por planificar"
          }
          options={clientes.map(([value, label]) => ({ label, value }))}
          value={form.cliente_id ?? ""}
          onChange={handleCliente}
          disabled={!clientes.length}
          hint="Clientes con cotizaciones aceptadas por planificar"
        />
        <FormSelect
          label="Cotización aceptada"
          required
          placeholder={
            form.cliente_id ? "Selecciona la cotización" : "Primero elige el cliente"
          }
          options={delCliente.map(({ cotizacion }) => ({
            label: `${cotizacion.codigo} · ${cotizacion.nombre_evento}`,
            value: cotizacion.id,
            sublabel: cotizacion.total,
          }))}
          value={form.cotizacion_id ?? ""}
          onChange={handleCotizacion}
          disabled={!delCliente.length}
          hint={
            form.id
              ? "Los servicios vienen de ella; aquí asignas personal, tareas y equipos"
              : undefined
          }
        />
      </div>
      {!pendientes.length && (
        <p className="text-xs text-ink-muted">
          Primero crea la cotización con sus servicios y márcala como aceptada en{" "}
          <Link
            to={ROUTE_PATHS.cotizaciones}
            className="font-medium text-brand-ink underline"
          >
            Cotizaciones
          </Link>
          .
        </p>
      )}
      {form.id && <EventoPropioFields form={form} onChange={onChange} />}
    </div>
  )
}
