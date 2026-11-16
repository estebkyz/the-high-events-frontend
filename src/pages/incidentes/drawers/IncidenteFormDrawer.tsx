import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type { IncidenteFormData, Criticidad, TipoIncidente } from "../types"
import { CRITICIDAD_OPTIONS, TIPO_INCIDENTE_OPTIONS } from "../data"

interface IncidenteFormDrawerProps {
  isOpen: boolean
  newIncForm: IncidenteFormData
  setNewIncForm: React.Dispatch<React.SetStateAction<IncidenteFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const IncidenteFormDrawer: React.FC<IncidenteFormDrawerProps> = ({
  isOpen,
  newIncForm,
  setNewIncForm,
  onClose,
  onSubmit,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title="Registrar Incidente"
      subtitle="Nuevo registro de incidente operativo"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Título del Incidente"
          required
          value={newIncForm.titulo ?? ""}
          onChange={(e) =>
            setNewIncForm((f) => ({ ...f, titulo: e.target.value }))
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Tipo de Incidente
            </label>
            <CustomSelect
              value={newIncForm.tipo_incidente ?? "otro"}
              onChange={(val) =>
                setNewIncForm((f) => ({ ...f, tipo_incidente: val as TipoIncidente }))
              }
              options={TIPO_INCIDENTE_OPTIONS}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Criticidad / Gravedad
            </label>
            <CustomSelect
              value={newIncForm.criticidad ?? "Media"}
              onChange={(val) =>
                setNewIncForm((f) => ({ ...f, criticidad: val as Criticidad }))
              }
              options={CRITICIDAD_OPTIONS}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Evento Afectado"
            required
            value={newIncForm.evento ?? ""}
            onChange={(e) =>
              setNewIncForm((f) => ({ ...f, evento: e.target.value }))
            }
          />
          <FormInput
            label="Empleado que Reporta"
            required
            value={newIncForm.reporta ?? ""}
            onChange={(e) =>
              setNewIncForm((f) => ({ ...f, reporta: e.target.value }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Área / Equipo Afectado"
            placeholder="Ej. Pantalla Central"
            required
            value={newIncForm.areaAfectada ?? ""}
            onChange={(e) =>
              setNewIncForm((f) => ({ ...f, areaAfectada: e.target.value }))
            }
          />
          <FormInput
            label="Costo Adicional Estimado ($)"
            type="number"
            placeholder="0"
            value={String(newIncForm.costo_adicional ?? 0)}
            onChange={(e) =>
              setNewIncForm((f) => ({ ...f, costo_adicional: Number(e.target.value) }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Descripción de la Falla
          </label>
          <textarea
            value={newIncForm.descripcion ?? ""}
            onChange={(e) =>
              setNewIncForm((f) => ({ ...f, descripcion: e.target.value }))
            }
            placeholder="Describe detalladamente el incidente..."
            rows={3}
            className="px-3.5 py-2.5 bg-[#111318] border border-[#2D3748] rounded-xl text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] resize-none"
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
            Guardar Incidente
          </button>
        </div>
      </form>
    </Drawer>
  )
}
