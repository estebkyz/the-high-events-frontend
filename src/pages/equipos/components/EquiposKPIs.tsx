import { AlertOctagon, Boxes, CheckCircle2, Wrench } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import { KPIStrip } from "@/components/KPIStrip"
import type { EquipoItem, EstadoOperativo } from "../types"

export function EquiposKPIs({
  equipos,
  loading,
}: {
  equipos: EquipoItem[]
  loading: boolean
}) {
  const count = (...estados: EstadoOperativo[]) =>
    equipos.filter((e) => estados.includes(e.estadoOperativo)).length

  return (
    <KPIStrip loading={loading}>
      <KPICard
        title="Total equipos"
        value={equipos.length}
        subtitle="Total registrado"
        loading={loading}
        icon={Boxes}
      />
      <KPICard
        title="Disponibles"
        value={count("Disponible")}
        subtitle="Listos para uso"
        loading={loading}
        icon={CheckCircle2}
      />
      <KPICard
        title="En uso"
        value={count("Prestado", "En Evento")}
        subtitle="Prestados o en evento"
        loading={loading}
        icon={AlertOctagon}
      />
      <KPICard
        title="Fuera de servicio"
        value={count("En Mantenimiento", "De Baja")}
        subtitle="Mantenimiento o de baja"
        loading={loading}
        icon={Wrench}
      />
    </KPIStrip>
  )
}
