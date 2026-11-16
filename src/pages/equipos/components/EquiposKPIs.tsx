import React from "react"
import { KPICard } from "../../../components/KPICard"
import { Boxes, CheckCircle2, AlertOctagon, Wrench } from "lucide-react"

interface EquiposKPIsProps {
  total: number; disponible: number
  prestamo: number
  mantenimiento: number
}

export function EquiposKPIs({
  total,
  disponible,
  prestamo,
  mantenimiento,
}: EquiposKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <KPICard
        title="Total Equipos"
        value={total}
        subtitle="Total del período"
        icon={Boxes}
        iconColor="text-[#64748B]"
      />
      <KPICard
        title="Disponibles"
        value={disponible}
        subtitle="En el período"
        icon={CheckCircle2}
        iconColor="text-[#10B981]"
      />
      <KPICard
        title="En Préstamo"
        value={prestamo}
        subtitle="En el período"
        icon={AlertOctagon}
        iconColor="text-[#F59E0B]"
      />
      <KPICard
        title="En Mantenimiento"
        value={mantenimiento}
        subtitle="En el período"
        icon={Wrench}
        iconColor="text-[#EF4444]"
      />
    </div>
  )
}
