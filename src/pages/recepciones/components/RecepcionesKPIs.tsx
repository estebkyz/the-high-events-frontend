import { CheckCircle2, ClipboardList, Clock, Lock } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import { KPIStrip } from "@/components/KPIStrip"
import type { EstadoRecepcion, Recepcion } from "../types"

export function RecepcionesKPIs({
  recepciones,
  loading,
}: {
  recepciones: Recepcion[]
  loading: boolean
}) {
  const count = (estado: EstadoRecepcion) =>
    recepciones.filter((r) => r.estado === estado).length

  return (
    <KPIStrip loading={loading}>
      <KPICard
        title="Total recepciones"
        value={recepciones.length}
        subtitle="Total registrado"
        loading={loading}
        icon={ClipboardList}
      />
      <KPICard
        title="Pendientes"
        value={count("Pendiente")}
        subtitle="Por verificar"
        loading={loading}
        icon={Clock}
      />
      <KPICard
        title="Conformes"
        value={count("Conforme")}
        subtitle="Verificadas"
        loading={loading}
        icon={CheckCircle2}
      />
      <KPICard
        title="Cerradas"
        value={count("Cerrada")}
        subtitle="Proceso terminado"
        loading={loading}
        icon={Lock}
      />
    </KPIStrip>
  )
}
