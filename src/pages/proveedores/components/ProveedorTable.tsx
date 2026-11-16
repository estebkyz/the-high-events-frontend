import React, { useEffect, useRef, useState } from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  Truck,
  Package,
  Sparkles,
  Undo2,
} from "lucide-react"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import type { ProveedorItem } from "../types"

export interface ProveedorTableProps {
  providers: ProveedorItem[]
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onToggleStatus: (id: string, newStatus: "Activo" | "Inactivo") => void
  onView: (provider: ProveedorItem) => void
  onEdit: (provider: ProveedorItem) => void
  onDelete: (provider: ProveedorItem) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

type Estado = "Activo" | "Inactivo"

const UNDO_WINDOW_MS = 6000
const COLUMNAS = 5

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70"

/** "+57 3112223344" -> "+57 311 222 3344" (antes se partía en dos líneas y era difícil de leer). */
function formatTelefono(raw?: string) {
  if (!raw) return ""
  const d = raw.replace(/\D/g, "")
  if (d.length === 12 && d.startsWith("57")) {
    return `+57 ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`
  }
  if (d.length === 10) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
  return raw
}

/* ------------------------------ Catálogo ------------------------------
   Antes: todos los chips en un bloque → filas de alturas muy distintas.
   Ahora: máximo una línea de servicios y una de equipos; "+N" expande la fila. */

function Chip({
  tipo,
  texto,
}: {
  tipo: "servicio" | "equipo"
  texto: string
}) {
  const esServicio = tipo === "servicio"
  return (
    <span
      title={
        esServicio
          ? "Servicio / personal especializado"
          : "Equipo / insumo técnico (sujeto a acta de recepción)"
      }
      className={`inline-flex items-center gap-1 max-w-full px-1.5 py-0.5 rounded text-[11px] font-medium ${
        esServicio
          ? "bg-[#7C3AED]/20 text-[#C4B5FD]"
          : "bg-[#3B82F6]/15 text-[#93C5FD]"
      }`}
    >
      <span className="sr-only">{esServicio ? "Servicio: " : "Equipo: "}</span>
      <span className="truncate">{texto}</span>
    </span>
  )
}

function Catalogo({
  nombre,
  servicios,
  equipos,
  expanded,
  onToggle,
}: {
  nombre: string
  servicios: string[]
  equipos: string[]
  expanded: boolean
  onToggle: () => void
}) {
  if (servicios.length === 0 && equipos.length === 0) {
    return <span className="text-[11px] text-[#94A3B8]">Ninguno</span>
  }

  const visibles = (items: string[]) => (expanded ? items : items.slice(0, 1))
  const ocultos = (items: string[]) => (expanded ? 0 : Math.max(items.length - 1, 0))
  const colapsable = servicios.length > 1 || equipos.length > 1

  const Mas = ({ n }: { n: number }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={false}
      aria-label={`Ver ${n} más en el catálogo de ${nombre}`}
      className={`px-1.5 py-0.5 rounded text-[11px] font-semibold text-[#CBD5E1] bg-[#222734] hover:bg-[#2D3748] hover:text-white transition-colors cursor-pointer ${focusRing}`}
    >
      +{n}
    </button>
  )

  return (
    <div className="flex flex-col gap-1 max-w-[300px]">
      {servicios.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {visibles(servicios).map((s) => (
            <Chip key={`srv-${s}`} tipo="servicio" texto={s} />
          ))}
          {ocultos(servicios) > 0 && <Mas n={ocultos(servicios)} />}
        </div>
      )}
      {equipos.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {visibles(equipos).map((eq) => (
            <Chip key={`eq-${eq}`} tipo="equipo" texto={eq} />
          ))}
          {ocultos(equipos) > 0 && <Mas n={ocultos(equipos)} />}
        </div>
      )}
      {expanded && colapsable && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={true}
          className={`self-start text-[11px] font-semibold text-[#A78BFA] hover:text-[#C4B5FD] cursor-pointer rounded px-0.5 ${focusRing}`}
        >
          Ver menos
        </button>
      )}
    </div>
  )
}

/* ------------------------------- Tabla ------------------------------- */

