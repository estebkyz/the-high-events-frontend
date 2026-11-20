import React, { useMemo } from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect, type SelectOption } from "../../../components/CustomSelect"
import type { IncidenteFormData, Criticidad, TipoIncidente } from "../types"
import { CRITICIDAD_OPTIONS, TIPO_INCIDENTE_OPTIONS } from "../data"
import { EVENTOS_MOCK, AVAILABLE_EMPLOYEES } from "../../eventos/data"
import { INITIAL_EVENTS } from "../../agendamiento/data"

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
  const eventoOptions = useMemo<SelectOption[]>(() => {
    const fromEventos = EVENTOS_MOCK.map((ev) => ({
      label: ev.nombre,
      value: ev.nombre,
      sublabel: `${ev.cliente_nombre} · ${ev.direccion}`,
    }))
    const seen = new Set(fromEventos.map((e) => e.value))
    const fromAgenda = INITIAL_EVENTS.filter(
      (ag) => ag.kind === "evento" && !seen.has(ag.title),
    ).map((ag) => ({
      label: ag.title,
      value: ag.title,
      sublabel: `${ag.client} · ${ag.venue || "Agendado"}`,
    }))
    return [...fromEventos, ...fromAgenda]
  }, [])

  const empleadoOptions = useMemo<SelectOption[]>(
    () =>
      AVAILABLE_EMPLOYEES.map((emp) => ({
        label: emp.nombre,
        value: emp.nombre,
        sublabel: emp.cargo,
      })),
    [],
  )

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-2xl"
      title="Crear incidente"
      subtitle="Registra un incidente operativo asociado a un evento/agendamiento específico y un colaborador responsable"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Evento / Agendamiento asociado (FK id_evento) <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              options={eventoOptions}
              value={newIncForm.evento ?? ""}
              searchable={true}
              placeholder="Seleccionar evento..."
              onChange={(val) =>
                setNewIncForm((f) => ({ ...f, evento: val }))
              }
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Colaborador que reporta (FK id_empleado) <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              options={empleadoOptions}
              value={newIncForm.reporta ?? ""}
              searchable={true}
              placeholder="Seleccionar empleado..."
              onChange={(val) =>
                setNewIncForm((f) => ({ ...f, reporta: val }))
              }
            />
          </div>
        </div>

        <FormInput
          label="Título del incidente"
          required
          placeholder="Ej. Falla en gabinete de pantalla LED P3 durante prueba"
          value={newIncForm.titulo ?? ""}
          onChange={(e) =>
            setNewIncForm((f) => ({ ...f, titulo: e.target.value }))
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Tipo de incidente
            </label>
            <CustomSelect
              value={newIncForm.tipo_incidente ?? "otro"}
              onChange={(val) =>
                setNewIncForm((f) => ({
                  ...f,
                  tipo_incidente: val as TipoIncidente,
                }))
              }
              options={TIPO_INCIDENTE_OPTIONS}
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Criticidad / Gravedad
            </label>
            <CustomSelect
              value={newIncForm.criticidad ?? "Media"}
              onChange={(val) =>
                setNewIncForm((f) => ({
                  ...f,
                  criticidad: val as Criticidad,
                }))
              }
              options={CRITICIDAD_OPTIONS}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Área o equipo técnico afectado"
            placeholder="Ej. Pantalla Central / Acometida"
            required
            value={newIncForm.areaAfectada ?? ""}
            onChange={(e) =>
              setNewIncForm((f) => ({ ...f, areaAfectada: e.target.value }))
            }
          />
          <FormInput
            label="Costo adicional estimado ($)"
            type="number"
            placeholder="0"
            value={String(newIncForm.costo_adicional ?? 0)}
            onChange={(e) =>
              setNewIncForm((f) => ({
                ...f,
                costo_adicional: Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#F1F5F9]">
            Descripción detallada de la novedad
          </label>
          <textarea
            value={newIncForm.descripcion ?? ""}
            onChange={(e) =>
              setNewIncForm((f) => ({ ...f, descripcion: e.target.value }))
            }
            placeholder="Describe la novedad presentada y las acciones requeridas..."
            rows={2}
            className="px-3.5 py-2.5 bg-[#111318] border border-[#2D3748] rounded-xl text-xs text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] resize-none"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#2D3748]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#2D3748] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer"
          >
            Crear incidente
          </button>
        </div>
      </form>
    </Drawer>
  )
}
