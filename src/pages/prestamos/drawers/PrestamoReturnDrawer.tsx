import type { Dispatch, SetStateAction, SubmitEvent } from "react"
import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSection } from "@/components/form/FormSection"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import { getEquipoTexto } from "@/pages/equipos/utils"
import { fieldSetter } from "@/utils/form"
import { CONDICION_RETORNO_OPTIONS } from "../constants"
import type { CondicionEquipo, DevolucionPrestamoForm, PrestamoItem } from "../types"

interface PrestamoReturnDrawerProps {
  isOpen: boolean
  prestamo: PrestamoItem | null
  saving: boolean
  form: DevolucionPrestamoForm
  setForm: Dispatch<SetStateAction<DevolucionPrestamoForm>>
  onClose: () => void
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void
}

export function PrestamoReturnDrawer({
  isOpen,
  prestamo,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
}: PrestamoReturnDrawerProps) {
  if (!prestamo) return null
  const set = fieldSetter(setForm)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title="Registrar devolución"
      subtitle={`${prestamo.codigo} · ${prestamo.responsable}`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Fecha de retorno"
          type="date"
          required
          value={form.fecha}
          onChange={(e) => set({ fecha: e.target.value })}
        />
        <FormSection title="Condición de los equipos al retorno">
          {prestamo.equipos.map((eq) => (
            <FormSelect
              key={eq.id}
              label={getEquipoTexto(eq)}
              value={form.condiciones[eq.id] ?? "Bueno"}
              onChange={(val) =>
                set({
                  condiciones: { ...form.condiciones, [eq.id]: val as CondicionEquipo },
                })
              }
              options={CONDICION_RETORNO_OPTIONS}
            />
          ))}
        </FormSection>
        <FormTextarea
          label="Observaciones"
          maxLength={2000}
          placeholder="Notas sobre el estado de retorno"
          value={form.observaciones}
          onChange={(e) => set({ observaciones: e.target.value })}
        />
        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel="Registrar devolución"
        />
      </form>
    </Drawer>
  )
}
