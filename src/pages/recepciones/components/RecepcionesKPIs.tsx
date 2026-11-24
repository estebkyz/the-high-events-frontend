import { CheckCircle2, ClipboardList, Clock, Lock } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import type { EstadoRecepcion, Recepcion } from "../types"

export function RecepcionesKPIs({ recepciones }: { recepciones: Recepcion[] }) {
  const count = (estado: EstadoRecepcion) =>
    recepciones.filter((r) => r.estado === estado).length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total recepciones"
        value={recepciones.length}
        subtitle="Total registrado"
        icon={ClipboardList}
      />
      <KPICard
        title="Pendientes"
        value={count("Pendiente")}
        subtitle="Por verificar"
        icon={Clock}
      />
      <KPICard
        title="Conformes"
        value={count("Conforme")}
        subtitle="Verificadas"
        icon={CheckCircle2}
      />
      <KPICard
        title="Cerradas"
        value={count("Cerrada")}
        subtitle="Proceso terminado"
        icon={Lock}
      />
    </div>
  )
}
