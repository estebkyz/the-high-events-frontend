import React from "react"
import { DollarSign, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { KPICard } from "../../../components/KPICard"
import type { VentasKPIsData } from "../types"
import { formatVentaCOP } from "../utils"

interface VentasKPIsProps {
  kpis: VentasKPIsData
}

export const VentasKPIs: React.FC<VentasKPIsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Facturado / Acordado */}
      <KPICard
        title="Total en Ventas"
        value={formatVentaCOP(kpis.totalVentasCOP)}
        subtitle={`${kpis.totalVentasCount} ventas registradas`}
        icon={DollarSign}
        iconColor="text-[#7C3AED]"
      />

      {/* Total Cobrado Efectivamente */}
      <KPICard
        title="Total Cobrado"
        value={formatVentaCOP(kpis.cobradoCOP)}
        subtitle={`${kpis.cobradoCount} ventas pagadas`}
        icon={CheckCircle2}
        iconColor="text-[#10B981]"
      />

      {/* Saldo Pendiente por Cobrar */}
      <KPICard
        title="Por Cobrar"
        value={formatVentaCOP(kpis.pendienteCOP)}
        subtitle={`${kpis.pendienteCount} pendientes / parciales`}
        icon={Clock}
        iconColor="text-[#F59E0B]"
      />

      {/* Distribución por Tipo de Venta */}
      <KPICard
        title="Distribución de Ventas"
        value={`${kpis.clientesCount} Clientes · ${kpis.propiosCount} Propios`}
        subtitle="Servicios a clientes vs eventos propios"
        icon={TrendingUp}
        iconColor="text-[#3B82F6]"
      />
    </div>
  )
}
