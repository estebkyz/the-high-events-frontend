import React from "react"
import type {
  CategoryRevenueItem,
  ModalityBreakdownItem,
  OperationalStatItem,
} from "../types"

interface StatisticalChartsProps {
  monthLabel: string
  serviciosRevenue: CategoryRevenueItem[]
  modalidadEventos: ModalityBreakdownItem[]
  operacionStats: OperationalStatItem[]
}

export const StatisticalCharts: React.FC<StatisticalChartsProps> = ({
  monthLabel,
  serviciosRevenue,
  modalidadEventos,
  operacionStats,
}) => {
  const totalEventos = modalidadEventos.reduce((acc, m) => acc + m.cantidad, 0)

  // Cálculo de segmentos para el Donut SVG (Gráfico 4)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  let cumulativePercent = 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Gráfico Estadístico 3: Ingresos por Categoría de Servicio ── */}
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="text-[15px] font-semibold text-[#F8FAFC]">
              Ventas por Categoría de Servicio
            </h2>
          </div>
          <p className="text-[12px] text-[#94A3B8] mb-4">
            {monthLabel}
          </p>

          <div className="space-y-3.5">
            {serviciosRevenue.map((srv) => (
              <div key={srv.categoria} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#F1F5F9] truncate pr-2">
                    {srv.categoria}
                  </span>
                  <span className="text-[#CBD5E1] font-semibold tabular-nums shrink-0">
                    $ {srv.monto.toFixed(1)} M{" "}
                    <span className="text-[#94A3B8] font-normal text-[11px]">
                      ({srv.porcentaje}%)
                    </span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#111318] rounded-full overflow-hidden border border-[#262D3D]/60">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${srv.porcentaje}%`,
                      backgroundColor: srv.color,
                    }}
                  />
                </div>
                <p className="text-[10.5px] text-[#64748B]">
                  Contratado en {srv.eventos} eventos del período
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gráfico Estadístico 4: Eventos por Modalidad y Estado (Donut SVG) ── */}
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="text-[15px] font-semibold text-[#F8FAFC]">
              Distribución de Eventos del Mes
            </h2>
          </div>
          <p className="text-[12px] text-[#94A3B8] mb-4">
            {monthLabel}
          </p>

          <div className="flex items-center justify-center my-3">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg
                className="w-36 h-36 -rotate-90"
                viewBox="0 0 140 140"
                aria-label="Gráfico de anillo de distribución de eventos"
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke="#111318"
                  strokeWidth="16"
                />
                {modalidadEventos.map((item) => {
                  const strokeDasharray = `${
                    (item.porcentaje / 100) * circumference
                  } ${circumference}`
                  const strokeDashoffset = -(
                    (cumulativePercent / 100) *
                    circumference
                  )
                  cumulativePercent += item.porcentaje
                  return (
                    <circle
                      key={item.label}
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="butt"
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[22px] font-bold text-[#F8FAFC] leading-none">
                  {totalEventos}
                </span>
                <span className="text-[10px] text-[#94A3B8] mt-1">
                  Eventos totales
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 mt-4 pt-3 border-t border-[#262D3D]">
            {modalidadEventos.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#CBD5E1] truncate">{item.label}</span>
                </div>
                <div className="text-right shrink-0 ml-2 tabular-nums">
                  <span className="font-semibold text-[#F8FAFC]">
                    {item.cantidad} ev.
                  </span>{" "}
                  <span className="text-[#94A3B8] text-[11px]">
                    ($ {item.ingresos.toFixed(1)} M)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gráfico Estadístico 5: Cumplimiento Operativo y Logístico ── */}
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="text-[15px] font-semibold text-[#F8FAFC]">
              Rendimiento Operativo y Logístico
            </h2>
          </div>
          <p className="text-[12px] text-[#94A3B8] mb-4">
            {monthLabel}
          </p>

          <div className="space-y-4">
            {operacionStats.map((stat) => {
              const total =
                stat.completado + stat.pendiente + stat.alerta || 1
              const pctComp = Math.round((stat.completado / total) * 100)
              const pctPend = Math.round((stat.pendiente / total) * 100)
              const pctAlert = Math.max(0, 100 - pctComp - pctPend)

              return (
                <div key={stat.categoria} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F1F5F9]">
                      {stat.categoria}
                    </span>
                    <span className="text-[11px] text-[#94A3B8] tabular-nums">
                      <strong className="text-[#10B981]">
                        {stat.completado}
                      </strong>{" "}
                      ok ·{" "}
                      <strong className="text-[#F59E0B]">
                        {stat.pendiente}
                      </strong>{" "}
                      en curso
                      {stat.alerta > 0 && (
                        <>
                          {" · "}
                          <strong className="text-[#EF4444]">
                            {stat.alerta}
                          </strong>{" "}
                          alerta
                        </>
                      )}{" "}
                      ({pctComp}%)
                    </span>
                  </div>

                  {/* Barra apilada */}
                  <div className="w-full h-3 bg-[#111318] rounded-lg overflow-hidden flex border border-[#262D3D]/60">
                    <div
                      className="h-full bg-[#10B981] transition-all"
                      style={{ width: `${pctComp}%` }}
                      title={`Completado / Disponible: ${stat.completado} ${stat.unidad}`}
                    />
                    <div
                      className="h-full bg-[#F59E0B] transition-all"
                      style={{ width: `${pctPend}%` }}
                      title={`En proceso / En evento: ${stat.pendiente} ${stat.unidad}`}
                    />
                    {stat.alerta > 0 && (
                      <div
                        className="h-full bg-[#EF4444] transition-all"
                        style={{ width: `${pctAlert}%` }}
                        title={`Alerta / Mantenimiento: ${stat.alerta} ${stat.unidad}`}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#262D3D] text-[11px] text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
            Óptimo / Resuelto
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" />
            En ejecución
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444]" />
            Alerta / Daño
          </span>
        </div>
      </div>
    </div>
  )
}
