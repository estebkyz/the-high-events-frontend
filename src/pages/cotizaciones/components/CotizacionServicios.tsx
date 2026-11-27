import { CustomSelect } from "@/components/CustomSelect"
import { DetailEmptyNote } from "@/components/detail"
import { FormMoneyInput } from "@/components/form/FormMoneyInput"
import { FormSection } from "@/components/form/FormSection"
import { RemoveButton } from "@/components/form/RemoveButton"
import type { ServicioItem } from "@/pages/servicios/types"
import { formatCOP, parseCOP } from "@/utils/format"
import { agregarServicio, cambiarMonto, quitarServicio } from "../form"
import type { CotizacionForm } from "../types"

interface CotizacionServiciosProps {
  form: CotizacionForm
  onChange: (changes: Partial<CotizacionForm>) => void
  servicios: ServicioItem[]
}

/** Cantidad guardada y, si el precio se ajustó, la tarifa de la que partió. */
function getNota(form: CotizacionForm, index: number, servicios: ServicioItem[]): string {
  const nombre = form.servicios[index]
  const monto = parseCOP(form.montos[index])
  const cantidad = form.items?.find((it) => it.nombre === nombre)?.cantidad ?? 1
  const tarifa = parseCOP(servicios.find((s) => s.nombre === nombre)?.precioBase)
  return [
    cantidad > 1 && monto > 0 && `${cantidad} × ${formatCOP(monto / cantidad)}`,
    tarifa > 0 &&
      monto !== tarifa * cantidad &&
      `Tarifa base: ${formatCOP(tarifa * cantidad)}`,
  ]
    .filter(Boolean)
    .join(" · ")
}

export function CotizacionServicios({
  form,
  onChange,
  servicios,
}: CotizacionServiciosProps) {
  // Solo lo que aún se puede agregar: activo y sin repetir.
  const disponibles = servicios.filter(
    (s) => s.estado === "Activo" && !form.servicios.includes(s.nombre),
  )

  const handleAdd = (id: string) => {
    const servicio = servicios.find((s) => s.id === id)
    if (servicio) onChange(agregarServicio(form, servicio))
  }

  return (
    <FormSection
      title={`Servicios contratados (${form.servicios.length})`}
      hint="Cada precio parte de la tarifa base y se puede ajustar."
    >
      <CustomSelect
        ariaLabel="Agregar servicio"
        value=""
        options={disponibles.map((s) => ({
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
      {form.servicios.length === 0 && (
        <DetailEmptyNote text="Agrega al menos un servicio." />
      )}
      <ul className="divide-y divide-line-soft">
        {form.servicios.map((servicio, index) => {
          const nota = getNota(form, index, servicios)
          return (
            <li key={servicio} className="py-2.5 flex items-center justify-between gap-3">
              <span className="min-w-0 text-xs">
                <span className="block font-medium text-ink break-words">{servicio}</span>
                {nota && (
                  <span className="block mt-0.5 text-xs text-ink-muted tabular-nums">
                    {nota}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <FormMoneyInput
                  label={`Precio de ${servicio}`}
                  hideLabel
                  className="w-32 sm:w-36 text-right font-semibold tabular-nums"
                  value={form.montos[index] ? parseCOP(form.montos[index]) : undefined}
                  onChange={(val) => onChange(cambiarMonto(form, index, val))}
                />
                <RemoveButton
                  label={`Quitar ${servicio}`}
                  onClick={() => onChange(quitarServicio(form, index))}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </FormSection>
  )
}
