import { Layers } from "lucide-react"
import { EmptyState } from "@/components/EmptyState"
import { ToggleChips } from "@/components/ToggleChips"
import { FormSection } from "@/components/form/FormSection"
import { HeaderButton } from "@/components/list/HeaderButton"
import { TagsCell } from "@/components/list/cells"
import { toggleValue } from "@/utils/list"
import type { ProveedorForm } from "../types"

interface ProveedorSuministroProps {
  form: ProveedorForm
  onChange: (changes: Partial<ProveedorForm>) => void
  servicios: string[]
  loading: boolean
  onCreateServicio: () => void
}

/** Qué suministra el proveedor: servicios, equipos en alquiler o ambos. */
export function ProveedorSuministro({
  form,
  onChange,
  servicios,
  loading,
  onCreateServicio,
}: ProveedorSuministroProps) {
  const isEmpty = servicios.length === 0

  return (
    <>
      <FormSection
        title="Servicios que provee"
        hint="Elige al menos un servicio o marca que alquila equipos."
        action={
          !isEmpty && (
            <HeaderButton
              icon={Layers}
              label="Crear servicio"
              onClick={onCreateServicio}
            />
          )
        }
      >
        {loading && <p className="text-xs text-ink-muted">Cargando servicios…</p>}
        {!loading && isEmpty && (
          <EmptyState
            compact
            icon={Layers}
            title="Aún no hay servicios creados"
            description="Crea el primero sin salir de este formulario: quedará asignado a este proveedor."
            action={{ label: "Crear servicio", onClick: onCreateServicio }}
          />
        )}
        {!isEmpty && (
          <ToggleChips
            options={servicios}
            selected={form.servicios}
            onToggle={(s) => onChange({ servicios: toggleValue(form.servicios, s) })}
          />
        )}
      </FormSection>

      <FormSection title="Equipos en alquiler">
        {form.equipos.length > 0 && (
          <TagsCell tags={form.equipos} max={form.equipos.length} />
        )}
        <label className="flex items-start gap-2.5 text-xs text-ink-soft cursor-pointer">
          <input
            type="checkbox"
            checked={form.registrar_equipo}
            onChange={(e) => onChange({ registrar_equipo: e.target.checked })}
            className="mt-0.5 w-4 h-4 accent-brand"
          />
          <span>
            Registrar un equipo de este proveedor al guardar
            <span className="block text-xs text-ink-muted mt-0.5">
              Se abrirá el formulario de Equipos con el proveedor ya seleccionado.
            </span>
          </span>
        </label>
      </FormSection>
    </>
  )
}
