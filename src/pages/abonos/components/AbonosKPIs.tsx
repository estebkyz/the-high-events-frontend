import React from "react"
import { CheckCircle, Clock, CreditCard, DollarSign } from "lucide-react"
import { KPICard } from "../../../components/KPICard"
import type { AbonosKPIsData, TipoAbonoTab } from "../types"
import { fmtCOP } from "../utils"

interface AbonosKPIsProps {
  kpis: AbonosKPIsData
  activeTab?: TipoAbonoTab
}

export const AbonosKPIs: React.FC<AbonosKPIsProps> = ({
  kpis,
  activeTab = "Clientes",
}) => {
  const isClientes = activeTab === "Clientes"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1 */}
      <KPICard
        title={isClientes ? "Anticipos Recibidos" : "Anticipos Pagados"}
        value={fmtCOP(isClientes ? kpis.anticiposClientes : kpis.anticiposProv)}
        subtitle={
          isClientes ? "Recaudado de clientes" : "Desembolsado a proveedores"
        }
        icon={CheckCircle}
        iconColor={isClientes ? "text-[#10B981]" : "text-[#3B82F6]"}
      />

      {/* KPI 2 */}
      <KPICard
        title={isClientes ? "Saldos Pendientes" : "Saldos por Liquidar"}
        value={fmtCOP(
          isClientes ? kpis.saldosPendClientes : kpis.saldosPendProv,
        )}
        subtitle={
          isClientes ? "Exigibles post-evento" : "Tras verificar cumplimiento"
        }
        icon={Clock}
        iconColor="text-[#F59E0B]"
      />

      {/* KPI 3 */}
      <KPICard
        title={
          isClientes
            ? "Total Cartera Clientes"
            : "Total Contratación Proveedores"
        }
        value={fmtCOP(
          isClientes
            ? kpis.anticiposClientes + kpis.saldosPendClientes
            : kpis.anticiposProv + kpis.saldosPendProv,
        )}
        subtitle={
          isClientes ? "Valor total acordado" : "Valor total contratado"
        }
        icon={DollarSign}
        iconColor="text-[#7C3AED]"
      />

      {/* KPI 4 */}
      <KPICard
        title={isClientes ? "Anticipos a Proveedores" : "Anticipos de Clientes"}
        value={fmtCOP(isClientes ? kpis.anticiposProv : kpis.anticiposClientes)}
        subtitle={
          isClientes
            ? "Control cartera proveedores"
            : "Control cartera clientes"
        }
        icon={CreditCard}
        iconColor={isClientes ? "text-[#3B82F6]" : "text-[#10B981]"}
      />
    </div>
  )
}
