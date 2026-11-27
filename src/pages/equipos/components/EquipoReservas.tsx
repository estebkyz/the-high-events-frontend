import { CalendarClock } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { DetailEmptyNote, DetailList, DetailSection } from "@/components/detail"
import type { DisponibilidadEquipo } from "../types"

interface EquipoReservasProps {
  disponibilidad: DisponibilidadEquipo | undefined
}

/** Cuándo está ocupado el equipo y con qué evento. */
export function EquipoReservas({ disponibilidad }: EquipoReservasProps) {
  const reservas = disponibilidad?.reservas ?? []

  return (
    <DetailSection title="Reservas" icon={CalendarClock} count={reservas.length}>
      {reservas.length === 0 ? (
        <DetailEmptyNote text="Sin reservas próximas." />
      ) : (
        <DetailList>
          {reservas.map((reserva) => (
            <div
              key={`${reserva.evento_id}-${reserva.tipo}`}
              className="py-2.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink truncate">
                  {reserva.evento}
                </p>
                <p className="text-xs text-ink-muted tabular-nums">
                  {reserva.inicio} – {reserva.fin}
                </p>
              </div>
              <StatusBadge status={reserva.tipo === "salida" ? "Afuera" : "Reservado"} />
            </div>
          ))}
        </DetailList>
      )}
    </DetailSection>
  )
}
