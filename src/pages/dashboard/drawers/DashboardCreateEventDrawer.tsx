import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type { EventoDraftFormState } from "../types"

interface DashboardCreateEventDrawerProps {
  isOpen: boolean; draft: EventoDraftFormState
  setDraft: React.Dispatch<React.SetStateAction<EventoDraftFormState>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const DashboardCreateEventDrawer: React.FC<DashboardCreateEventDrawerProps> =
  ({ isOpen, draft, setDraft, onClose, onSubmit }) => {
    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        position="center"
        title="Crear evento"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nombre del evento"
              placeholder="Ej. Gala corporativa 2026"
              value={draft.nombre}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDraft((d) => ({ ...d, nombre: e.target.value }))
              }
              required
            />
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                Modalidad
              </label>
              <CustomSelect
                value={draft.modalidad}
                onChange={(val) =>
                  setDraft((d) => ({
                    ...d,
                    modalidad: val as "Cliente" | "Propio",
                    cliente: "",
                  }))
                }
                options={[
                  { label: "Evento para cliente", value: "Cliente" },
                  {
                    label: "Producción propia (The High Events)",
                    value: "Propio",
                  },
                ]}
              />
            </div>
            {draft.modalidad === "Cliente" && (
              <FormInput
                label="Cliente o empresa"
                placeholder="Nombre del cliente"
                value={draft.cliente}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDraft((d) => ({ ...d, cliente: e.target.value }))
                }
                required
              />
            )}
            <FormInput
              label="Fecha del evento"
              type="date"
              value={draft.fecha}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDraft((d) => ({ ...d, fecha: e.target.value }))
              }
              required
            />
            <FormInput
              label="Locación"
              placeholder="Ej. Discoteca 360 / Club Campestre"
              value={draft.locacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDraft((d) => ({ ...d, locacion: e.target.value }))
              }
              required
            />
            <FormInput
              label="Presupuesto estimado (COP)"
              type="number"
              min={0}
              placeholder="Ej. 25000000"
              value={draft.presupuesto}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDraft((d) => ({ ...d, presupuesto: e.target.value }))
              }
              required
            />
          </div>

          {draft.modalidad === "Cliente" ? (
            <div className="p-3 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl text-xs text-[#C4B5FD] flex items-start gap-2">
              <span>
                💡 Los eventos de cliente requieren una cotización previa. En el formulario completo se cargarán automáticamente los servicios, fechas y locación acordados.
              </span>
            </div>
          ) : (
            <p className="text-[12px] text-[#94A3B8]">
              Después podrás completar concepto del show, equipos y personal en el formulario del evento.
            </p>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2D3748]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#F1F5F9] bg-transparent border border-[#2D3748] hover:bg-[#242830] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors shadow-lg shadow-[#7C3AED]/25 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
            >
              Crear evento
            </button>
          </div>
        </form>
      </Drawer>
    )
  }
