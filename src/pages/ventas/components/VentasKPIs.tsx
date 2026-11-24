import { CheckCircle2, Clock, DollarSign, TrendingUp } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import { formatCOP } from "@/utils/format"
import type { VentaItem } from "../types"
import { resumirVentas } from "../utils"

export function VentasKPIs({ ventas }: { ventas: VentaItem[] }) {
  const resumen = resumirVentas(ventas)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total en ventas"
        value={formatCOP(resumen.total)}
        subtitle="Ventas confirmadas"
        icon={DollarSign}
      />
      <KPICard
        title="Ventas pagadas"
        value={`${resumen.pagadas}/${resumen.confirmadas}`}
        subtitle="Pagadas / Total"
        icon={CheckCircle2}
      />
      <KPICard
        title="Por cobrar"
        value={`${resumen.porCobrar}/${resumen.confirmadas}`}
        subtitle="Con saldo / Total"
        icon={Clock}
      />
      <KPICard
        title="Ventas a clientes"
        value={`${resumen.clientes}/${resumen.confirmadas}`}
        subtitle="Clientes / Total"
        icon={TrendingUp}
      />
    </div>
  )
}
