import { useState, type ElementType, type ReactNode } from "react"
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

interface InfoFieldProps {
  icon: ElementType
  label: string
  children: ReactNode
  valueClassName?: string
}

/** Par etiqueta/valor con icono, semántico (`dt`/`dd`). */
function InfoField({
  icon: Icon,
  label,
  children,
  valueClassName = "text-[#F1F5F9]",
}: InfoFieldProps) {
  return (
    <div className="min-w-0">
      <dt className="text-[#94A3B8] text-[11px] flex items-center gap-1.5">
        <Icon size={12} aria-hidden="true" /> {label}
      </dt>
      <dd className={`font-medium text-[13px] mt-1 break-words ${valueClassName}`}>
        {children}
      </dd>
    </div>
  )
}

interface SectionProps {
  icon: ElementType
  title: string
  count?: string
  children: ReactNode
}

/** Sección del detalle con encabezado (icono, título, contador). */
function Section({ icon: Icon, title, count, children }: SectionProps) {
  return (
    <section className="pt-4 border-t border-[#2D3748]/60 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-xs font-semibold text-[#F1F5F9]">
          <Icon size={14} className="text-[#7C3AED]" aria-hidden="true" />
          {title}
        </h4>
        {count && <span className="text-[11px] text-[#94A3B8]">{count}</span>}
      </div>
      {children}
    </section>
  )
}

function EmptyNote({
  children,
  icon: Icon,
}: {
  children: ReactNode
  icon?: ElementType
}) {
  return (
    <p className="flex items-center gap-2 text-xs text-[#94A3B8] italic rounded-lg border border-dashed border-[#2D3748] px-3 py-2.5">
      {Icon && <Icon size={14} className="shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </p>
  )
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
    >
      {event && (
        <div className="space-y-4 text-xs">
          {/* Encabezado */}
          <header className="space-y-2 pb-3 border-b border-[#2D3748]">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={event.modalidad} />
              <StatusBadge status={event.estado} />
            </div>
            <h3 className="text-[15px] font-bold text-[#F1F5F9] leading-snug">
              {event.nombre}
            </h3>
            <p className="text-xs text-[#94A3B8]">
              {event.cliente_nombre}
              {event.cotizacion_codigo && (
                <>
                  {" · "}
                  <span className="font-mono text-[#A78BFA] font-semibold">
                    {event.cotizacion_codigo}
                  </span>
                </>
              )}
            </p>
          </header>

          {/* Resumen: cuándo, dónde y cuánto */}
          <dl className="rounded-xl bg-[#111318] p-3.5 space-y-3">
            <InfoField icon={Calendar} label="Inicio – Fin">
              <span className="block">{formatFechaHora(event.hora_inicio)}</span>
              <span className="block text-[11px] font-normal text-[#94A3B8]">
                hasta {formatFechaHora(event.hora_fin)}
              </span>
            </InfoField>
            <InfoField icon={MapPin} label="Ubicación">
              {event.direccion}
            </InfoField>
            <InfoField
              icon={DollarSign}
              label="Presupuesto estimado"
              valueClassName="text-[#10B981] font-semibold"
            >
              {formatCOP(event.presupuesto_estimado)}
            </InfoField>
          </dl>

          {/* Detalles */}
          <dl className="grid grid-cols-2 gap-4">
            <InfoField icon={Users} label="Aforo esperado">
              {event.aforo_esperado || "No especificado"}
            </InfoField>
            <InfoField icon={Sparkles} label="Concepto">
              {event.concepto_espectaculo || "Estándar"}
            </InfoField>
            <div className="col-span-2">
              <InfoField icon={FileText} label="Observaciones">
                {event.observaciones || "Ninguna"}
              </InfoField>
            </div>
          </dl>

          {/* Pestañas (Tabs) para Servicios, Equipos y Empleados */}
          <div className="pt-3 border-t border-[#2D3748] space-y-3">
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#111318] border border-[#2D3748] rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("servicios")}
                className={`py-2 px-2 rounded-lg text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "servicios"
                    ? "bg-[#7C3AED] text-white"
                    : "text-[#94A3B8] hover:text-[#F1F5F9]"
                }`}
              >
                <Layers size={13} />
                <span>Servicios ({event.servicios.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("equipos")}
                className={`py-2 px-2 rounded-lg text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "equipos"
                    ? "bg-[#7C3AED] text-white"
                    : "text-[#94A3B8] hover:text-[#F1F5F9]"
                }`}
              >
                <Boxes size={13} />
                <span>Equipos ({equipos.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("empleados")}
                className={`py-2 px-2 rounded-lg text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "empleados"
                    ? "bg-[#7C3AED] text-white"
                    : "text-[#94A3B8] hover:text-[#F1F5F9]"
                }`}
              >
                <UserCheck size={13} />
                <span>Personal ({empleados.length})</span>
              </button>
            </div>

            {activeTab === "servicios" && (
              <Section
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
                  <EmptyNote icon={FileWarning}>
                    Aún no hay una cotización asignada a este evento.
                  </EmptyNote>
                ) : event.servicios.length === 0 ? (
                  <EmptyNote>No hay servicios registrados.</EmptyNote>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {event.servicios.map((s) => (
                      <li
                        key={s}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#7C3AED]/15 text-[#A78BFA]"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            )}

            {activeTab === "equipos" && (
              <Section
                icon={Boxes}
                title="Equipos asignados"
                count={equipos.length > 0 ? `${equipos.length} equipo(s)` : undefined}
              >
                {equipos.length === 0 ? (
                  <EmptyNote>No hay equipos asignados a este evento.</EmptyNote>
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
                        </li>
                      )
                    })}
                  </ul>
                )}
              </Section>
            )}

            {activeTab === "empleados" && (
              <Section
                icon={UserCheck}
                title="Personal asignado al evento"
                count={
                  empleados.length > 0 ? `${empleados.length} asignado(s)` : undefined
                }
              >
                {empleados.length === 0 ? (
                  <EmptyNote>
                    No hay personal operativo asignado aún.
                  </EmptyNote>
                ) : (
                  <ul className="divide-y divide-[#2D3748]/50">
                    {empleados.map((emp) => (
                      <li key={emp.empleado_id} className="py-2.5 flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-[#F1F5F9] text-xs">
                            {emp.nombre}
                          </p>
                          <p className="text-[11px] text-[#94A3B8]">
                            Rol / Fase: {emp.fase}
                          </p>
                        </div>
                        <StatusBadge status={emp.fase} />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            )}
          </div>

          {/* Acción principal fija al pie del panel */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3 flex justify-end bg-[#181B22] border-t border-[#2D3748]">
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all cursor-pointer"
            >
              Editar evento
            </button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
