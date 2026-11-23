import { useState } from "react"
import {
  MapPin,
  Calendar,
  Layers,
  Users,
  UserCheck,
  DollarSign,
  Sparkles,
  FileText,
  Boxes,
  FileWarning,
} from "lucide-react"
import { StatusBadge } from "../../../components/StatusBadge"
import { Drawer } from "../../../components/Drawer"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
  DetailHighlight,
  DetailList,
  DetailEmptyNote,
} from "../../../components/detail"
import { AVAILABLE_EQUIPMENT } from "../data"
import type { EventoItem } from "../types"
import { formatCOP } from "../utils"

interface EventoDetailDrawerProps {
  event: EventoItem | null
  onClose: () => void
  onEdit: (event: EventoItem) => void
}

/** Formatea una fecha ISO local (YYYY-MM-DDTHH:mm) a "5 nov 2026 · 6:00 p. m.". */
function formatFechaHora(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.replace("T", " ")
  const fecha = date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const hora = date.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
  })
  return `${fecha} · ${hora}`
}

/** Panel lateral con el detalle de solo lectura de un evento. */
export function EventoDetailDrawer({
  event,
  onClose,
  onEdit,
}: EventoDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"servicios" | "equipos" | "empleados">("servicios")
  const equipos = event?.equiposAsignados ?? []
  const empleados = event?.empleadosAsignados ?? []
  const sinCotizacion =
    !!event && event.modalidad === "Cliente" && !event.cotizacion_codigo

  return (
    <Drawer
      isOpen={!!event}
      onClose={onClose}
      size="detail"
      title="Detalle de evento"
      footer={
        event ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all cursor-pointer"
            >
              Editar evento
            </button>
          </div>
        ) : undefined
      }
    >
      {event && (
        <div className="space-y-4 text-xs">
          <DetailHeader
            badges={
              <>
                <StatusBadge status={event.modalidad} />
                <StatusBadge status={event.estado} />
              </>
            }
            title={event.nombre}
            subtitle={
              <>
                {event.cliente_nombre}
                {event.cotizacion_codigo && (
                  <>
                    {" · "}
                    <span className="font-mono text-[#A78BFA] font-semibold">
                      {event.cotizacion_codigo}
                    </span>
                  </>
                )}
              </>
            }
          />

          <DetailHighlight
            icon={DollarSign}
            label="Presupuesto estimado"
            value={formatCOP(event.presupuesto_estimado)}
            tone="success"
          />

          <DetailGrid>
            <DetailField icon={Calendar} label="Inicio – Fin" span={2}>
              <span className="block">{formatFechaHora(event.hora_inicio)}</span>
              <span className="block text-[11px] font-normal text-[#94A3B8]">
                hasta {formatFechaHora(event.hora_fin)}
              </span>
            </DetailField>
            <DetailField icon={MapPin} label="Ubicación" span={2} value={event.direccion} />
            <DetailField
              icon={Users}
              label="Aforo esperado"
              value={event.aforo_esperado || "No especificado"}
            />
            <DetailField
              icon={Sparkles}
              label="Concepto"
              value={event.concepto_espectaculo || "Estándar"}
            />
            <DetailField
              icon={FileText}
              label="Observaciones"
              span={2}
              value={event.observaciones || "Ninguna"}
            />
          </DetailGrid>

          {/* Pestañas (Tabs) para Servicios, Equipos y Empleados */}
          <div className="pt-3 border-t border-[#2D3748] space-y-3">
            <div
              role="tablist"
              aria-label="Recursos del evento"
              className="grid grid-cols-3 gap-1 p-1 bg-[#111318] border border-[#2D3748] rounded-xl"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "servicios"}
                onClick={() => setActiveTab("servicios")}
                className={`py-2 px-2 rounded-lg text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "servicios"
                    ? "bg-[#7C3AED] text-white"
                    : "text-[#94A3B8] hover:text-[#F1F5F9]"
                }`}
              >
                <Layers size={13} aria-hidden="true" />
                <span>Servicios ({event.servicios.length})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "equipos"}
                onClick={() => setActiveTab("equipos")}
                className={`py-2 px-2 rounded-lg text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "equipos"
                    ? "bg-[#7C3AED] text-white"
                    : "text-[#94A3B8] hover:text-[#F1F5F9]"
                }`}
              >
                <Boxes size={13} aria-hidden="true" />
                <span>Equipos ({equipos.length})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "empleados"}
                onClick={() => setActiveTab("empleados")}
                className={`py-2 px-2 rounded-lg text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "empleados"
                    ? "bg-[#7C3AED] text-white"
                    : "text-[#94A3B8] hover:text-[#F1F5F9]"
                }`}
              >
                <UserCheck size={13} aria-hidden="true" />
                <span>Personal ({empleados.length})</span>
              </button>
            </div>

            {activeTab === "servicios" && (
              <DetailSection
                noBorder
                icon={Layers}
                title={
                  event.modalidad === "Cliente"
                    ? "Servicios contratados"
                    : "Servicios requeridos"
                }
                count={
                  event.servicios.length > 0
                    ? `${event.servicios.length} servicio(s)`
                    : undefined
                }
              >
                {sinCotizacion ? (
                  <DetailEmptyNote>
                    <span className="inline-flex items-center gap-2">
                      <FileWarning size={14} className="shrink-0" aria-hidden="true" />
                      Aún no hay una cotización asignada a este evento.
                    </span>
                  </DetailEmptyNote>
                ) : event.servicios.length === 0 ? (
                  <DetailEmptyNote text="No hay servicios registrados." />
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {event.servicios.map((s) => {
                      const det = event.serviciosDetalles?.find((d) => d.nombre === s)
                      return (
                        <li
                          key={s}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#7C3AED]/15 text-[#A78BFA] inline-flex items-center gap-1.5"
                        >
                          <span>{s}</span>
                          {det?.proveedor_nombre && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111318] text-[#CBD5E1]">
                              {det.proveedor_nombre}
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </DetailSection>
            )}

            {activeTab === "equipos" && (
              <DetailSection
                noBorder
                icon={Boxes}
                title="Equipos asignados"
                count={equipos.length > 0 ? `${equipos.length} equipo(s)` : undefined}
              >
                {equipos.length === 0 ? (
                  <DetailEmptyNote text="No hay equipos asignados a este evento." />
                ) : (
                  <ul className="flex flex-wrap gap-1.5">
                    {equipos.map((eqId) => {
                      const eq = AVAILABLE_EQUIPMENT.find((e) => e.id === eqId)
                      return (
                        <li
                          key={eqId}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#111318] text-[#CBD5E1]"
                        >
                          <span className="font-mono text-[10px] text-[#A78BFA]">
                            {eq?.codigo || `EQ-${eqId}`}
                          </span>
                          <span>{eq?.nombre || `Equipo #${eqId}`}</span>
                          {eq?.propiedad === "Alquilado" && eq?.proveedor_nombre && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F59E0B]/15 text-[#FBBF24]">
                              {eq.proveedor_nombre}
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </DetailSection>
            )}

            {activeTab === "empleados" && (
              <DetailSection
                noBorder
                icon={UserCheck}
                title="Personal asignado al evento"
                count={
                  empleados.length > 0 ? `${empleados.length} asignado(s)` : undefined
                }
              >
                {empleados.length === 0 ? (
                  <DetailEmptyNote text="No hay personal operativo asignado aún." />
                ) : (
                  <DetailList>
                    {empleados.map((emp) => (
                      <div
                        key={emp.empleado_id}
                        className="py-2.5 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-[#F1F5F9] text-xs">
                            {emp.nombre}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            {emp.nombre_tarea
                              ? `Tarea: ${emp.nombre_tarea}`
                              : `Fase: ${emp.fase}`}
                          </p>
                        </div>
                        <StatusBadge status={emp.fase} />
                      </div>
                    ))}
                  </DetailList>
                )}
              </DetailSection>
            )}
          </div>
        </div>
      )}
    </Drawer>
  )
}
