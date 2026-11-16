import React, { useId } from "react"
import { Video, Sparkles, CalendarPlus } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import {
  CustomSelect,
  type SelectOption,
} from "../../../components/CustomSelect"
import {
  TIPOS_CITA_OPTIONS,
  MODALIDADES_CITA_OPTIONS,
  ESTADOS_CITA_OPTIONS,
  TIPOS_EVENTO_OPTIONS,
  ESTADOS_EVENTO_OPTIONS,
} from "../data"
import type { AgendaFormData, AgendaKind } from "../types"

interface AgendamientoFormDrawerProps {
  isOpen: boolean; onClose: () => void
  isEditing: boolean
  formData: AgendaFormData
  setFormData: React.Dispatch<React.SetStateAction<AgendaFormData>>
  clientOptions: SelectOption[]
  venueOptions: SelectOption[]
  onAddClient: (clientName: string) => void
  onAddVenue: (venueName: string) => void
  onSwitchKind: (kind: AgendaKind) => void
  onSubmit: (e: React.FormEvent) => void
}

const LABEL_CLASS = "text-[13px] font-medium text-[#F8FAFC] block mb-1.5"
const INPUT_BASE =
  "w-full h-[42px] bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] " +
  "placeholder-[#64748B] hover:border-[#333C50] transition-colors " +
  "focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40"

