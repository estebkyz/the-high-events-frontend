import { useRef } from "react"
import { SegmentedControl } from "@/components/SegmentedControl"
import type { ClienteItem } from "@/pages/clientes/types"
import type { CotizacionItem } from "@/pages/cotizaciones/types"
import { MODALIDAD_OPTIONS } from "../constants"
import { cambiarModalidad } from "../form"
import type { EventoForm, EventoSectionProps, ModalidadEvento } from "../types"
import { EventoClienteFields } from "./EventoClienteFields"
import { EventoPropioFields } from "./EventoPropioFields"

interface EventoDatosSectionProps extends EventoSectionProps {
  clientes: ClienteItem[]
  cotizaciones: CotizacionItem[]
  onCreateCotizacion: () => void
}

export function EventoDatosSection({
  form,
  onChange,
  clientes,
  cotizaciones,
  onCreateCotizacion,
}: EventoDatosSectionProps) {
  // Conserva lo digitado en cada modalidad al alternar entre ellas.
  const drafts = useRef<Partial<Record<ModalidadEvento, EventoForm>>>({})

  const handleModalidad = (next: ModalidadEvento) => {
    if (next === form.modalidad) return
    drafts.current[form.modalidad] = form
    onChange(drafts.current[next] ?? cambiarModalidad(next))
  }

  return (
    <section className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#262D3D]">
        <h2 className="text-[15px] font-bold text-[#F8FAFC]">Datos generales</h2>
        <SegmentedControl
          label="Modalidad del evento"
          value={form.modalidad}
          options={MODALIDAD_OPTIONS}
          onChange={(val) => handleModalidad(val as ModalidadEvento)}
        />
      </div>
      {form.modalidad === "Cliente" ? (
        <EventoClienteFields
          form={form}
          onChange={onChange}
          clientes={clientes}
          cotizaciones={cotizaciones}
          onCreateCotizacion={onCreateCotizacion}
        />
      ) : (
        <EventoPropioFields form={form} onChange={onChange} />
      )}
    </section>
  )
}
