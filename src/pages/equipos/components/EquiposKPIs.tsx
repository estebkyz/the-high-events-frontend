import { AlertOctagon, Boxes, CheckCircle2, Wrench } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import type { EquipoItem, EstadoOperativo } from "../types"

export function EquiposKPIs({ equipos }: { equipos: EquipoItem[] }) {
  const count = (...estados: EstadoOperativo[]) =>
    equipos.filter((e) => estados.includes(e.estadoOperativo)).length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total equipos"
        value={equipos.length}
        subtitle="Total registrado"
        icon={Boxes}
      />
      <KPICard
        title="Disponibles"
        value={count("Disponible")}
        subtitle="Listos para uso"
        icon={CheckCircle2}
      />
      <KPICard
        title="En uso"
        value={count("Prestado", "En Evento")}
        subtitle="Prestados o en evento"
        icon={AlertOctagon}
      />
      <KPICard
        title="Fuera de servicio"
        value={count("En Mantenimiento", "De Baja")}
        subtitle="Mantenimiento o de baja"
        icon={Wrench}
      />
    </div>
  )
}
