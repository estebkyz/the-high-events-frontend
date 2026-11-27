import { useId } from "react"
import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSection } from "@/components/form/FormSection"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import { FormUbicacion } from "@/components/form/FormUbicacion"
import type { FormDrawerProps } from "@/components/form/types"
import type { ClienteItem } from "@/pages/clientes/types"
import { getClienteName } from "@/pages/clientes/utils"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import type { ServicioItem } from "@/pages/servicios/types"
import { fieldSetter } from "@/utils/form"
import { diasEntre } from "@/utils/format"
import { CotizacionServicios } from "../components/CotizacionServicios"
import type { CotizacionForm } from "../types"
import { terminaAlDiaSiguiente } from "../utils"

interface CotizacionFormDrawerProps extends FormDrawerProps<CotizacionForm> {
  clientes: ClienteItem[]
  empleados: EmpleadoItem[]
  servicios: ServicioItem[]
}

const GRID = "grid grid-cols-1 sm:grid-cols-2 gap-3.5"

export function CotizacionFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  clientes,
  empleados,
  servicios,
}: CotizacionFormDrawerProps) {
  const formId = useId()
  const set = fieldSetter(setForm)

  const handleCliente = (nombre: string) => {
    const cliente = clientes.find((c) => getClienteName(c) === nombre)
    set({
      cliente: nombre,
      cliente_id: cliente?.id,
      direccion: form.direccion || cliente?.direccion || "",
      nombre_evento: form.nombre_evento || `Evento - ${nombre}`,
    })
  }

  const handleAsesor = (nombre: string) => {
    const empleado = empleados.find((e) => getEmpleadoFullName(e) === nombre)
    set({ asesor: nombre, empleado_id: empleado?.id })
  }

  const diasVigencia = diasEntre(form.fecha, form.fechaVence)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar cotización" : "Crear cotización"}
      footer={
        <FormActions
          formId={formId}
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear cotización"}
          summary={
            <p aria-live="polite" className="text-xs text-ink-muted">
              Total cotizado
              <span className="block text-[15px] font-semibold text-ink tabular-nums leading-tight">
                {form.total}
              </span>
            </p>
          }
        />
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-4">
        <div className={GRID}>
          <FormSelect
            label="Cliente"
            required
            searchable
            placeholder="Seleccionar cliente"
            value={form.cliente}
            onChange={handleCliente}
            options={clientes.map((c) => ({
              label: getClienteName(c),
              value: getClienteName(c),
              badge: c.tipo_cliente,
              sublabel: `${c.tipo_documento}: ${c.numero_documento}`,
            }))}
          />
          <FormSelect
            label="Responsable"
            required
            searchable
            placeholder="Seleccionar empleado"
            value={form.asesor ?? ""}
            onChange={handleAsesor}
            options={empleados.map((e) => ({
              label: getEmpleadoFullName(e),
              value: getEmpleadoFullName(e),
              badge: e.cargo,
            }))}
          />
          <FormInput
            label="Fecha de emisión"
            type="date"
            value={form.fecha}
            onChange={(e) => set({ fecha: e.target.value })}
            required
          />
          <FormInput
            label="Fecha de vencimiento"
            type="date"
            min={form.fecha}
            value={form.fechaVence}
            onChange={(e) => set({ fechaVence: e.target.value })}
            required
            error={
              diasVigencia !== null && diasVigencia < 0
                ? "No puede ser anterior a la emisión"
                : undefined
            }
            hint={
              diasVigencia !== null
                ? `${diasVigencia} ${diasVigencia === 1 ? "día" : "días"} de vigencia`
                : undefined
            }
          />
        </div>

        <FormSection title="Datos del evento">
          <FormInput
            label="Nombre del evento"
            value={form.nombre_evento}
            onChange={(e) => set({ nombre_evento: e.target.value })}
            required
          />
          <FormUbicacion
            label="Ubicación del evento"
            value={form.direccion ?? ""}
            onChange={(direccion) => set({ direccion })}
          />
          <div className={GRID}>
            <FormInput
              label="Fecha del evento"
              type="date"
              value={form.fecha_evento ?? ""}
              onChange={(e) => set({ fecha_evento: e.target.value })}
            />
            <FormInput
              label="Aforo esperado"
              type="number"
              min={0}
              placeholder="0"
              value={form.aforo_esperado ?? ""}
              onChange={(e) =>
                set({ aforo_esperado: Number(e.target.value) || undefined })
              }
            />
            <FormInput
              label="Hora de inicio"
              type="time"
              value={form.hora_inicio ?? ""}
              onChange={(e) => set({ hora_inicio: e.target.value })}
            />
            <FormInput
              label="Hora de fin"
              type="time"
              value={form.hora_fin ?? ""}
              onChange={(e) => set({ hora_fin: e.target.value })}
              hint={
                terminaAlDiaSiguiente(form.hora_inicio, form.hora_fin)
                  ? "Termina al día siguiente"
                  : undefined
              }
            />
          </div>
        </FormSection>

        <CotizacionServicios form={form} onChange={set} servicios={servicios} />

        <FormTextarea
          label="Observaciones"
          maxLength={2000}
          rows={3}
          value={form.notas ?? ""}
          onChange={(e) => set({ notas: e.target.value })}
        />
      </form>
    </Drawer>
  )
}
