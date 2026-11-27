import { CheckCircle, Clock, CreditCard, DollarSign } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import { KPIStrip } from "@/components/KPIStrip"
import { formatCOP } from "@/utils/format"
import type { AbonoItem, TipoCartera } from "../types"
import { resumirCartera } from "../utils"
import { ESQUEMA_PAGO } from "@/constants/empresa"

interface AbonosKPIsProps {
  loading: boolean
  abonos: AbonoItem[]
  cartera: TipoCartera
}

export function AbonosKPIs({ loading, abonos, cartera }: AbonosKPIsProps) {
  const resumen = resumirCartera(abonos, cartera)
  const isClientes = cartera === "Clientes"

  return (
    <KPIStrip loading={loading}>
      <KPICard
        title={isClientes ? "Cartera de clientes" : "Contratación de proveedores"}
        value={formatCOP(resumen.total)}
        subtitle="Valor total acordado"
        loading={loading}
        icon={DollarSign}
      />
      <KPICard
        title={isClientes ? "Anticipos recibidos" : "Anticipos pagados"}
        value={formatCOP(resumen.anticipos)}
        subtitle={`Primer ${ESQUEMA_PAGO.anticipo} %`}
        loading={loading}
        icon={CheckCircle}
      />
      <KPICard
        title={isClientes ? "Saldos recibidos" : "Saldos pagados"}
        value={formatCOP(resumen.saldos)}
        subtitle={`${ESQUEMA_PAGO.saldo} % restante`}
        loading={loading}
        icon={CreditCard}
      />
      <KPICard
        title={isClientes ? "Por cobrar" : "Por desembolsar"}
        value={formatCOP(resumen.pendiente)}
        subtitle="Pendiente de liquidar"
        loading={loading}
        icon={Clock}
      />
    </KPIStrip>
  )
}
