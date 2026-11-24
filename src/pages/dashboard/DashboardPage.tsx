import { useState } from "react"
import { Calendar, Clock, CreditCard, DollarSign, Truck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { EmptyState } from "@/components/EmptyState"
import { KPICard } from "@/components/KPICard"
import { ListPage } from "@/components/list/ListPage"
import { EVENTO_PATHS } from "@/routes/paths"
import { useAppNavigate } from "@/routes/useAppNavigate"
import { formatCOP, todayISO } from "@/utils/format"
import { AvailabilityMiniCalendar } from "./components/AvailabilityMiniCalendar"
import { CategoriasPanel } from "./components/CategoriasPanel"
import { ChartCard } from "./components/ChartCard"
import { ModalidadPanel } from "./components/ModalidadPanel"
import { OperacionPanel } from "./components/OperacionPanel"
import { PeriodPicker } from "./components/PeriodPicker"
import { COLORS } from "./constants"
import {
  eventosPorModalidad,
  filterByPeriod,
  getKpis,
  resumenOperacion,
  serie,
  ventasPorCategoria,
  ventasToMovimientos,
  type Movimiento,
} from "./metrics"
import { getPeriod } from "./period"
import type { RangeType } from "./types"
import { useDashboardData } from "./useDashboardData"

export default function DashboardPage() {
  const navigate = useNavigate()
  const goTo = useAppNavigate()
  const { data, agenda, loading, error, refresh } = useDashboardData()
  const [rangeType, setRangeType] = useState<RangeType>("mes")
  const [anchor, setAnchor] = useState(() => todayISO())

  const period = getPeriod(rangeType, anchor)
  const current = filterByPeriod(data, period.range)
  const kpis = getKpis(current)
  const labels = period.buckets.map((b) => b.label)

  const compare = (movimientos: Movimiento[], color: string) => [
    {
      name: "Período actual",
      color,
      values: serie(movimientos, period.buckets),
      area: true,
      strong: true,
    },
    {
      name: "Período anterior",
      color: COLORS.success,
      // El período anterior puede tener más o menos tramos (meses de 4 o 5 semanas).
      values: labels.map((_, i) => {
        const bucket = period.previousBuckets[i]
        return bucket ? serie(movimientos, [bucket])[0] : 0
      }),
    },
  ]

  return (
    <ListPage>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-[24px] font-bold text-[#F8FAFC] tracking-tight">Dashboard</h1>
        <PeriodPicker
          type={rangeType}
          anchor={anchor}
          label={period.label}
          onTypeChange={setRangeType}
          onAnchorChange={setAnchor}
        />
      </div>

      {error && (
        <div role="alert" className="bg-[#181B22] border border-[#EF4444]/40 rounded-2xl">
          <EmptyState
            compact
            title="No se pudieron cargar todos los datos"
            description={error}
            action={{ label: "Reintentar", onClick: () => void refresh() }}
          />
        </div>
      )}

      <div
        aria-busy={loading}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
      >
        <KPICard
          title="Ventas totales"
          value={formatCOP(kpis.vendido)}
          subtitle="Total del período"
          icon={DollarSign}
          onClick={() => void goTo("ventas")}
        />
        <KPICard
          title="Cobros totales"
          value={formatCOP(kpis.cobrado)}
          subtitle="Total del período"
          icon={CreditCard}
          onClick={() => void goTo("abonos")}
        />
        <KPICard
          title="Eventos"
          value={`${kpis.eventosVigentes}/${kpis.eventosTotal}`}
          subtitle="Vigentes / Total"
          icon={Calendar}
          onClick={() => void goTo("eventos")}
        />
        <KPICard
          title="Por cobrar"
          value={formatCOP(kpis.porCobrar)}
          subtitle="En el período"
          icon={Clock}
          onClick={() => void goTo("abonos")}
        />
        <KPICard
          title="Por pagar"
          value={formatCOP(kpis.porPagar)}
          subtitle="Proveedores en el período"
          icon={Truck}
          onClick={() => void goTo("abonos")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5 min-w-0">
          <ChartCard
            title="Cobrado"
            subtitle={period.label}
            labels={labels}
            series={compare(data.cobros, COLORS.accent)}
          />
          <ChartCard
            title="Vendido"
            subtitle={period.label}
            labels={labels}
            series={compare(ventasToMovimientos(data.ventas), COLORS.info)}
          />
        </div>
        <AvailabilityMiniCalendar
          agenda={agenda}
          onOpenAgenda={() => void goTo("agendamiento")}
          onCreateEvento={(iso) => void navigate(EVENTO_PATHS.createOn(iso))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <CategoriasPanel categorias={ventasPorCategoria(current.eventos)} />
        <ModalidadPanel modalidades={eventosPorModalidad(current.eventos)} />
        <OperacionPanel resumen={resumenOperacion(current)} />
      </div>
    </ListPage>
  )
}
