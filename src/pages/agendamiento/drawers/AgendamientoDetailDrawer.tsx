import { useEffect, useMemo, useState } from "react"
import type { ElementType, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
  Clock,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  Edit2,
  Plus,
  CalendarPlus,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { CustomSelect } from "../../../components/CustomSelect"
import { MESES_NOMBRES, ESTADOS_AGENDAMIENTO_OPTIONS } from "../data"
import { esPorConfirmar } from "../utils"
import type { AgendaEvent, AgendaKind } from "../types"

interface AgendamientoDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedEvent: AgendaEvent | null
  selectedDay: number
  currentMonth: number
  currentYear: number
  dayEvents: AgendaEvent[]
  onChangeEstado: (id: string, nuevoEstado: string) => void
  onConfirmItem: (id: string) => void
  onCancelItem: (id: string) => void
  onOpenEdit: (event: AgendaEvent) => void
  onOpenCreate: (day: number, kind: AgendaKind) => void
  onSelectEvent: (event: AgendaEvent) => void
  /** Vuelve de la vista de detalle a la lista de la agenda del día. */
  onBack?: () => void
}

type TipoKey = "evento" | "visita_tecnica" | "reunion_cliente" | "otro"

/** Etiqueta y estilos por tipo de agendamiento (única fuente de verdad). */
const TIPO_CONFIG: Record<TipoKey, { label: string; classes: string }> = {
  reunion_cliente: {
    label: "Reunión cliente",
    classes: "bg-[#06B6D4]/15 text-[#22D3EE] border-[#06B6D4]/30",
  },
  visita_tecnica: {
    label: "Visita técnica",
    classes: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30",
  },
  otro: {
    label: "Otro",
    classes: "bg-[#64748B]/15 text-[#94A3B8] border-[#64748B]/30",
  },
  evento: {
    label: "Evento",
    classes: "bg-[#7C3AED]/15 text-[#C4B5FD] border-[#7C3AED]/30",
  },
}

function getTipoKey(ev: AgendaEvent): TipoKey {
  if (ev.kind === "cita") return "reunion_cliente"
  return ev.tipo_agendamiento in TIPO_CONFIG ? ev.tipo_agendamiento : "evento"
}

function TipoBadge({ ev }: { ev: AgendaEvent }) {
  const cfg = TIPO_CONFIG[getTipoKey(ev)]
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  )
}

function InfoField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-[#94A3B8]">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-semibold text-[#F8FAFC] break-words">
        {children}
      </dd>
    </div>
  )
}

function SecondaryButton({
  icon: Icon,
  onClick,
  children,
}: {
  icon?: ElementType
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer inline-flex items-center gap-1.5"
    >
      {Icon && <Icon size={13} aria-hidden="true" />}
      {children}
    </button>
  )
}

