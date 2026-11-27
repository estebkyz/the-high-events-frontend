import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"

import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import type { EventoItem } from "@/pages/eventos/types"
import { fieldSetter } from "@/utils/form"
import { formatCOP } from "@/utils/format"
import { ESTADO_VENTA_OPTIONS } from "../constants"
import { eventoVendible } from "../form"
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

  const evento = eventos.find((e) => e.id === form.evento_id)

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
          onChange={(evento_id) => set({ evento_id })}
          options={eventos
            .filter((e) => eventoVendible(e) || e.id === form.evento_id)
            .map((e) => ({
              label: e.nombre,
              value: e.id,
              badge: e.modalidad,
              sublabel: e.cliente_nombre,
            }))}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Número de factura"
            maxLength={30}
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
            label="Valor (del evento)"
            readOnly
            value={
              evento?.valor_total ? formatCOP(evento.valor_total) : "Elige un evento"
            }
            hint="Se cambia en el evento"
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
