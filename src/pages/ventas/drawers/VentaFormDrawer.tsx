import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import { TIPO_VENTA_OPTIONS } from "../data"
import type {
  VentaItem,
  VentaFormData,
  TipoVenta,
  EstadoPagoVenta,
} from "../types"

interface VentaFormDrawerProps {
  mode: "create" | "edit"; isOpen: boolean
  onClose: () => void
  sale: VentaItem | null
  formData: VentaFormData
  setFormData: React.Dispatch<React.SetStateAction<VentaFormData>>
  onSubmit: (e: React.FormEvent) => void
}

const ESTADO_PAGO_SELECT_OPTIONS = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Parcial", label: "Parcial" },
  { value: "Pagado", label: "Pagado" },
]

export function VentaFormDrawer({
  mode,
  isOpen,
  onClose,
  sale,
  formData,
  setFormData,
  onSubmit,
}: VentaFormDrawerProps) {
  const isEdit = mode === "edit"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title={isEdit ? `Editar ${sale?.codigo}` : "Registrar Venta"}
      subtitle={
        isEdit
          ? "Modifica los datos del comprobante"
          : "Registra un nuevo comprobante de ingreso"
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 block">
            Tipo de Venta
          </label>
          <CustomSelect
            value={formData.tipo as string || "Cliente"}
            onChange={(val) =>
              setFormData((f) => ({ ...f, tipo: val as TipoVenta }))
            }
            options={TIPO_VENTA_OPTIONS}
          />
        </div>

        <FormInput
          label="Cliente o Nombre de Evento"
          value={formData.clienteEvento || ""}
          onChange={(e) =>
            setFormData((f) => ({ ...f, clienteEvento: e.target.value }))
          }
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Número de Factura"
            placeholder="FACT-2026-..."
            value={formData.numero_factura || ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, numero_factura: e.target.value }))
            }
          />
          <FormInput
            label="Fecha"
            type="date"
            value={formData.fecha || ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, fecha: e.target.value }))
            }
            required
          />
        </div>

        <FormInput
          label="Monto Total"
          type="number"
          placeholder="0"
          value={
            formData.totalNum !== undefined ? String(formData.totalNum) : ""
          }
          onChange={(e) =>
            setFormData((f) => ({ ...f, totalNum: Number(e.target.value) }))
          }
          required
        />

        <div>
          <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 block">
            Estado del Pago
          </label>
          <CustomSelect
            value={formData.estadoPago as string || "Pendiente"}
            onChange={(val) =>
              setFormData((f) => ({ ...f, estadoPago: val as EstadoPagoVenta }))
            }
            options={ESTADO_PAGO_SELECT_OPTIONS}
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#94A3B8] hover:bg-[#181B22] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            {isEdit ? "Guardar Cambios" : "Registrar Venta"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
