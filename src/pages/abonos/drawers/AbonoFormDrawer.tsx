import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type { AbonoItem, TipoAbonoTab } from "../types"
import { ESTADO_PAGO_OPTIONS } from "../data"

interface AbonoFormDrawerProps {
  isOpen: boolean
  activeTab?: TipoAbonoTab
  mode: "create" | "edit"
  abono: AbonoItem | null
  formState: Partial<AbonoItem>
  setFormState: React.Dispatch<React.SetStateAction<Partial<AbonoItem>>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const AbonoFormDrawer: React.FC<AbonoFormDrawerProps> = ({
  isOpen,
  activeTab = "Clientes",
  mode,
  abono,
  formState,
  setFormState,
  onClose,
  onSubmit,
}) => {
  const isClientes = activeTab === "Clientes"

  const handleTotalChange = (val: string) => {
    const cleanNum = Number(val.replace(/[^0-9]/g, "")) || 0
    const half = Math.round(cleanNum * 0.5)
    const halfFmt = `$ ${half.toLocaleString("es-CO")}`
    setFormState((f) => ({
      ...f,
      total: val,
      totalNum: cleanNum,
      anticipo: halfFmt,
      anticipoNum: half,
      saldo: halfFmt,
      saldoNum: half,
    }))
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title={
        mode === "edit"
          ? isClientes
            ? "Editar Abono de Cliente"
            : "Editar Pago a Proveedor"
          : isClientes
            ? "Registrar Nuevo Abono de Cliente"
            : "Registrar Contrato de Proveedor"
      }
      subtitle={
        mode === "edit"
          ? abono?.evento
          : isClientes
            ? "Esquema de anticipo 50% y saldo post-evento"
            : "Control de 50% anticipo y 50% saldo post-cumplimiento"
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Banner de regla */}
        <div className="bg-[#181B22] border border-[#262D3D] p-3 rounded-xl text-xs text-[#94A3B8]">
          <span className="text-[#A78BFA] font-semibold">
            Regla de Negocio:{" "}
          </span>
          {isClientes
            ? "El anticipo del 50% se cobra para la reserva, y el 50% restante se liquida tras la finalización satisfactoria del evento."
            : "El anticipo del 50% se desembolsa al inicio, y el 50% restante tras verificar el cumplimiento de los servicios contratados."}
        </div>

        <FormInput
          label="Nombre del Evento"
          placeholder="Ej. Festival 360, Boda Prom San José"
          required
          value={formState.evento || ""}
          onChange={(e) =>
            setFormState((f) => ({ ...f, evento: e.target.value }))
          }
        />

        {isClientes ? (
          <FormInput
            label="Cliente Asignado"
            placeholder="Ej. Grupo Éxito, Colegio San José"
            required
            value={formState.cliente || ""}
            onChange={(e) =>
              setFormState((f) => ({ ...f, cliente: e.target.value }))
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Servicio / Subcontrato"
              placeholder="Ej. Pantallas LED, Catering"
              required
              value={formState.servicio || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, servicio: e.target.value }))
              }
            />
            <FormInput
              label="Proveedor Contratado"
              placeholder="Ej. TechLight S.A."
              required
              value={formState.proveedor || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, proveedor: e.target.value }))
              }
            />
          </div>
        )}

        <FormInput
          label={
            isClientes
              ? "Monto Total Acordado (COP)"
              : "Monto Total Contratado (COP)"
          }
          placeholder="$ 0"
          required
          value={formState.total || ""}
          onChange={(e) => handleTotalChange(e.target.value)}
        />

        {/* 50% Anticipo y 50% Saldo automáticos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#14171F] p-3 rounded-xl border border-[#262D3D]">
          <FormInput
            label="Anticipo Calculado (50%)"
            value={formState.anticipo || "$ 0"}
            onChange={(e) =>
              setFormState((f) => ({ ...f, anticipo: e.target.value }))
            }
            required
          />
          <FormInput
            label="Saldo Calculado (50%)"
            value={formState.saldo || "$ 0"}
            onChange={(e) =>
              setFormState((f) => ({ ...f, saldo: e.target.value }))
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado Anticipo
            </label>
            <CustomSelect
              value={formState.estadoAnticipo || "Pendiente"}
              onChange={(val) =>
                setFormState((f) => ({
                  ...f,
                  estadoAnticipo: val as "Pagado" | "Pendiente",
                }))
              }
              options={ESTADO_PAGO_OPTIONS}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado Saldo
            </label>
            <CustomSelect
              value={formState.estadoSaldo || "Pendiente"}
              onChange={(val) =>
                setFormState((f) => ({
                  ...f,
                  estadoSaldo: val as "Pagado" | "Pendiente",
                }))
              }
              options={ESTADO_PAGO_OPTIONS}
            />
          </div>
        </div>

        <FormInput
          label="Fecha de Pago Estimada"
          type="date"
          required
          value={formState.fechaPago || ""}
          onChange={(e) =>
            setFormState((f) => ({ ...f, fechaPago: e.target.value }))
          }
        />

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
            Observaciones Iniciales
          </label>
          <textarea
            rows={2}
            value={formState.observaciones || ""}
            onChange={(e) =>
              setFormState((f) => ({ ...f, observaciones: e.target.value }))
            }
            placeholder="Términos del acuerdo o notas adicionales..."
            className="w-full px-3 py-2 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] resize-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2D3748]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer"
          >
            {mode === "edit" ? "Guardar Cambios" : "Registrar en Cartera"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