export function AgendamientoFormDrawer({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  clientOptions,
  venueOptions,
  onAddClient,
  onAddVenue,
  onSwitchKind,
  onSubmit,
}: AgendamientoFormDrawerProps) {
  const uid = useId()
  const isCita = formData.kind === "cita"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title={isEditing ? "Editar agendamiento" : "Crear agendamiento"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Segmented Control: Cita vs Evento */}
        <div>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#111318] border border-[#262D3D] rounded-xl">
            <button
              type="button"
              onClick={() => onSwitchKind("cita")}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isCita
                  ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <span>Cita</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchKind("evento")}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !isCita
                  ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <span>Evento</span>
            </button>
          </div>
        </div>

        {/* Motivo de cita o Actividad de evento */}
        <div>
          <label className={LABEL_CLASS}>
            {isCita ? "Motivo de la cita" : "Actividad del evento"}
          </label>
          <CustomSelect
            options={isCita ? TIPOS_CITA_OPTIONS : TIPOS_EVENTO_OPTIONS}
            value={formData.type}
            onChange={(val) => setFormData((f) => ({ ...f, type: val }))}
            placeholder="Seleccionar..."
          />
        </div>

        {/* Título / Asunto */}
        <div>
          <label htmlFor={`${uid}-titulo`} className={LABEL_CLASS}>
            {isCita ? "Asunto de la cita" : "Nombre del evento"}{" "}
            <span className="text-[#7C3AED]">*</span>
          </label>
          <input
            id={`${uid}-titulo`}
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData((f) => ({ ...f, title: e.target.value }))
            }
            className={`${INPUT_BASE} px-3.5`}
          />
        </div>

        {/* Cliente */}
        <div>
          <label className={LABEL_CLASS}>
            {isCita ? "Cliente" : "Cliente"}{" "}
            <span className="text-[#7C3AED]">*</span>
          </label>
          <CustomSelect
            options={clientOptions}
            value={formData.client}
            onChange={(val) => setFormData((f) => ({ ...f, client: val }))}
            searchable={true}
            allowCreate={true}
            createLabel="Crear nuevo cliente"
            onCreate={onAddClient}
            placeholder="Seleccionar cliente"
          />
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${uid}-fecha`} className={LABEL_CLASS}>
              Fecha <span className="text-[#7C3AED]">*</span>
            </label>
            <input
              id={`${uid}-fecha`}
              type="date"
              required
              value={formData.dateISO}
              onChange={(e) =>
                setFormData((f) => ({ ...f, dateISO: e.target.value }))
              }
              className={`${INPUT_BASE} px-3.5 [color-scheme:dark]`}
            />
          </div>

          <div>
            <label htmlFor={`${uid}-hora`} className={LABEL_CLASS}>
              Hora <span className="text-[#7C3AED]">*</span>
            </label>
            <input
              id={`${uid}-hora`}
              type="time"
              required
              value={formData.time}
              onChange={(e) =>
                setFormData((f) => ({ ...f, time: e.target.value }))
              }
              className={`${INPUT_BASE} px-3.5 [color-scheme:dark]`}
            />
          </div>
        </div>

        {/* Campos condicionales según Cita vs Evento */}
        {isCita ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Modalidad</label>
                <CustomSelect
                  options={MODALIDADES_CITA_OPTIONS}
                  value={formData.modalidadCita}
                  onChange={(val) =>
                    setFormData((f) => ({ ...f, modalidadCita: val }))
                  }
                  placeholder="Seleccionar canal..."
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Estado de la cita</label>
                <CustomSelect
                  options={ESTADOS_CITA_OPTIONS}
                  value={formData.estado}
                  onChange={(val) =>
                    setFormData((f) => ({ ...f, estado: val }))
                  }
                  placeholder="Seleccionar estado..."
                />
              </div>
            </div>

            <div>
              <label htmlFor={`${uid}-notas`} className={LABEL_CLASS}>
                Notas {" "}
                <span className="text-[#64748B] font-normal">(Opcional)</span>
              </label>
              <textarea
                id={`${uid}-notas`}
                rows={2}
                placeholder="Ej. Enlace de Google Meet o puntos clave a revisar con el cliente..."
                value={formData.notas}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, notas: e.target.value }))
                }
                className="w-full p-3 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] hover:border-[#333C50] focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 transition-colors resize-none"
              />
            </div>

            {/* Fecha y Datos Tentativos del Evento (Para Cotización) */}
            <div className="p-3.5 bg-[#7C3AED]/5  rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarPlus size={15} className="text-[#A78BFA]" />
                  <span className="text-xs font-semibold text-[#F8FAFC]">
                    Datos tentativos del evento
                  </span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#7C3AED]/20 text-[#DDD6FE]">
                  Opcional
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Si en la cita se define o negocia una fecha tentativa para el evento, regístrala aquí para facilitar la posterior cotización y alertar sobre disponibilidad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${uid}-fecha-tentativa`} className="text-[11px] font-medium text-[#CBD5E1] block mb-1">
                    Fecha tentativa del evento
                  </label>
                  <input
                    id={`${uid}-fecha-tentativa`}
                    type="date"
                    value={formData.fechaTentativaEvento || ""}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        fechaTentativaEvento: e.target.value,
                      }))
                    }
                    className={`${INPUT_BASE} px-3 [color-scheme:dark]`}
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-tipo-tentativo`} className="text-[11px] font-medium text-[#CBD5E1] block mb-1">
                    Tipo de evento proyectado
                  </label>
                  <input
                    id={`${uid}-tipo-tentativo`}
                    type="text"
                    placeholder="Ej. Boda, Concierto, Corporativo..."
                    value={formData.tipoEventoTentativo || ""}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        tipoEventoTentativo: e.target.value,
                      }))
                    }
                    className={`${INPUT_BASE} px-3`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-lugar-tentativo`} className="text-[11px] font-medium text-[#CBD5E1] block mb-1">
                    Dirección del venue tentativo
                  </label>
                  <input
                    id={`${uid}-lugar-tentativo`}
                    type="text"
                    placeholder="Ej. Salón Principal 360 / Hacienda Los Sauces / Por definir"
                    value={formData.lugarTentativo || ""}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        lugarTentativo: e.target.value,
                      }))
                    }
                    className={`${INPUT_BASE} px-3`}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Locación / Salón</label>
              <CustomSelect
                options={venueOptions}
                value={formData.venue}
                onChange={(val) => setFormData((f) => ({ ...f, venue: val }))}
                searchable={true}
                allowCreate={true}
                createLabel="Usar otra locación"
                onCreate={onAddVenue}
                placeholder="Seleccionar locación..."
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Estado / Fase del evento</label>
              <CustomSelect
                options={ESTADOS_EVENTO_OPTIONS}
                value={formData.estado}
                onChange={(val) => setFormData((f) => ({ ...f, estado: val }))}
                placeholder="Seleccionar estado..."
              />
            </div>
          </div>
        )}

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/25 cursor-pointer"
          >
            {isEditing
              ? "Guardar cambios"
              : isCita
                ? "Agendar cita"
                : "Agendar evento"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