export function AgendamientoDetailDrawer({
  isOpen,
  onClose,
  selectedEvent,
  selectedDay,
  currentMonth,
  currentYear,
  dayEvents,
  onChangeEstado,
  onConfirmItem,
  onCancelItem,
  onOpenEdit,
  onOpenCreate,
  onSelectEvent,
  onBack,
}: AgendamientoDetailDrawerProps) {
  const navigate = useNavigate()
  const monthName = MESES_NOMBRES[currentMonth]
  const agendaDelDia = `Agenda del ${selectedDay} de ${monthName}`

  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const selectedId = selectedEvent?.id
  useEffect(() => {
    setConfirmingCancel(false)
  }, [selectedId, isOpen])

  const sortedDayEvents = useMemo(
    () => [...dayEvents].sort((a, b) => a.time.localeCompare(b.time)),
    [dayEvents],
  )

  const isCita = selectedEvent?.kind === "cita"
  const cancelLabel = isCita ? "Cancelar cita" : "Cancelar reserva"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title={
        selectedEvent
          ? selectedEvent.title
          : `${agendaDelDia}, ${currentYear}`
      }
      subtitle={
        selectedEvent
          ? `${selectedEvent.day} de ${MESES_NOMBRES[selectedEvent.month]}, ${selectedEvent.year}`
          : "Consulta las citas y eventos del día o registra uno nuevo."
      }
    >
      {selectedEvent ? (
        <div className="space-y-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A78BFA] hover:text-[#C4B5FD] transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} aria-hidden="true" />
              {agendaDelDia}
            </button>
          )}

          {/* Resumen */}
          <section className="p-4 bg-[#111318] border border-[#262D3D] rounded-xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <TipoBadge ev={selectedEvent} />
              <StatusBadge status={selectedEvent.estado} />
            </div>

            <dl className="space-y-3 pt-3 border-t border-[#262D3D]/60">
              <InfoField label="Cliente">{selectedEvent.client}</InfoField>
              <InfoField label="Horario">{selectedEvent.time} hs</InfoField>
              <InfoField label={isCita ? "Motivo de la cita" : "Actividad operativa"}>
                {selectedEvent.type}
              </InfoField>
              {isCita ? (
                <InfoField label="Modalidad / canal">
                  {selectedEvent.modalidadCita || "Videollamada (Meet / Zoom)"}
                </InfoField>
              ) : (
                <InfoField label="Locación reservada">
                  {selectedEvent.venue || "Sin locación"}
                </InfoField>
              )}
              {isCita && selectedEvent.notas && (
                <InfoField label="Notas de la cita">
                  <span className="font-normal text-[#CBD5E1] leading-relaxed">
                    {selectedEvent.notas}
                  </span>
                </InfoField>
              )}
            </dl>

            <div className="pt-3 border-t border-[#262D3D]/60 space-y-1.5">
              <label className="text-[11px] text-[#94A3B8]">
                Actualizar estado
              </label>
              <CustomSelect
                options={ESTADOS_AGENDAMIENTO_OPTIONS}
                value={selectedEvent.estado}
                onChange={(est) => onChangeEstado(selectedEvent.id, est)}
                placeholder="Seleccionar estado..."
              />
            </div>
          </section>

          {/* Proyección de evento futuro (solo citas) */}
          {isCita && (
            <section className="p-4 bg-[#7C3AED]/5 border border-[#7C3AED]/25 rounded-xl space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC]">
                  <CalendarPlus
                    size={15}
                    className="text-[#A78BFA]"
                    aria-hidden="true"
                  />
                  Proyección de evento futuro
                </h4>
                {!selectedEvent.fechaTentativaEvento && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1E2330] text-[#94A3B8] shrink-0">
                    Sin fecha tentativa
                  </span>
                )}
              </div>

              {selectedEvent.fechaTentativaEvento ? (
                <dl className="space-y-2.5 bg-[#111318]/60 p-3 rounded-lg border border-[#7C3AED]/15">
                  <InfoField label="Fecha tentativa">
                    <span className="text-[#A78BFA]">
                      {selectedEvent.fechaTentativaEvento}
                    </span>
                  </InfoField>
                  <InfoField label="Tipo de evento proyectado">
                    {selectedEvent.tipoEventoTentativo || "Por definir"}
                  </InfoField>
                  {selectedEvent.lugarTentativo && (
                    <InfoField label="Locación tentativa">
                      {selectedEvent.lugarTentativo}
                    </InfoField>
                  )}
                </dl>
              ) : (
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Aún no se registró una fecha tentativa para el evento. Edita
                  la cita para asignarla.
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate("/cotizaciones", {
                    state: {
                      fromAgenda: true,
                      clientName: selectedEvent.client,
                      fechaTentativa: selectedEvent.fechaTentativaEvento,
                      tipoEvento: selectedEvent.tipoEventoTentativo,
                      lugar: selectedEvent.lugarTentativo,
                      notas: selectedEvent.notas,
                    },
                  })
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-[#C4B5FD] border border-[#7C3AED]/40 hover:bg-[#7C3AED]/15 transition-colors cursor-pointer"
              >
                <Sparkles size={14} aria-hidden="true" />
                Generar cotización desde esta cita
              </button>
            </section>
          )}

          {/* Confirmación rápida (solo pendientes) */}
          {esPorConfirmar(selectedEvent) && (
            <section className="space-y-2">
              {confirmingCancel ? (
                <div
                  role="alertdialog"
                  aria-label={cancelLabel}
                  className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 space-y-3"
                >
                  <p className="flex items-start gap-2 text-xs text-[#F8FAFC]">
                    <AlertTriangle
                      size={14}
                      className="text-[#EF4444] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    ¿Seguro que deseas {cancelLabel.toLowerCase()}? Pasará a
                    estado Cancelado.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingCancel(false)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
                    >
                      No, volver
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onCancelItem(selectedEvent.id)
                        setConfirmingCancel(false)
                      }}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors cursor-pointer"
                    >
                      Sí, cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onConfirmItem(selectedEvent.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/25 transition-colors cursor-pointer"
                  >
                    <CheckCircle size={14} aria-hidden="true" />
                    {isCita ? "Confirmar cita" : "Confirmar reserva"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingCancel(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/25 transition-colors cursor-pointer"
                  >
                    <XCircle size={14} aria-hidden="true" />
                    {cancelLabel}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Acción principal fija al pie del panel */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3 bg-[#181B22] border-t border-[#2D3748]">
            <button
              type="button"
              onClick={() => onOpenEdit(selectedEvent)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
            >
              <Edit2 size={14} aria-hidden="true" />
              {isCita ? "Editar cita" : "Editar agendamiento"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedDayEvents.length === 0 ? (
            <div className="bg-[#111318] border border-[#262D3D] border-dashed rounded-2xl p-8 flex flex-col items-center text-center gap-4">
              <CalendarPlus
                size={24}
                className="text-[#94A3B8]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-[#F8FAFC]">
                  Día disponible sin registros
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  ¿Qué deseas agendar para el {selectedDay} de {monthName}?
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <SecondaryButton onClick={() => onOpenCreate(selectedDay, "cita")}>
                  Agendar cita
                </SecondaryButton>
                <button
                  type="button"
                  onClick={() => onOpenCreate(selectedDay, "evento")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors cursor-pointer"
                >
                  Agendar evento
                </button>
              </div>
            </div>
          ) : (
            <>
              <ul className="space-y-2">
                {sortedDayEvents.map((ev) => (
                  <li key={ev.id}>
                    <button
                      type="button"
                      onClick={() => onSelectEvent(ev)}
                      className="w-full text-left p-3.5 bg-[#111318] border border-[#262D3D] rounded-xl hover:border-[#7C3AED]/60 focus-visible:outline-2 focus-visible:outline-[#7C3AED] transition-colors cursor-pointer flex items-center gap-3"
                    >
                      <span className="shrink-0 w-12 text-center">
                        <span className="block text-[13px] font-bold text-[#F8FAFC] tabular-nums">
                          {ev.time}
                        </span>
                        <span className="block text-[10px] text-[#94A3B8]">
                          hs
                        </span>
                      </span>
                      <span className="min-w-0 flex-1 space-y-1">
                        <span className="flex items-center gap-2 min-w-0">
                          <TipoBadge ev={ev} />
                          <span className="text-xs font-bold text-[#F8FAFC] truncate">
                            {ev.title}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] truncate">
                          {ev.kind === "cita" ? (
                            <Video
                              size={12}
                              className="text-[#22D3EE] shrink-0"
                              aria-hidden="true"
                            />
                          ) : ev.venue ? (
                            <MapPin
                              size={12}
                              className="text-[#A78BFA] shrink-0"
                              aria-hidden="true"
                            />
                          ) : (
                            <Clock
                              size={12}
                              className="text-[#64748B] shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <span className="truncate">
                            {ev.client} ·{" "}
                            {ev.kind === "cita"
                              ? ev.modalidadCita || "Videollamada"
                              : ev.venue || "Sin locación"}
                          </span>
                        </span>
                        <StatusBadge status={ev.estado} />
                      </span>
                      <ChevronRight
                        size={15}
                        className="text-[#94A3B8] shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="pt-2 flex items-center justify-end gap-2">
                <SecondaryButton
                  icon={Plus}
                  onClick={() => onOpenCreate(selectedDay, "cita")}
                >
                  Nueva cita
                </SecondaryButton>
                <button
                  type="button"
                  onClick={() => onOpenCreate(selectedDay, "evento")}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus size={13} aria-hidden="true" />
                  Nuevo evento
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Drawer>
  )
}
