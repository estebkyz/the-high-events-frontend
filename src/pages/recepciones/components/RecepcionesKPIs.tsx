import React from "react"
import { ClipboardList, Clock, CheckCircle2, Lock } from "lucide-react"
import { KPICard } from "../../../components/KPICard"
import type { RecepcionesKPIsData } from "../types"

interface RecepcionesKPIsProps {
  kpis: RecepcionesKPIsData
}

export function RecepcionesKPIs({ kpis }: RecepcionesKPIsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPICard
        title="Total Recepciones"
        value={kpis.total}
        subtitle="Total del período"
        icon={ClipboardList}
        iconColor="text-[#64748B]"
      />
      <KPICard
        title="Pendientes Firma"
        value={kpis.pendientes}
        subtitle="En el período"
        icon={Clock}
        iconColor="text-[#F59E0B]"
      />
      <KPICard
        title="Conformes"
        value={kpis.conformes}
        subtitle="En el período"
        icon={CheckCircle2}
        iconColor="text-[#10B981]"
      />
      <KPICard
        title="Cerradas"
        value={kpis.cerradas}
        subtitle="En el período"
        icon={Lock}
        iconColor="text-[#A78BFA]"
      />
    </div>
  )
}
