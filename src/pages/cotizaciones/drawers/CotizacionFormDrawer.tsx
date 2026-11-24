import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import type { ClienteItem } from "@/pages/clientes/types"
import { getClienteName } from "@/pages/clientes/utils"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import type { ServicioItem } from "@/pages/servicios/types"
import { fieldSetter } from "@/utils/form"
import { CotizacionServicios } from "../components/CotizacionServicios"
import type { CotizacionForm } from "../types"

interface CotizacionFormDrawerProps extends FormDrawerProps<CotizacionForm> {
  clientes: ClienteItem[]
  empleados: EmpleadoItem[]
  servicios: ServicioItem[]
}

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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar cotización" : "Crear cotización"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            label="Empleado"
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
            label="Nombre del evento"
            value={form.nombre_evento}
            onChange={(e) => set({ nombre_evento: e.target.value })}
            required
          />
          <FormInput
            label="Ubicación del evento"
            value={form.direccion ?? ""}
            onChange={(e) => set({ direccion: e.target.value })}
          />
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
            onChange={(e) => set({ aforo_esperado: Number(e.target.value) || undefined })}
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
          />
        </div>

        <CotizacionServicios form={form} onChange={set} servicios={servicios} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[#2D3748]/60">
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
          />
          <FormInput
            label="Total cotizado"
            hint="Se calcula con los servicios"
            value={form.total}
            readOnly
          />
          <FormInput
            label="Observaciones"
            value={form.notas ?? ""}
            onChange={(e) => set({ notas: e.target.value })}
          />
        </div>

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear cotización"}
        />
      </form>
    </Drawer>
  )
}
