import { CheckCircle2, Clock, DollarSign, TrendingUp } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import { KPIStrip } from "@/components/KPIStrip"
import { formatCOP } from "@/utils/format"
import type { VentaItem } from "../types"
import { resumirVentas } from "../utils"

export function VentasKPIs({
  ventas,
  loading,
}: {
  ventas: VentaItem[]
  loading: boolean
}) {
  const resumen = resumirVentas(ventas)
  return (
    <KPIStrip loading={loading}>
      <KPICard
        title="Total en ventas"
        value={formatCOP(resumen.total)}
        subtitle="Ventas confirmadas"
        loading={loading}
        icon={DollarSign}
      />
      <KPICard
        title="Ventas pagadas"
        value={`${resumen.pagadas}/${resumen.confirmadas}`}
        subtitle="Pagadas / Total"
        loading={loading}
        icon={CheckCircle2}
      />
      <KPICard
        title="Por cobrar"
        value={`${resumen.porCobrar}/${resumen.confirmadas}`}
        subtitle="Con saldo / Total"
        loading={loading}
        icon={Clock}
      />
      <KPICard
        title="Ventas a clientes"
        value={`${resumen.clientes}/${resumen.confirmadas}`}
        subtitle="Clientes / Total"
        loading={loading}
        icon={TrendingUp}
      />
    </KPIStrip>
  )
}
