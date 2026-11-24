import { CustomSelect } from "@/components/CustomSelect"
import { FormSection } from "@/components/form/FormSection"
import { RemoveButton } from "@/components/form/RemoveButton"
import type { ServicioItem } from "@/pages/servicios/types"
import { agregarServicio, quitarServicio } from "../form"
import type { CotizacionForm } from "../types"

interface CotizacionServiciosProps {
  form: CotizacionForm
  onChange: (changes: Partial<CotizacionForm>) => void
  servicios: ServicioItem[]
}

export function CotizacionServicios({
  form,
  onChange,
  servicios,
}: CotizacionServiciosProps) {
  const handleAdd = (id: string) => {
    const servicio = servicios.find((s) => s.id === id)
    if (servicio) onChange(agregarServicio(form, servicio))
  }

  return (
    <FormSection title={`Servicios contratados (${form.servicios.length})`}>
      <CustomSelect
        ariaLabel="Agregar servicio"
        value=""
        options={servicios.map((s) => ({
          label: s.nombre,
          value: s.id,
          badge: s.categoria,
          sublabel: s.precioBase,
        }))}
        searchable
        clearOnSelect
        placeholder="Agregar servicio"
        onChange={handleAdd}
      />
      <div className="divide-y divide-[#2D3748]/60">
        {form.servicios.map((servicio, index) => (
          <div key={servicio} className="py-2.5 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#F1F5F9]">{servicio}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#10B981] tabular-nums">
                {form.montos[index]}
              </span>
              <RemoveButton
                label={`Quitar ${servicio}`}
                onClick={() => onChange(quitarServicio(form, index))}
              />
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  )
}
