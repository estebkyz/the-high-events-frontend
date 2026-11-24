import { CheckCircle, Clock, CreditCard, DollarSign } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import { formatCOP } from "@/utils/format"
import type { AbonoItem, TipoCartera } from "../types"
import { resumirCartera } from "../utils"

interface AbonosKPIsProps {
  abonos: AbonoItem[]
  cartera: TipoCartera
}

export function AbonosKPIs({ abonos, cartera }: AbonosKPIsProps) {
  const resumen = resumirCartera(abonos, cartera)
  const isClientes = cartera === "Clientes"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title={isClientes ? "Cartera de clientes" : "Contratación de proveedores"}
        value={formatCOP(resumen.total)}
        subtitle="Valor total acordado"
        icon={DollarSign}
      />
      <KPICard
        title={isClientes ? "Anticipos recibidos" : "Anticipos pagados"}
        value={formatCOP(resumen.anticipos)}
        subtitle="Primer 50 %"
        icon={CheckCircle}
      />
      <KPICard
        title={isClientes ? "Saldos recibidos" : "Saldos pagados"}
        value={formatCOP(resumen.saldos)}
        subtitle="Segundo 50 %"
        icon={CreditCard}
      />
      <KPICard
        title={isClientes ? "Por cobrar" : "Por desembolsar"}
        value={formatCOP(resumen.pendiente)}
        subtitle="Pendiente de liquidar"
        icon={Clock}
      />
    </div>
  )
}
