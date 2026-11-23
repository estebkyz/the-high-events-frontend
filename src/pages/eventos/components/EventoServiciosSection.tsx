import { useState, useMemo, useRef, useEffect } from "react"
import { Plus, Trash2, PackagePlus, Undo2, Lock, Search, Truck } from "lucide-react"
import type { EventoFormValues, ServicioDetalleEvento } from "../types"
import { useCrudResource } from "../../../hooks/useCrudResource"
import type { ServicioItem } from "../../servicios/types"
import type { ProveedorItem } from "../../proveedores/types"
import type { Dispatch, SetStateAction } from "react"

interface EventoServiciosSectionProps {
  form: EventoFormValues
  setForm: Dispatch<SetStateAction<EventoFormValues>>
  onGoToCreateService: (initialName?: string) => void
}

const UNDO_WINDOW_MS = 6000

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70"

const parseCOP = (value?: string) =>
  Number((value || "").replace(/\D/g, "")) || 0
const formatNumber = (n: number) => n.toLocaleString("es-CO")
const formatCOP = (n: number) => `$ ${formatNumber(n)}`

// Búsqueda sin tildes ni mayúsculas
const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

/**
 * Reglas de negocio de esta sección:
 * - Los servicios NO tienen cantidad (pueden ser intangibles, p. ej. un show de payaso).
 * - Evento de CLIENTE: los servicios se heredan de la cotización y no se pueden agregar ni quitar.
 * - Evento PROPIO: se eligen del catálogo.
 */
