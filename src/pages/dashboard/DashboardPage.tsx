import { useState } from "react"
import { Calendar, Clock, CreditCard, DollarSign, Truck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { EmptyState } from "@/components/EmptyState"
import { KPICard } from "@/components/KPICard"
import { KPIStrip } from "@/components/KPIStrip"
import { ListPage } from "@/components/list/ListPage"
import { ABONOS_PATHS, AGENDA_PATHS, EVENTO_PATHS, ROUTE_PATHS } from "@/routes/paths"
import { useAppNavigate } from "@/routes/useAppNavigate"
import { formatCOP, todayISO } from "@/utils/format"
import { AvailabilityMiniCalendar } from "./components/AvailabilityMiniCalendar"
import { CategoriasPanel } from "./components/CategoriasPanel"
import { ComparativoCard } from "./components/ComparativoCard"
import { ModalidadPanel } from "./components/ModalidadPanel"
import { OperacionPanel } from "./components/OperacionPanel"
import { PeriodPicker } from "./components/PeriodPicker"
import { KPI_GRID, KPI_GRID_PARCIAL, MAIN_GRID } from "./constants"
import {
  eventosPorModalidad,
  filterByPeriod,
  getKpis,
  getTrend,
  resumenOperacion,
  ventasPorCategoria,
  ventasToMovimientos,
  type Movimiento,
} from "./metrics"
import { getComparison, getPeriod } from "./period"
import type { RangeType, ViewState } from "./types"
import { useDashboardData } from "./useDashboardData"
import { MODULE_ACCESS } from "@/constants/access"
import { useCan } from "@/hooks/useAccess"

export default function DashboardPage() {
  const navigate = useNavigate()
  const goTo = useAppNavigate()
  const can = useCan()
  const { access, data, agenda, state, loading, error, refresh } = useDashboardData()
  const [rangeType, setRangeType] = useState<RangeType>("mes")
  const [anchor, setAnchor] = useState(() => todayISO())

  const period = getPeriod(rangeType, anchor)
  const current = filterByPeriod(data, period.range)
  const kpis = getKpis(current)
  const hoy = todayISO()
  const comparison = getComparison(rangeType, anchor, hoy)
  const ventas = ventasToMovimientos(data.ventas)
  // Un período que aún no empieza no se compara.
  const trend = (view: ViewState, actual: number, movimientos: Movimiento[]) =>
    view === "ready" && period.range.from <= hoy
      ? getTrend(actual, movimientos, comparison)
      : undefined
  // Sin dato confiable se muestra un guion: un cero se leería como real.
  const kpi = (view: ViewState, value: string) => ({
    value: view === "error" ? "—" : value,
    loading: view === "loading",
  })

  return (
    <ListPage>
      <div className="@container space-y-4">
        <p role="status" className="sr-only">
          {loading ? "Cargando datos…" : ""}
        </p>
        <div className="flex flex-col @4xl:flex-row @4xl:items-center justify-between gap-4">
          <h1 className="text-[20px] leading-7 font-semibold text-ink">Dashboard</h1>
          <PeriodPicker
            type={rangeType}
            anchor={anchor}
            label={period.label}
            onTypeChange={setRangeType}
            onAnchorChange={setAnchor}
          />
        </div>

        {error && (
          <div role="alert" className="bg-surface rounded-xl shadow-card">
            <EmptyState
              compact
              title="No se pudieron cargar todos los datos"
              description={error}
              action={{ label: "Reintentar", onClick: () => void refresh() }}
            />
          </div>
        )}

        <KPIStrip
          grid={access.ventas && access.abonos ? KPI_GRID : KPI_GRID_PARCIAL}
          loading={loading}
        >
          {access.ventas && (
            <KPICard
              title="Ventas totales"
              {...kpi(state.ventas, formatCOP(kpis.vendido))}
              trend={trend(state.ventas, kpis.vendido, ventas)}
              subtitle="Total del período"
              icon={DollarSign}
              onClick={() => void goTo("ventas")}
            />
          )}
          {access.abonos && (
            <KPICard
              title="Cobros totales"
              {...kpi(state.cobros, formatCOP(kpis.cobrado))}
              trend={trend(state.cobros, kpis.cobrado, data.cobros)}
              subtitle="Total del período"
              icon={CreditCard}
              onClick={() => void navigate(ABONOS_PATHS.cartera("Clientes"))}
            />
          )}
          <KPICard
            title="Eventos"
            {...kpi(state.eventos, `${kpis.eventosVigentes}/${kpis.eventosTotal}`)}
            subtitle="Vigentes / Total"
            icon={Calendar}
            onClick={
              can(MODULE_ACCESS.eventos.view) ? () => void goTo("eventos") : undefined
            }
          />
          {access.abonos && access.ventas && (
            <KPICard
              title="Por cobrar"
              {...kpi(state.porCobrar, formatCOP(kpis.porCobrar))}
              subtitle="En el período"
              icon={Clock}
              onClick={() => void navigate(ABONOS_PATHS.cartera("Clientes"))}
            />
          )}
          {access.abonos && (
            <KPICard
              title="Por pagar"
              {...kpi(state.porPagar, formatCOP(kpis.porPagar))}
              subtitle="Proveedores en el período"
              icon={Truck}
              onClick={() => void navigate(ABONOS_PATHS.cartera("Proveedores"))}
            />
          )}
        </KPIStrip>

        <div className={MAIN_GRID}>
          {access.abonos && access.ventas && (
            <div className="grid @2xl:col-span-2">
              <ComparativoCard
                data={data}
                anchor={anchor}
                state={{ cobrado: state.cobros, venta: state.ventas }}
              />
            </div>
          )}
          <div className="grid @2xl:col-span-2 @4xl:col-span-1 @4xl:row-span-2">
            <AvailabilityMiniCalendar
              agenda={agenda}
              state={state.agenda}
              onOpenAgenda={
                can(MODULE_ACCESS.agendamiento.view)
                  ? (iso) =>
                      void navigate(iso ? AGENDA_PATHS.on(iso) : ROUTE_PATHS.agendamiento)
                  : undefined
              }
              onCreateEvento={
                can(MODULE_ACCESS.eventos.create)
                  ? (iso) => void navigate(EVENTO_PATHS.createOn(iso))
                  : undefined
              }
            />
          </div>
          <CategoriasPanel
            categorias={ventasPorCategoria(current.eventos)}
            state={state.eventos}
          />
          <ModalidadPanel
            modalidades={eventosPorModalidad(current.eventos)}
            state={state.eventos}
          />
          <div className="grid col-span-full">
            <OperacionPanel resumen={resumenOperacion(current)} state={state.operacion} />
          </div>
        </div>
      </div>
    </ListPage>
  )
}