export const ProveedorTable: React.FC<ProveedorTableProps> = ({
  providers,
  totalCount,
  pageSize,
  currentPage,
  totalPages,
  onPageSizeChange,
  onPageChange,
  onToggleStatus,
  onDelete,
  onView,
  onEdit,
  onEmptyAction,
  onResetFilters,
  isFiltered = false,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [lastChange, setLastChange] = useState<{
    id: string
    nombre: string
    previo: Estado
    nuevo: Estado
  } | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current)
    }
  }, [])

  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // El cambio de estado se aplica al instante, pero se puede deshacer unos segundos
  const handleStatusChange = (p: ProveedorItem, nuevo: Estado) => {
    if (nuevo === p.estado) return
    onToggleStatus(p.id, nuevo)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setLastChange({ id: p.id, nombre: p.razon_social, previo: p.estado as Estado, nuevo })
    undoTimer.current = setTimeout(() => setLastChange(null), UNDO_WINDOW_MS)
  }

  const handleUndo = () => {
    if (!lastChange) return
    onToggleStatus(lastChange.id, lastChange.previo)
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = null
    setLastChange(null)
  }

  return (
    <div className="space-y-4">
      {lastChange && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#181B22] border border-[#2D3748] text-xs text-[#CBD5E1]"
        >
          <span>
            <span className="font-semibold text-[#F1F5F9]">{lastChange.nombre}</span> ahora está{" "}
            {lastChange.nuevo.toLowerCase()}.
          </span>
          <button
            type="button"
            onClick={handleUndo}
            className={`inline-flex items-center gap-1.5 font-semibold text-[#A78BFA] hover:text-[#C4B5FD] cursor-pointer shrink-0 rounded px-1 ${focusRing}`}
          >
            <Undo2 size={13} aria-hidden="true" />
            Deshacer
          </button>
        </div>
      )}

      {/* ── Card contenedor de la tabla ── */}
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table
            aria-label="Proveedores"
            className="w-full text-left text-[13px] border-collapse"
          >
            <thead>
              <tr className="border-b border-[#262D3D] text-xs font-medium text-[#94A3B8] bg-[#111318]">
                <th scope="col" className="py-3 px-4">
                  Proveedor
                </th>
                <th scope="col" className="py-3 px-4">
                  Catálogo
                </th>
                <th scope="col" className="py-3 px-4">
                  Contacto
                </th>
                <th scope="col" className="py-3 px-4">
                  Estado
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {providers.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNAS} className="py-6">
                    <EmptyState
                      icon={Truck}
                      title={
                        isFiltered
                          ? "No se encontraron proveedores coincidentes"
                          : "Aún no tienes proveedores registrados"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o los filtros de tipo y estado."
                          : "Comienza registrando aliados y proveedores para gestionar suministros y recepciones."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : onEmptyAction
                            ? { label: "Crear primer proveedor", onClick: onEmptyAction }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? { label: "Crear proveedor", onClick: onEmptyAction }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                providers.map((p) => {
                  const telefono = formatTelefono(p.telefono)

                  return (
                    <tr key={p.id} className="hover:bg-[#222734]/40 transition-colors">
                      {/* Proveedor: el nombre abre el detalle; el documento va debajo, sin partirse */}
                      <th scope="row" className="py-3.5 px-4 font-normal min-w-[200px]">
                        <button
                          type="button"
                          onClick={() => onView(p)}
                          title="Ver detalles"
                          className={`text-left font-semibold text-[#F1F5F9] leading-snug hover:text-[#C4B5FD] hover:underline underline-offset-2 cursor-pointer rounded ${focusRing}`}
                        >
                          {p.razon_social}
                        </button>
                        {p.nit_documento && (
                          <p className="text-[11px] text-[#94A3B8] tabular-nums whitespace-nowrap mt-0.5">
                            {p.nit_documento}
                          </p>
                        )}
                      </th>

                      {/* Catálogo: servicios y equipos, compacto y expandible */}
                      <td className="py-3.5 px-4">
                        <Catalogo
                          nombre={p.razon_social}
                          servicios={p.servicios ?? []}
                          equipos={p.equipos ?? []}
                          expanded={expandedIds.has(p.id)}
                          onToggle={() => toggleExpanded(p.id)}
                        />
                      </td>

                      {/* Contacto: correo y teléfono apilados, con enlaces directos */}
                      <td className="py-3.5 px-4 min-w-[190px]">
                        {p.correo && (
                          <a
                            href={`mailto:${p.correo}`}
                            title={p.correo}
                            className={`block max-w-[240px] truncate text-[#CBD5E1] hover:text-white hover:underline underline-offset-2 rounded ${focusRing}`}
                          >
                            {p.correo}
                          </a>
                        )}
                        {telefono && (
                          <a
                            href={`tel:${(p.telefono || "").replace(/[^\d+]/g, "")}`}
                            className={`block text-[12px] text-[#94A3B8] tabular-nums whitespace-nowrap hover:text-white hover:underline underline-offset-2 mt-0.5 rounded ${focusRing}`}
                          >
                            {telefono}
                          </a>
                        )}
                        {!p.correo && !telefono && (
                          <span className="text-[11px] text-[#94A3B8]">Sin contacto</span>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <TableStatusSelect
                          currentStatus={p.estado}
                          options={["Activo", "Inactivo"]}
                          onStatusChange={(newEst) =>
                            handleStatusChange(p, newEst as Estado)
                          }
                        />
                      </td>

                      {/* Acciones: objetivos de 32 px; eliminar separado del resto */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onView(p)}
                            title="Ver detalles"
                            aria-label={`Ver detalles de ${p.razon_social}`}
                            className={`p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer ${focusRing}`}
                          >
                            <Eye size={16} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(p)}
                            title="Editar proveedor"
                            aria-label={`Editar ${p.razon_social}`}
                            className={`p-2 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer ${focusRing}`}
                          >
                            <Edit2 size={16} aria-hidden="true" />
                          </button>
                          <span
                            aria-hidden="true"
                            className="w-px h-5 bg-[#262D3D] mx-1"
                          />
                          <button
                            type="button"
                            onClick={() => onDelete(p)}
                            title="Eliminar proveedor"
                            aria-label={`Eliminar ${p.razon_social}`}
                            className={`p-2 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/20 rounded-lg transition-colors cursor-pointer ${focusRing}`}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemLabel="proveedores"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}