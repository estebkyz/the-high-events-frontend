import React, { useEffect, useRef, useState } from "react"
import {
  Calendar,
  DollarSign,
  Truck,
  CreditCard,
  ChevronDown,
  Clock,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { KPICard } from "../../components/KPICard"
import { EVENTO_PATHS } from "../../routes/paths"
import type { DashboardPageProps, DashboardRangeType } from "./types"
import { PERIOD_OPTIONS_BY_RANGE, getDashboardPeriodData } from "./data"
import { formatCOP, fmtPct } from "./utils"
import { ChartCard } from "./components/ChartCard"
import { AvailabilityMiniCalendar } from "./components/AvailabilityMiniCalendar"
import { StatisticalCharts } from "./components/StatisticalCharts"

export default function DashboardPage({
  onNavigate,
}: DashboardPageProps) {
  const navigate = useNavigate()
  const [rangeType, setRangeType] = useState<DashboardRangeType>("mes")
  const [selectedPeriods, setSelectedPeriods] = useState<
    Record<DashboardRangeType, string>
  >({
    dia: "hoy-2026",
    semana: "sem-2026",
    mes: "nov-2026",
    anio: "anio-2026",
  })
  const [customDateIso, setCustomDateIso] = useState("2026-11-20")
  const [isPeriodDropdown, setIsPeriodDropdown] = useState(false)
  const periodRef = useRef<HTMLDivElement>(null)

  const currentOptions = PERIOD_OPTIONS_BY_RANGE[rangeType]
  const activePeriodId = selectedPeriods[rangeType]
  const matchedOption = currentOptions.find((p) => p.id === activePeriodId)
  const activePeriodLabel = matchedOption
    ? matchedOption.label
    : activePeriodId.startsWith("custom-dia-")
      ? `Fecha: ${activePeriodId.replace("custom-dia-", "")}`
      : currentOptions[0].label

  const data = getDashboardPeriodData(activePeriodId)

  // Cerrar el selector al hacer clic fuera o con Esc
  useEffect(() => {
    if (!isPeriodDropdown) return
    const onDown = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) {
        setIsPeriodDropdown(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPeriodDropdown(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [isPeriodDropdown])

  // Métricas derivadas delimitadas por el período seleccionado
  const cobradoPct = Math.round((data.cobrado / data.vendido) * 100)
  const porCobrarPct = Math.round((data.porCobrar / data.vendido) * 100)
  const crecMensual =
    ((data.cobrado - data.cobradoMesAnterior) / data.cobradoMesAnterior) * 100

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const mesActualLabel = capitalize(data.monthName)
  const mesAnteriorLabel = capitalize(data.previousMonthName)

  const eventosKpiTitle =
    rangeType === "dia"
      ? "Eventos del Día"
      : rangeType === "semana"
        ? "Eventos de la Semana"
        : rangeType === "anio"
          ? "Eventos del Año"
          : "Eventos del Mes"

  const cobradoChartTitle =
    rangeType === "dia"
      ? `Cobrado Día contra Día (${mesActualLabel} vs ${mesAnteriorLabel})`
      : rangeType === "semana"
        ? `Cobrado Semana contra Semana (${mesActualLabel} vs ${mesAnteriorLabel})`
        : rangeType === "anio"
          ? `Cobrado Año contra Año (${mesActualLabel} vs ${mesAnteriorLabel})`
          : `Cobrado Mes contra Mes (${mesActualLabel} vs ${mesAnteriorLabel})`

  const handleSelectPeriod = (id: string) => {
    setSelectedPeriods((prev) => ({ ...prev, [rangeType]: id }))
    setIsPeriodDropdown(false)
  }

  const handleOpenCreateEvent = (fecha = "") => {
    if (fecha) {
      navigate(`${EVENTO_PATHS.create}?fecha=${encodeURIComponent(fecha)}`, {
        state: { fromDashboard: true, fecha },
      })
    } else {
      navigate(EVENTO_PATHS.create, {
        state: { fromDashboard: true },
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* ── Encabezado con Selector de Rango (Día | Semana | Mes | Año) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold text-[#F8FAFC] tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Filtro de rango de tiempo: Día | Semana | Mes | Año */}
            <div
              role="group"
              aria-label="Rango de tiempo"
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#181B22] border border-[#262D3D]"
            >
              {(
                [
                  { id: "dia", label: "Día" },
                  { id: "semana", label: "Semana" },
                  { id: "mes", label: "Mes" },
                  { id: "anio", label: "Año" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setRangeType(item.id)
                    setIsPeriodDropdown(false)
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    rangeType === item.id
                      ? "bg-[#7C3AED] text-white shadow-xs"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Selector específico para Día, Semana, Mes o Año */}
            <div ref={periodRef} className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isPeriodDropdown}
                onClick={() => setIsPeriodDropdown((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181B22] border border-[#262D3D] text-xs font-medium text-[#F8FAFC] hover:border-[#7C3AED] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/60"
              >
                <Calendar size={13} className="text-[#A78BFA] shrink-0" />
                <span>{activePeriodLabel}</span>
                <ChevronDown size={13} className="text-[#94A3B8] ml-0.5 shrink-0" />
              </button>

              {isPeriodDropdown && (
                <div
                  role="listbox"
                  aria-label="Seleccionar período"
                  className="absolute right-0 top-full mt-1 w-56 bg-[#181B22] border border-[#262D3D] rounded-xl shadow-xl py-1.5 z-30 text-xs"
                >
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    {rangeType === "dia"
                      ? "Seleccionar día"
                      : rangeType === "semana"
                        ? "Seleccionar semana"
                        : rangeType === "anio"
                          ? "Seleccionar año"
                          : "Seleccionar mes"}
                  </div>
                  {currentOptions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="option"
                      aria-selected={activePeriodId === p.id}
                      onClick={() => handleSelectPeriod(p.id)}
                      className={`w-full text-left px-3 py-1.5 transition-colors flex items-center justify-between hover:bg-[#222734] cursor-pointer ${
                        activePeriodId === p.id
                          ? "text-[#A78BFA] font-semibold bg-[#7C3AED]/10"
                          : "text-[#F8FAFC]"
                      }`}
                    >
                      <span>{p.label}</span>
                    </button>
                  ))}

                  {rangeType === "dia" && (
                    <div className="mt-1.5 pt-2 px-3 pb-1 border-t border-[#262D3D]">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                        Elegir otra fecha
                      </label>
                      <input
                        type="date"
                        value={customDateIso}
                        onChange={(e) => {
                          const val = e.target.value
                          if (!val) return
                          setCustomDateIso(val)
                          handleSelectPeriod(`custom-dia-${val}`)
                        }}
                        className="w-full px-2 py-1 rounded-lg bg-[#111318] border border-[#262D3D] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleOpenCreateEvent()}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
            >
              Crear evento
            </button>
          </div>
        </div>

        {/* ── Fila 1: Los 5 KPIs Principales Delimitados por el Período ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <KPICard
            title="Ventas Totales"
            value={formatCOP(data.vendido)}
            subtitle={`${mesActualLabel} ${data.year}`}
            icon={DollarSign}
            onClick={() => onNavigate?.("ventas")}
            actionLabel="Ver ventas"
          />
          <KPICard
            title="Cobros Totales"
            value={formatCOP(data.cobrado)}
            subtitle={`${cobradoPct}% (${fmtPct(crecMensual)})`}
            icon={CreditCard}
            onClick={() => onNavigate?.("abonos")}
            actionLabel="Ver cobros"
          />
          <KPICard
            title={eventosKpiTitle}
            value={`${data.eventosConfirmados}/${data.eventosTotal}`}
            subtitle={`${data.eventosConfirmados} confirmados`}
            icon={Calendar}
            onClick={() => onNavigate?.("eventos")}
            actionLabel="Ver eventos"
          />
          <KPICard
            title="Por Cobrar Clientes"
            value={formatCOP(data.porCobrar)}
            subtitle={`Saldo 50% (${porCobrarPct}%)`}
            icon={Clock}
            onClick={() => onNavigate?.("abonos")}
            actionLabel="Ver abonos"
          />
          <KPICard
            title="Por Pagar Proveedores"
            value={formatCOP(data.porPagarProveedores)}
            subtitle={`Pendiente ${mesActualLabel}`}
            icon={Truck}
            onClick={() => onNavigate?.("proveedores")}
            actionLabel="Proveedores"
          />
        </div>

        {/* ── Fila 2: Gráficos Estadísticos 1 y 2 + Mini-Agenda Multi-Evento ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico Estadístico 1: Comparativo del período seleccionado vs período anterior */}
            <ChartCard
              title={cobradoChartTitle}
              subtitle={`Comparativo de recaudo (${mesActualLabel} vs ${mesAnteriorLabel})`}
              labels={data.monthComparison.map((p) => p.label)}
              series={[
                {
                  name: `${mesActualLabel} ${data.year}`,
                  color: "#7C3AED",
                  values: data.monthComparison.map((p) => p.actual),
                  area: true,
                  strong: true,
                },
                {
                  name: `${mesAnteriorLabel} ${data.year}`,
                  color: "#10B981",
                  values: data.monthComparison.map((p) => p.anterior),
                },
              ]}
              ariaLabel={`Gráfico comparativo de cobros entre ${mesActualLabel} y ${mesAnteriorLabel}`}
            />

            {/* Gráfico Estadístico 2: Ventas Semana contra Semana */}
            <ChartCard
              title={`Evolución de Ventas Semanales (${mesActualLabel})`}
              subtitle={`Comportamiento diario por semana en ${mesActualLabel} vs semana previa`}
              labels={data.weekComparison.map((d) => d.day)}
              series={[
                {
                  name: `Semana actual (${mesActualLabel})`,
                  color: "#3B82F6",
                  values: data.weekComparison.map((d) => d.actual),
                  area: true,
                  strong: true,
                },
                {
                  name: "Semana anterior",
                  color: "#10B981",
                  values: data.weekComparison.map((d) => d.anterior),
                },
              ]}
              ariaLabel={`Gráfico de ventas semanales en ${mesActualLabel}`}
            />
          </div>

          <div className="lg:col-span-1">
            <AvailabilityMiniCalendar
              onNavigate={onNavigate}
              onAgendar={(iso) => handleOpenCreateEvent(iso)}
            />
          </div>
        </div>

        {/* ── Fila 3: Gráficos Estadísticos 3, 4 y 5 ── */}
        <StatisticalCharts
          monthLabel={`${mesActualLabel} ${data.year}`}
          serviciosRevenue={data.serviciosRevenue}
          modalidadEventos={data.modalidadEventos}
          operacionStats={data.operacionStats}
        />
      </main>
    </div>
  )
}
