import React, { useEffect, useRef, useState } from "react"
import {
  Calendar,
  DollarSign,
  Truck,
  CreditCard,
  ChevronDown,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../components/Toast"
import { KPICard } from "../../components/KPICard"
import { WEEK_COMPARISON_SERIES, MONTH_COMPARISON_SERIES } from "../../data"
import { EVENTO_PATHS } from "../../routes/paths"
import type { DashboardPageProps } from "./types"
import { PERIOD_OPTIONS, PERIOD_DATA } from "./data"
import { formatCOP, fmtPct } from "./utils"
import { ChartCard } from "./components/ChartCard"
import { AvailabilityMiniCalendar } from "./components/AvailabilityMiniCalendar"

export default function DashboardPage({
  onNavigate,
}: DashboardPageProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const [periodId, setPeriodId] = useState("oct-2026")
  const [isPeriodDropdown, setIsPeriodDropdown] = useState(false)
  const periodRef = useRef<HTMLDivElement>(null)

  const period =
    PERIOD_OPTIONS.find((p) => p.id === periodId) ?? PERIOD_OPTIONS[0]
  const data = PERIOD_DATA[periodId] ?? PERIOD_DATA["oct-2026"]

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

  // Métricas derivadas
  const cobradoPct = Math.round((data.cobrado / data.vendido) * 100)
  const porCobrarPct = Math.round((data.porCobrar / data.vendido) * 100)
  const desvMeta = ((data.cobrado - data.metaCobrado) / data.metaCobrado) * 100
  const crecMensual =
    ((data.cobrado - data.cobradoMesAnterior) / data.cobradoMesAnterior) * 100
  const metaMillones = data.metaCobrado / 1_000_000

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
        {/* ── Encabezado ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold text-[#F8FAFC] tracking-tight">
              Resumen
            </h1>
            <p className="text-[13px] text-[#94A3B8] mt-1">
              Resumen de rendimiento y métricas clave
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div ref={periodRef} className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isPeriodDropdown}
                onClick={() => setIsPeriodDropdown((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181B22] text-[13px] font-medium text-[#F8FAFC] hover:border-[#3B455A] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/60"
              >
                <Calendar size={15} className="text-[#CBD5E1]" />
                <span>{period.label}</span>
                <ChevronDown size={14} className="text-[#94A3B8] ml-1" />
              </button>

              {isPeriodDropdown && (
                <div
                  role="listbox"
                  aria-label="Período"
                  className="absolute right-0 top-full mt-1 w-56 bg-[#181B22] border border-[#262D3D] rounded-xl shadow-xl py-1 z-30 text-[13px]"
                >
                  {PERIOD_OPTIONS.map((p) => {
                    const sinDatos = "sinDatos" in p && p.sinDatos
                    return (
                      <button
                        key={p.id}
                        type="button"
                        role="option"
                        aria-selected={periodId === p.id}
                        disabled={sinDatos}
                        onClick={() => {
                          setPeriodId(p.id)
                          setIsPeriodDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-2 transition-colors flex items-center justify-between ${
                          sinDatos
                            ? "text-[#94A3B8] cursor-not-allowed"
                            : "hover:bg-[#222734] cursor-pointer"
                        } ${
                          periodId === p.id
                            ? "text-[#A78BFA] font-semibold"
                            : sinDatos
                              ? ""
                              : "text-[#F8FAFC]"
                        }`}
                      >
                        <span>{p.label}</span>
                        {sinDatos && (
                          <span className="text-[11px]">Sin datos aún</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleOpenCreateEvent()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold transition-colors shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
            >
              Crear evento
            </button>
          </div>
        </div>

        {/* ── Fila 1: KPIs principales ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <KPICard
            title="Ventas Totales"
            value={formatCOP(data.vendido)}
            subtitle="Total del período"
            icon={DollarSign}
          />
          <KPICard
            title="Cobros Totales"
            value={formatCOP(data.cobrado)}
            subtitle={`Total del período`}
            icon={CreditCard}
          />
          <KPICard
            title="Ticket Promedio"
            value={formatCOP(data.ticket)}
            subtitle={`Por evento (${data.eventosTotal} eventos)`}
            icon={Users}
          />
          <KPICard
            title="Eventos"
            value={`${data.eventosConfirmados}/${data.eventosTotal}`}
            subtitle={`${data.eventosConfirmados} confirmados de ${data.eventosTotal}`}
            icon={Calendar}
          />
        </div>

        {/* ── Fila 2: KPIs de seguimiento ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          <KPICard
            size="lg"
            title="Por cobrar a clientes"
            value={formatCOP(data.porCobrar)}
            subtitle={`${porCobrarPct} % de lo vendido`}
            icon={Clock}
            onClick={() => onNavigate?.("abonos")}
            actionLabel="Ver abonos"
          />
          <KPICard
            size="lg"
            title="Por pagar a proveedores"
            value={formatCOP(data.porPagarProveedores)}
            subtitle="Pagos pendientes del período"
            icon={Truck}
            onClick={() => onNavigate?.("proveedores")}
            actionLabel="Ver proveedores"
          />
          <KPICard
            size="lg"
            title="Rentabilidad neta"
            value={formatCOP(data.rentabilidad)}
            subtitle="Estimada después de costos"
            icon={TrendingUp}
            onClick={() => onNavigate?.("ventas")}
            actionLabel="Ver ventas"
          />
        </div>

        {/* ── Fila 3: gráficos + agenda ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ChartCard
              title="Cobrado Mes contra Mes"
              subtitle={`Octubre vs septiembre · ${fmtPct(desvMeta)} frente a la meta`}
              labels={MONTH_COMPARISON_SERIES.map((p) => p.label)}
              series={[
                {
                  name: "Octubre",
                  color: "#3B82F6",
                  values: MONTH_COMPARISON_SERIES.map((p) => p.actual),
                  area: true,
                  strong: true,
                },
                {
                  name: "Septiembre",
                  color: "#10B981",
                  values: MONTH_COMPARISON_SERIES.map((p) => p.anterior),
                },
              ]}
              ariaLabel="Gráfico de líneas del cobrado acumulado de octubre frente a septiembre y la meta del mes"
            />

            <ChartCard
              title="Ventas Semana contra Semana"
              subtitle="19 oct - 25 oct vs semana anterior"
              labels={WEEK_COMPARISON_SERIES.map((d) => d.day)}
              series={[
                {
                  name: "Semana 19/10",
                  color: "#3B82F6",
                  values: WEEK_COMPARISON_SERIES.map((d) => d.actual),
                  area: true,
                  strong: true,
                },
                {
                  name: "Semana 12/10",
                  color: "#10B981",
                  values: WEEK_COMPARISON_SERIES.map((d) => d.anterior),
                },
              ]}
              ariaLabel="Gráfico de líneas de las ventas por día de la semana del 19 de octubre frente a la semana anterior"
            />
          </div>

          <div className="lg:col-span-1">
            <AvailabilityMiniCalendar
              onNavigate={onNavigate}
              onAgendar={(iso) => handleOpenCreateEvent(iso)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