export function EventoServiciosSection({
  form,
  setForm,
  onGoToCreateService,
}: EventoServiciosSectionProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [query, setQuery] = useState("")
  const [lastRemoved, setLastRemoved] = useState<{
    detalle: ServicioDetalleEvento
    index: number
  } | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { items: rawServices } = useCrudResource<ServicioItem>({ endpoint: "/servicios" })
  const { items: rawProviders } = useCrudResource<ProveedorItem>({ endpoint: "/proveedores" })
  const catalog = useMemo(
    () =>
      rawServices.map((s) => ({
        id: s.id,
        nombre: s.nombre,
        categoria: s.categoria,
        descripcion: s.descripcion,
        precioBase: s.precioBase,
      })),
    [rawServices],
  )

  // Mismo criterio que la sección de datos: sin modalidad definida se asume "Cliente"
  const esCliente = (form.modalidad || "Cliente") === "Cliente"
  const sinCotizacionAsignada = esCliente && !form.cotizacion_id
  const serviciosNombres = form.servicios || []

  useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current)
    }
  }, [])

  const serviciosDetalles = useMemo<ServicioDetalleEvento[]>(() => {
    if (sinCotizacionAsignada) return []
    const existingDetalles = form.serviciosDetalles || []
    return serviciosNombres.map((nombre, index) => {
      const match = existingDetalles.find((d) => d.nombre === nombre)
      if (match) return match
      const catItem = catalog.find((c) => c.nombre === nombre)
      return {
        id: `srv_${index}_${nombre}`,
        servicio_catalogo_id: catItem?.id,
        nombre,
        categoria: catItem?.categoria || "General",
        observaciones: catItem?.descripcion || "",
        costo: catItem?.precioBase || "$ 0",
      }
    })
  }, [sinCotizacionAsignada, serviciosNombres, form.serviciosDetalles, catalog])

  const availableToAdd = useMemo(
    () => catalog.filter((item) => !serviciosNombres.includes(item.nombre)),
    [catalog, serviciosNombres],
  )

  const filtrados = useMemo(() => {
    const q = normalizar(query.trim())
    if (!q) return availableToAdd
    return availableToAdd.filter((item) =>
      normalizar(`${item.nombre} ${item.categoria || ""}`).includes(q),
    )
  }, [availableToAdd, query])

  // Suma de los precios de los servicios (sin cantidades)
  const sumaServicios = useMemo(
    () => serviciosDetalles.reduce((acc, d) => acc + parseCOP(d.costo), 0),
    [serviciosDetalles],
  )

  // En evento de cliente el valor válido es el total de la cotización, no la suma del catálogo
  const totalCotizado = form.presupuesto_estimado || 0
  const totalMostrado = esCliente ? totalCotizado : sumaServicios
  const sumaNoCoincide =
    esCliente && totalCotizado > 0 && sumaServicios > 0 && sumaServicios !== totalCotizado

  const clearUndo = () => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = null
    setLastRemoved(null)
  }

  const closeSelector = () => {
    setShowSelector(false)
    setQuery("")
  }

  const handleSelectService = (serviceName: string) => {
    if (serviciosNombres.includes(serviceName)) return

    const catItem = catalog.find((c) => c.nombre === serviceName)
    const nuevo: ServicioDetalleEvento = {
      id: `srv_${Date.now()}_${catItem?.id || "new"}`,
      servicio_catalogo_id: catItem?.id,
      nombre: serviceName,
      categoria: catItem?.categoria || "General",
      observaciones: catItem?.descripcion || "",
      costo: catItem?.precioBase || "$ 0",
    }

    setForm((f) => ({
      ...f,
      servicios: [...serviciosNombres, serviceName],
      serviciosDetalles: [...serviciosDetalles, nuevo],
    }))
    if (lastRemoved?.detalle.nombre === serviceName) clearUndo()
  }

  const handleRemoveService = (detalle: ServicioDetalleEvento) => {
    const index = serviciosNombres.indexOf(detalle.nombre)
    setForm((f) => ({
      ...f,
      servicios: serviciosNombres.filter((s) => s !== detalle.nombre),
      serviciosDetalles: serviciosDetalles.filter(
        (d) => d.nombre !== detalle.nombre,
      ),
    }))
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setLastRemoved({ detalle, index })
    undoTimer.current = setTimeout(clearUndo, UNDO_WINDOW_MS)
  }

  const handleRestoreRemoved = () => {
    if (!lastRemoved) return
    const { detalle, index } = lastRemoved
    if (serviciosNombres.includes(detalle.nombre)) {
      clearUndo()
      return
    }
    const at = Math.min(
      index < 0 ? serviciosNombres.length : index,
      serviciosNombres.length,
    )
    const nombres = [...serviciosNombres]
    const detalles = [...serviciosDetalles]
    nombres.splice(at, 0, detalle.nombre)
    detalles.splice(at, 0, detalle)
    setForm((f) => ({ ...f, servicios: nombres, serviciosDetalles: detalles }))
    clearUndo()
  }

  const activeProviders = useMemo(
    () => rawProviders.filter((p) => p.estado === "Activo"),
    [rawProviders],
  )

  const handleAssignProvider = (detalle: ServicioDetalleEvento, providerId: string) => {
    const prov = activeProviders.find((p) => p.id === providerId)
    const nextDetalles = serviciosDetalles.map((d) =>
      d.nombre === detalle.nombre
        ? {
            ...d,
            proveedor_id: prov?.id || undefined,
            proveedor_nombre: prov?.razon_social || undefined,
          }
        : d,
    )
    setForm((f) => ({ ...f, serviciosDetalles: nextDetalles }))
  }

  const n = serviciosDetalles.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Columna izquierda: contexto */}
      <div className="lg:col-span-3 space-y-3">
        <h2 className="text-[16px] font-bold text-[#F8FAFC]">Servicios</h2>

        {/* Agregar: solo en eventos propios (en cliente los servicios vienen de la cotización) */}
        {!esCliente && (
          <button
            type="button"
            onClick={() => (showSelector ? closeSelector() : setShowSelector(true))}
            aria-expanded={showSelector}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors shadow-sm shadow-[#7C3AED]/25 flex items-center justify-center gap-1.5 cursor-pointer ${focusRing} focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1117]`}
          >
            <Plus size={15} aria-hidden="true" />
            <span>{showSelector ? "Ocultar" : "Agregar"}</span>
          </button>
        )}

        {n > 0 && (
          <div className="pt-3 border-t border-[#262D3D]/60 space-y-1">
            <span className="text-[11px] font-medium text-[#94A3B8] block">
              {esCliente
                ? `${n} servicio${n === 1 ? "" : "s"} contratado${n === 1 ? "" : "s"}`
                : `${n} servicio${n === 1 ? "" : "s"} asignado${n === 1 ? "" : "s"}`}
            </span>
            <span className="text-lg font-extrabold text-[#F8FAFC] block">
              {formatCOP(totalMostrado)}
            </span>
            <span className="text-[11px] text-[#94A3B8] block">
              {esCliente ? "Total cotizado" : "Total estimado"}
            </span>
          </div>
        )}
      </div>

      {/* Columna derecha */}
      <div className="lg:col-span-9 space-y-4">
        {/* Panel para agregar servicios (solo eventos propios) */}
        {!esCliente && showSelector && (
          <div
            className="p-4 bg-[#181B22] rounded-2xl space-y-3 animate-fade-in shadow-lg"
            onKeyDown={(e) => {
              if (e.key === "Escape") closeSelector()
            }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[#F1F5F9]">Servicios disponibles</h4>
              <button
                type="button"
                onClick={closeSelector}
                className={`text-xs text-[#CBD5E1] hover:text-white cursor-pointer rounded px-1 ${focusRing}`}
              >
                Cerrar
              </button>
            </div>

            <div className="relative">
              <Search
                size={14}
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar"
                aria-label="Buscar"
                className="w-full h-[40px] pl-9 pr-3.5 bg-[#111318] rounded-xl text-xs text-[#F8FAFC] border border-transparent placeholder:text-[#94A3B8] hover:border-[#3B4A63] focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 transition-colors"
              />
            </div>

            {availableToAdd.length === 0 ? (
              <div className="py-6 px-4 rounded-xl bg-[#111318] border border-[#262D3D] border-dashed text-center">
                <p className="text-xs font-medium text-[#CBD5E1]">
                  No hay más servicios disponibles para agregar
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-1">
                  Todos los servicios del catálogo ya fueron asignados a este evento.
                </p>
              </div>
            ) : filtrados.length === 0 ? (
              <div className="py-6 px-4 rounded-xl bg-[#111318] border border-[#262D3D] border-dashed text-center">
                <p className="text-xs font-medium text-[#CBD5E1]">
                  Sin resultados para «{query.trim()}»
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {filtrados.map((srv) => (
                  // Toda la fila es el botón (antes solo lo era un "+" de 28 px)
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => handleSelectService(srv.nombre)}
                    aria-label={`Agregar ${srv.nombre} al evento`}
                    className={`group flex items-center justify-between gap-2 p-3 rounded-xl bg-[#111318] hover:bg-[#14171F] text-left transition-colors cursor-pointer ${focusRing}`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 text-[#A78BFA] flex items-center justify-center shrink-0">
                        <PackagePlus size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-[#F1F5F9] truncate">
                          {srv.nombre}
                        </span>
                        <span className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-[#222734] text-[#CBD5E1]">
                            {srv.categoria}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-[#10B981]/15 text-[#34D399] font-mono font-medium">
                            {srv.precioBase}
                          </span>
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="p-1.5 rounded-lg bg-[#7C3AED]/20 group-hover:bg-[#7C3AED] text-[#A78BFA] group-hover:text-white transition-colors shrink-0"
                    >
                      <Plus size={14} />
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Salida cuando falta un servicio en el catálogo */}
            <button
              type="button"
              onClick={() => onGoToCreateService(query.trim() || undefined)}
              className={`flex items-center gap-1.5 text-xs font-semibold text-[#A78BFA] hover:text-[#C4B5FD] cursor-pointer rounded px-1 ${focusRing}`}
            >
              <Plus size={13} aria-hidden="true" />
              {query.trim() ? `Crear servicio «${query.trim()}»` : "Crear servicio nuevo"}
            </button>
          </div>
        )}

        {lastRemoved && !esCliente && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#181B22] text-xs text-[#CBD5E1]"
          >
            <span>
              Quitaste <span className="font-semibold">{lastRemoved.detalle.nombre}</span> del
              evento.
            </span>
            <button
              type="button"
              onClick={handleRestoreRemoved}
              className={`text-xs font-semibold text-[#A78BFA] hover:text-[#C4B5FD] inline-flex items-center gap-1.5 cursor-pointer shrink-0 rounded px-1 ${focusRing}`}
            >
              <Undo2 size={13} aria-hidden="true" />
              <span>Deshacer</span>
            </button>
          </div>
        )}

        {/* Aviso de herencia (evento de cliente con cotización) */}
        {esCliente && n > 0 && (
          <p className="flex items-center gap-2 text-[11px] text-[#CBD5E1]">
            <Lock size={12} aria-hidden="true" className="text-[#94A3B8] shrink-0" />
            <span>
              Servicios heredados de la cotización{" "}
              {form.cotizacion_codigo && (
                <span className="font-mono font-bold text-white">{form.cotizacion_codigo}</span>
              )}
            </span>
          </p>
        )}

        {/* Lista de servicios */}
        {n > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviciosDetalles.map((detalle) => (
              <div
                key={detalle.id || detalle.nombre}
                title={esCliente ? "Servicio heredado de la cotización" : undefined}
                className={`p-3.5 rounded-2xl flex flex-col gap-2.5 ${
                  esCliente
                    ? "bg-[#14171F] border border-dashed border-[#2D3748]"
                    : "bg-[#111318] border border-[#262D3D]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#7C3AED]/15 text-[#A78BFA]">
                      <PackagePlus size={18} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#F1F5F9] truncate">
                        {detalle.nombre}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#222734] text-[#CBD5E1]">
                          {detalle.categoria || "General"}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#34D399]">
                          {formatCOP(parseCOP(detalle.costo))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {esCliente ? (
                    <span
                      title="Heredado de la cotización"
                      className="p-2 text-[#94A3B8] shrink-0"
                    >
                      <Lock size={15} aria-hidden="true" />
                      <span className="sr-only">Heredado de la cotización, solo lectura</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemoveService(detalle)}
                      aria-label={`Quitar ${detalle.nombre} del evento`}
                      title="Quitar servicio"
                      className={`p-2 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/10 rounded-xl transition-colors cursor-pointer shrink-0 ${focusRing}`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Asignación de proveedor que ejecuta/suministra el servicio */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#262D3D]/60">
                  <Truck size={13} className="text-[#A78BFA] shrink-0" aria-hidden="true" />
                  <select
                    aria-label={`Proveedor para ${detalle.nombre}`}
                    value={detalle.proveedor_id || ""}
                    onChange={(e) => handleAssignProvider(detalle, e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#0F1117] border border-[#262D3D] text-[11px] text-[#CBD5E1] focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                  >
                    <option value="">Ejecución interna (The High Events)</option>
                    {activeProviders.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.razon_social} — {(prov.servicios || []).slice(0, 2).join(", ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showSelector && (
            <div className="bg-[#181B22] border border-[#262D3D] border-dashed rounded-2xl p-8 flex flex-col items-center text-center gap-3">
              <PackagePlus size={22} className="text-[#94A3B8]" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-[#CBD5E1]">
                  {sinCotizacionAsignada
                    ? "Selecciona una cotización previa para cargar los servicios"
                    : esCliente
                      ? "La cotización seleccionada no incluye servicios"
                      : "Aún no hay servicios asignados en este evento"}
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {sinCotizacionAsignada
                    ? "Los servicios contratados se importarán de forma automática con su categoría y precio."
                    : esCliente
                      ? "Revisa o actualiza la cotización para incluir los servicios del evento."
                      : "Selecciona del catálogo los servicios de sonido, iluminación o pantallas para el evento."}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}