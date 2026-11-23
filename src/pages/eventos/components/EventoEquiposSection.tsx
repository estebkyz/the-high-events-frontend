import { useState, useMemo, useRef, useEffect } from "react"
import { Plus, Trash2, Boxes, Undo2 } from "lucide-react"
import { AVAILABLE_EQUIPMENT } from "../data"
import type { Dispatch, SetStateAction } from "react"

interface EventoEquiposSectionProps {
  equiposAsignados: string[]
  setEquiposAsignados: Dispatch<SetStateAction<string[]>>
}

const UNDO_WINDOW_MS = 6000

export function EventoEquiposSection({
  equiposAsignados,
  setEquiposAsignados,
}: EventoEquiposSectionProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [lastRemoved, setLastRemoved] = useState<{
    id: string
    nombre: string
    index: number
  } | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current)
    }
  }, [])

  const assignedItems = useMemo(() => {
    return equiposAsignados
      .map((id) => AVAILABLE_EQUIPMENT.find((eq) => eq.id === id))
      .filter((eq): eq is (typeof AVAILABLE_EQUIPMENT)[number] => Boolean(eq))
  }, [equiposAsignados])

  const availableToAdd = useMemo(() => {
    return AVAILABLE_EQUIPMENT.filter((eq) => !equiposAsignados.includes(eq.id))
  }, [equiposAsignados])

  const clearUndo = () => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = null
    setLastRemoved(null)
  }

  const handleAdd = (id: string) => {
    if (equiposAsignados.includes(id)) return
    setEquiposAsignados((prev) => [...prev, id])
    if (lastRemoved?.id === id) clearUndo()
  }

  const handleRemove = (id: string, nombre: string) => {
    const index = equiposAsignados.indexOf(id)
    setEquiposAsignados((prev) => prev.filter((item) => item !== id))
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setLastRemoved({ id, nombre, index })
    undoTimer.current = setTimeout(clearUndo, UNDO_WINDOW_MS)
  }

  const handleRestoreRemoved = () => {
    if (!lastRemoved) return
    const { id, index } = lastRemoved
    if (equiposAsignados.includes(id)) {
      clearUndo()
      return
    }
    const at = Math.min(
      index < 0 ? equiposAsignados.length : index,
      equiposAsignados.length,
    )
    const next = [...equiposAsignados]
    next.splice(at, 0, id)
    setEquiposAsignados(next)
    clearUndo()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Columna Izquierda */}
      <div className="lg:col-span-3 space-y-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#F8FAFC]">Equipos</h2>
        </div>

        <button
          type="button"
          onClick={() => setShowSelector((prev) => !prev)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors shadow-sm shadow-[#2563EB]/25 flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1117]"
        >
          <Plus size={15} className="text-[#F8FAFC]" />
          <span>{showSelector ? "Ocultar" : "Agregar"}</span>
        </button>
      </div>

      {/* Columna Derecha */}
      <div className="lg:col-span-9 space-y-4">
        {/* Selector Desplegable de Equipos */}
        {showSelector && (
          <div className="p-4 bg-[#181B22] rounded-2xl space-y-3 animate-fade-in shadow-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[#F1F5F9]">
                Equipos disponibles
              </h4>
              <button
                type="button"
                onClick={() => setShowSelector(false)}
                className="text-xs text-[#94A3B8] hover:text-white cursor-pointer"
              >
                Cerrar
              </button>
            </div>
            {availableToAdd.length === 0 ? (
              <div className="py-6 px-4 rounded-xl bg-[#111318] border border-[#262D3D] border-dashed text-center">
                <p className="text-xs font-medium text-[#CBD5E1]">
                  No hay más equipos disponibles para agregar
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-1">
                  Todos los equipos del inventario ya fueron asignados a este evento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {availableToAdd.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#111318] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 text-[#A78BFA] flex items-center justify-center shrink-0">
                        <Boxes size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#F1F5F9] truncate">
                          {eq.nombre}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="font-mono text-[10px] text-[#A78BFA] font-medium">
                            {eq.codigo}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-[#222734] text-[#94A3B8]">
                            {eq.categoria}
                          </span>
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              eq.propiedad === "Alquilado"
                                ? "bg-[#F59E0B]/15 text-[#FBBF24]"
                                : "bg-[#10B981]/15 text-[#10B981]"
                            }`}
                          >
                            {eq.propiedad === "Alquilado" && eq.proveedor_nombre
                              ? `Alquilado · ${eq.proveedor_nombre}`
                              : eq.propiedad}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAdd(eq.id)}
                      className="p-1.5 rounded-lg bg-[#7C3AED]/20 hover:bg-[#7C3AED] text-[#A78BFA] hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Asignar al evento"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Deshacer eliminación temporal */}
        {lastRemoved && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-3 bg-[#181B22] border border-[#2D3748] rounded-xl px-4 py-2.5"
          >
            <span>Equipo retirado del evento.</span>
            <button
              type="button"
              onClick={handleRestoreRemoved}
              className="text-xs font-semibold text-[#A78BFA] hover:text-[#C4B5FD] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Undo2 size={13} />
              <span>Deshacer</span>
            </button>
          </div>
        )}

        {/* Lista de equipos asignados o recuadro vacío */}
        {assignedItems.length === 0 ? (
          !showSelector && (
            <div className="bg-[#181B22] border border-[#262D3D] border-dashed rounded-2xl p-8 flex flex-col items-center text-center gap-3">
              <Boxes
                size={22}
                className="text-[#94A3B8]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-[#CBD5E1]">
                  Aún no hay equipos asignados en este evento
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Es obligatorio despachar y asignar equipos de bodega para
                  garantizar la cobertura técnica del evento.
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assignedItems.map((eq) => (
              <div
                key={eq.id}
                className="p-3.5 rounded-2xl bg-[#181B22] transition-colors flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 text-[#A78BFA] flex items-center justify-center shrink-0">
                    <Boxes size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#F1F5F9] truncate">
                      {eq.nombre}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="font-mono text-[10px] text-[#A78BFA] font-medium">
                        {eq.codigo}
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-[#222734] text-[#94A3B8]">
                        {eq.categoria}
                      </span>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          eq.propiedad === "Alquilado"
                            ? "bg-[#F59E0B]/15 text-[#FBBF24]"
                            : "bg-[#10B981]/15 text-[#10B981]"
                        }`}
                      >
                        {eq.propiedad === "Alquilado" && eq.proveedor_nombre
                          ? `Alquilado · ${eq.proveedor_nombre}`
                          : eq.propiedad}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(eq.id, eq.nombre)}
                  title="Retirar equipo"
                  className="p-2 text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
