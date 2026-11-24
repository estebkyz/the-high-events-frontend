import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import type { EventoItem } from "@/pages/eventos/types"
import { fieldSetter } from "@/utils/form"
import { ESTADO_VENTA_OPTIONS } from "../constants"
import { seleccionarEvento } from "../form"
import type { EstadoVenta, VentaForm } from "../types"

interface VentaFormDrawerProps extends FormDrawerProps<VentaForm> {
  eventos: EventoItem[]
}

export function VentaFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  eventos,
}: VentaFormDrawerProps) {
  const set = fieldSetter(setForm)

  const handleEvento = (id: string) =>
    set(
      seleccionarEvento(
        form,
        eventos.find((e) => e.id === id),
      ),
    )

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar venta" : "Crear venta"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormSelect
          label="Evento"
          required
          searchable
          placeholder="Seleccionar evento"
          value={form.evento_id}
          onChange={handleEvento}
          options={eventos.map((e) => ({
            label: e.nombre,
            value: e.id,
            badge: e.modalidad,
            sublabel: e.cliente_nombre,
          }))}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Número de factura"
            placeholder="Ej. FACT-2026-001"
            value={form.numero_factura}
            onChange={(e) => set({ numero_factura: e.target.value })}
            required
          />
          <FormInput
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(e) => set({ fecha: e.target.value })}
            required
          />
          <FormInput
            label="Monto total"
            type="number"
            min={1}
            placeholder="0"
            value={form.totalNum || ""}
            onChange={(e) => set({ totalNum: Number(e.target.value) })}
            required
          />
          {isEditing && (
            <FormSelect
              label="Estado"
              value={form.estado_venta}
              onChange={(val) => set({ estado_venta: val as EstadoVenta })}
              options={ESTADO_VENTA_OPTIONS}
            />
          )}
        </div>
        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear venta"}
        />
      </form>
    </Drawer>
  )
}
