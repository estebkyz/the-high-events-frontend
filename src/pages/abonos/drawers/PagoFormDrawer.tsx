import type { Dispatch, SetStateAction, SubmitEvent } from "react"
import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import { fieldSetter } from "@/utils/form"
import {
  CARTERA,
  ESTADO_PAGO_OPTIONS,
  METODO_PAGO_OPTIONS,
  TIPO_PAGO_OPTIONS,
} from "../constants"
import { montoSugerido } from "../form"
import type { AbonoItem, EstadoPago, PagoForm, TipoPago } from "../types"
import { getAbonoName } from "../utils"

interface PagoFormDrawerProps {
  isOpen: boolean
  abono: AbonoItem | null
  saving: boolean
  form: PagoForm
  setForm: Dispatch<SetStateAction<PagoForm>>
  onClose: () => void
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void
}

export function PagoFormDrawer({
  isOpen,
  abono,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
}: PagoFormDrawerProps) {
  if (!abono) return null
  const set = fieldSetter(setForm)

  const handleTipo = (val: string) => {
    const tipoPago = val as TipoPago
    set({ tipoPago, montoNum: montoSugerido(abono, tipoPago) })
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title="Registrar transacción"
      subtitle={getAbonoName(abono)}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormSelect
            label="Tipo de pago"
            value={form.tipoPago}
            onChange={handleTipo}
            options={TIPO_PAGO_OPTIONS}
          />
          <FormInput
            label="Monto"
            type="number"
            min={1}
            max={abono.totalNum}
            required
            value={form.montoNum || ""}
            onChange={(e) => set({ montoNum: Number(e.target.value) })}
          />
          <FormInput
            label="Fecha de pago"
            type="date"
            required
            value={form.fecha}
            onChange={(e) => set({ fecha: e.target.value })}
          />
          <FormSelect
            label="Medio de pago"
            value={form.metodo}
            onChange={(val) => set({ metodo: val })}
            options={METODO_PAGO_OPTIONS}
          />
          <FormInput
            label="Comprobante o referencia"
            required
            placeholder="Ej. TR-2026-9941"
            value={form.comprobante}
            onChange={(e) => set({ comprobante: e.target.value })}
          />
          <FormSelect
            label="Estado"
            value={form.estado}
            onChange={(val) => set({ estado: val as EstadoPago })}
            options={ESTADO_PAGO_OPTIONS}
          />
        </div>
        {form.tipoPago === "Saldo" && (
          <label className="flex items-start gap-2.5 text-[12px] text-[#CBD5E1] cursor-pointer">
            <input
              type="checkbox"
              checked={form.condicionVerificada}
              onChange={(e) => set({ condicionVerificada: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-[#7C3AED]"
            />
            {CARTERA[abono.tipoCartera].condicionSaldo}
          </label>
        )}
        <FormTextarea
          label="Observaciones"
          rows={2}
          value={form.observaciones}
          onChange={(e) => set({ observaciones: e.target.value })}
        />
        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel="Registrar transacción"
        />
      </form>
    </Drawer>
  )
}
