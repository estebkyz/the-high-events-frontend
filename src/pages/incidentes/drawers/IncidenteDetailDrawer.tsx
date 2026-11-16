import React from "react"
import { Edit2 } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { CustomSelect } from "../../../components/CustomSelect"
import type { IncidenteItem, HistoryEntry, EstadoIncidente } from "../types"
import { TIPO_INCIDENTE_LABELS } from "../types"
import { ESTADO_INCIDENTE_OPTIONS } from "../data"

interface IncidenteDetailDrawerProps {
  isOpen: boolean; incident: IncidenteItem | null
  history: HistoryEntry[]
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  editForm: Partial<IncidenteItem>
  setEditForm: React.Dispatch<React.SetStateAction<Partial<IncidenteItem>>>
  onSaveEdit: () => void
  onClose: () => void
  newActionText: string
  setNewActionText: (val: string) => void
  newActionResponsable: string
  setNewActionResponsable: (val: string) => void
  newActionEstado: EstadoIncidente
  setNewActionEstado: (val: EstadoIncidente) => void
  onAddAction: () => void
}

export const IncidenteDetailDrawer: React.FC<IncidenteDetailDrawerProps> = ({
  isOpen,
  incident,
  history,
  isEditMode,
  setIsEditMode,
  editForm,
  setEditForm,
  onSaveEdit,
  onClose,
  newActionText,
  setNewActionText,
  newActionResponsable,
  setNewActionResponsable,
  newActionEstado,
  setNewActionEstado,
  onAddAction,
}) => {
  if (!incident) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Incidente ${incident.codigo}`}
      subtitle={incident.evento}
      size="detail"
    >
      <div className="space-y-4 text-xs">
        {/* Header card */}
        <div className="p-4 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-3">
          <div className="flex items-start justify-between gap-2">
            {isEditMode ? (
              <input
                className="flex-1 h-[32px] px-2.5 bg-[#242830] border border-[#2D3748] rounded-lg text-[13px] text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED]"
                value={editForm.titulo ?? incident.titulo}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, titulo: e.target.value }))
                }
              />
            ) : (
              <span className="text-[14px] font-semibold text-[#F1F5F9] leading-snug">
                {incident.titulo}
              </span>
            )}
            <div className="flex items-center gap-1.5 shrink-0">
              <StatusBadge status={incident.criticidad} />
              <button
                onClick={() => {
                  if (isEditMode) {
                    setIsEditMode(false)
                    setEditForm({})
                  } else {
                    setIsEditMode(true)
                    setEditForm({ ...incident })
                  }
                }}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  isEditMode
                    ? "text-[#A78BFA] bg-[#7C3AED]/20"
                    : "text-[#64748B] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20"
                }`}
              >
                <Edit2 size={12} />
              </button>
            </div>
          </div>

          {isEditMode ? (
            <textarea
              value={editForm.descripcion ?? incident.descripcion}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, descripcion: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 bg-[#242830] border border-[#2D3748] rounded-lg text-xs text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] resize-none"
            />
          ) : (
            <p className="text-[#94A3B8] leading-relaxed">
              {incident.descripcion}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#1A1D23] rounded-lg border border-[#2D3748]">
            <span className="text-[#64748B] block mb-1 text-[11px]">
              Tipo de Incidente
            </span>
            <span className="font-semibold text-[#A78BFA]">
              {TIPO_INCIDENTE_LABELS[incident.tipo_incidente] || incident.tipo_incidente}
            </span>
          </div>
          <div className="p-3 bg-[#1A1D23] rounded-lg border border-[#2D3748]">
            <span className="text-[#64748B] block mb-1 text-[11px]">
              Costo Adicional
            </span>
            <span className="font-semibold text-[#10B981]">
              {(incident.costo_adicional || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="p-3 bg-[#1A1D23] rounded-lg border border-[#2D3748]">
            <span className="text-[#64748B] block mb-1.5 text-[11px]">
              Área Afectada
            </span>
            {isEditMode ? (
              <input
                className="w-full h-[28px] px-2 bg-[#242830] border border-[#2D3748] rounded text-xs text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED]"
                value={editForm.areaAfectada ?? incident.areaAfectada}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, areaAfectada: e.target.value }))
                }
              />
            ) : (
              <span className="font-semibold text-[#F1F5F9]">
                {incident.areaAfectada || "N/A"}
              </span>
            )}
          </div>
          <div className="p-3 bg-[#1A1D23] rounded-lg border border-[#2D3748]">
            <span className="text-[#64748B] block mb-1.5 text-[11px]">
              Estado Actual
            </span>
            <StatusBadge status={incident.estado} />
          </div>
        </div>

        <div className="p-3 bg-[#1A1D23] rounded-lg border border-[#2D3748]">
          <span className="text-[#64748B] block mb-1.5 text-[11px]">
            Acción Correctiva
          </span>
          {isEditMode ? (
            <textarea
              value={editForm.accionCorrectiva ?? incident.accionCorrectiva}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, accionCorrectiva: e.target.value }))
              }
              rows={2}
              className="w-full px-3 py-2 bg-[#242830] border border-[#2D3748] rounded-lg text-xs text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] resize-none"
            />
          ) : (
            <p className="text-[#F1F5F9]">{incident.accionCorrectiva}</p>
          )}
        </div>

        {isEditMode && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setIsEditMode(false)
                setEditForm({})
              }}
              className="px-3 py-1.5 text-xs text-[#94A3B8] hover:text-[#F1F5F9] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={onSaveEdit}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        )}

        {/* Enhanced History Timeline */}
        <div className="pt-1">
          <h4 className="font-semibold text-[#F1F5F9] mb-3 text-[13px]">
            Historial de Acciones
          </h4>
          <div className="space-y-3.5 border-l-2 border-[#2D3748] pl-4 ml-1">
            {history.map((entry) => (
              <div key={entry.id} className="relative">
                <span
                  className={`w-2.5 h-2.5 rounded-full absolute -left-[21px] top-1 border-2 border-[#1A1D23] ${
                    entry.tipo === "initial" ? "bg-[#EF4444]" : "bg-[#3B82F6]"
                  }`}
                />
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#2D3748] text-[#A78BFA] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                    {entry.responsable.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#F1F5F9] text-[12px] leading-snug">
                      {entry.accion}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-[#64748B]">
                        {entry.responsable}
                      </span>
                      <span className="text-[10px] text-[#2D3748]">·</span>
                      <span className="text-[10px] text-[#64748B]">
                        {entry.timestamp}
                      </span>
                      {entry.tipo !== "initial" && (
                        <>
                          <span className="text-[10px] text-[#2D3748]">·</span>
                          <StatusBadge status={entry.estado} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registrar Nueva Acción */}
        <div className="p-4 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-3">
          <h4 className="font-semibold text-[#F1F5F9] text-[13px]">
            Registrar Nueva Acción
          </h4>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Acción Tomada
            </label>
            <textarea
              value={newActionText}
              onChange={(e) => setNewActionText(e.target.value)}
              placeholder="Describe la acción realizada..."
              rows={2}
              className="px-3 py-2 bg-[#242830] border border-[#2D3748] rounded-lg text-xs text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Responsable
              </label>
              <input
                type="text"
                value={newActionResponsable}
                onChange={(e) => setNewActionResponsable(e.target.value)}
                placeholder={incident.reporta}
                className="h-[36px] px-3 bg-[#242830] border border-[#2D3748] rounded-lg text-xs text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Nuevo Estado
              </label>
              <CustomSelect
                value={newActionEstado}
                onChange={(val) => setNewActionEstado(val as EstadoIncidente)}
                options={ESTADO_INCIDENTE_OPTIONS}
              />
            </div>
          </div>

          <button
            onClick={onAddAction}
            disabled={!newActionText.trim()}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Agregar Acción
          </button>
        </div>
      </div>
    </Drawer>
  )
}
