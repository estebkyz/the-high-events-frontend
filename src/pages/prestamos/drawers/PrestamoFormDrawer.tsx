import { CustomSelect } from "@/components/CustomSelect"
import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSection } from "@/components/form/FormSection"
import { FormSelect } from "@/components/form/FormSelect"
import { RemoveButton } from "@/components/form/RemoveButton"
import type { FormDrawerProps } from "@/components/form/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import type { EquipoItem } from "@/pages/equipos/types"
import { getEquipoTexto } from "@/pages/equipos/utils"
import type { EventoItem } from "@/pages/eventos/types"
import { fieldSetter } from "@/utils/form"
import { CONDICION_SALIDA_OPTIONS, PRESTABLES } from "../constants"
import type { CondicionEquipo, PrestamoForm } from "../types"

interface PrestamoFormDrawerProps extends FormDrawerProps<PrestamoForm> {
  empleados: EmpleadoItem[]
  eventos: EventoItem[]
  equipos: EquipoItem[]
}

export function PrestamoFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  empleados,
  eventos,
  equipos,
}: PrestamoFormDrawerProps) {
  const set = fieldSetter(setForm)
  const disponibles = equipos.filter(
    (eq) =>
      eq.propiedad === "Propio" &&
      PRESTABLES.includes(eq.estadoOperativo) &&
      !form.equipos.some((e) => e.id === eq.id),
  )

  const addEquipo = (id: string) => {
    const equipo = equipos.find((eq) => eq.id === id)
    if (!equipo) return
    const { nombre, serie } = equipo
    set({ equipos: [...form.equipos, { id, nombre, serie, condicionSalida: "Bueno" }] })
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar préstamo" : "Crear préstamo"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormSelect
            label="Empleado responsable"
            required
            searchable
            placeholder="Seleccionar empleado"
            options={empleados.map((emp) => ({
              label: getEmpleadoFullName(emp),
              value: getEmpleadoFullName(emp),
              sublabel: emp.cargo,
            }))}
            value={form.responsable}
            onChange={(val) => {
              const match = empleados.find((emp) => getEmpleadoFullName(emp) === val)
              set({ responsable: val, responsable_id: match && Number(match.id) })
            }}
          />
          <FormSelect
            label="Evento destino"
            required
            searchable
            placeholder="Seleccionar evento"
            options={eventos.map((ev) => ({
              label: ev.nombre,
              value: ev.nombre,
              sublabel: ev.cliente_nombre,
            }))}
            value={form.evento}
            onChange={(val) => {
              const match = eventos.find((ev) => ev.nombre === val)
              set({ evento: val, evento_id: match && Number(match.id) })
            }}
          />
          <FormInput
            label="Fecha de salida"
            type="date"
            required
            value={form.fechaSalida}
            onChange={(e) => set({ fechaSalida: e.target.value })}
          />
          <FormInput
            label="Devolución esperada"
            type="date"
            required
            min={form.fechaSalida}
            value={form.fechaDevolucion}
            onChange={(e) => set({ fechaDevolucion: e.target.value })}
          />
        </div>

        <FormSection
          title={`Equipos a prestar (${form.equipos.length})`}
          hint="Equipos propios del inventario que se entregan al responsable."
        >
          <CustomSelect
            ariaLabel="Agregar equipo"
            options={disponibles.map((eq) => ({
              label: getEquipoTexto(eq),
              value: eq.id,
              sublabel: `${eq.categoria} · ${eq.estadoOperativo}`,
            }))}
            value=""
            searchable
            clearOnSelect
            placeholder="Buscar y agregar equipo"
            onChange={addEquipo}
          />
          <div className="divide-y divide-[#2D3748]/60">
            {form.equipos.map((eq) => (
              <div
                key={eq.id}
                className="py-2.5 grid grid-cols-[1fr_140px_auto] items-center gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#F8FAFC] truncate">
                    {eq.nombre}
                  </p>
                  <p className="text-[11px] font-mono text-[#A78BFA]">{eq.serie}</p>
                </div>
                <CustomSelect
                  ariaLabel={`Condición de ${eq.nombre}`}
                  value={eq.condicionSalida}
                  options={CONDICION_SALIDA_OPTIONS}
                  onChange={(val) =>
                    set({
                      equipos: form.equipos.map((e) =>
                        e.id === eq.id
                          ? { ...e, condicionSalida: val as CondicionEquipo }
                          : e,
                      ),
                    })
                  }
                />
                <RemoveButton
                  label={`Quitar ${eq.nombre}`}
                  onClick={() =>
                    set({ equipos: form.equipos.filter((e) => e.id !== eq.id) })
                  }
                />
              </div>
            ))}
          </div>
        </FormSection>

        <FormInput
          label="Observaciones de entrega"
          placeholder="Ej. Incluye maleta rígida y cables XLR"
          value={form.observaciones_entrega ?? ""}
          onChange={(e) => set({ observaciones_entrega: e.target.value })}
        />

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear préstamo"}
        />
      </form>
    </Drawer>
  )
}
