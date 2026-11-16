import { useState, useMemo, useRef, useEffect } from "react"
import { Plus, Trash2, UserPlus, X, Undo2, BookOpen } from "lucide-react"
import type { AsignacionesMap, FaseTareaEvento } from "../types"
import { FASES_TAREA } from "../types"
import {
  getEmpleadosCatalogo,
  getTareasCatalogo,
  addTareaCatalogo,
  type TareaCatalogoItem,
} from "../catalogStore"
import {
  CustomSelect,
  type SelectOption,
} from "../../../components/CustomSelect"
import type { Dispatch, SetStateAction } from "react"

interface EventoStaffSectionProps {
  assignments: AsignacionesMap
  setAssignments: Dispatch<SetStateAction<AsignacionesMap>>
  onGoToCreateEmpleado: (initialName?: string) => void
}

const UNDO_WINDOW_MS = 6000

/**
 * Sección 3: Empleados y Tareas Operativas (`evento_tarea` <- `tarea` + `empleado`).
 *
 * Conecta directamente con el Catálogo Maestro de Tareas (`tarea` en el .mwb):
 * - Al asignar un empleado al evento, se selecciona qué tarea del catálogo ejecutará.
 * - Seleccionar una tarea del catálogo autocompleta su `fase_sugerida` y muestra su descripción técnica.
 * - Permite crear una nueva tarea en el catálogo maestro (`tarea`) directamente desde el selector.
 */
export function EventoStaffSection({
  assignments,
  setAssignments,
  onGoToCreateEmpleado,
}: EventoStaffSectionProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [tareasCatalogo, setTareasCatalogo] = useState<TareaCatalogoItem[]>(() =>
    getTareasCatalogo(),
  )
  const [lastRemoved, setLastRemoved] = useState<{
    empId: string
    nombre: string
  } | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const catalog = getEmpleadosCatalogo()

  useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current)
    }
  }, [])

  const assignedList = useMemo(() => {
    return Object.entries(assignments)
      .filter(([, sel]) => sel.checked)
      .map(([empId, sel]) => {
        const emp = catalog.find((c) => c.id === empId)
        const tareaInfo =
          tareasCatalogo.find((t) => t.id === sel.tarea_id) ||
          tareasCatalogo[0]
        return {
          empId,
          nombre: emp?.nombre || "Empleado",
          cargo: emp?.cargo || "Técnico",
          telefono: emp?.telefono,
          correo: emp?.correo,
          tarea_id: sel.tarea_id,
          tarea_codigo: tareaInfo?.codigo || "TAR-001",
          tarea_descripcion: tareaInfo?.descripcion,
          fase: sel.fase,
        }
      })
  }, [assignments, catalog, tareasCatalogo])

  const employeeOptions = useMemo<SelectOption[]>(() => {
    return catalog.map((emp) => {
      const isAssigned = Boolean(assignments[emp.id]?.checked)
      return {
        label: emp.nombre,
        value: emp.id,
        badge: emp.cargo,
        sublabel: isAssigned
          ? "(Ya asignado)"
          : emp.telefono || emp.correo || "Equipo The High Events",
      }
    })
  }, [catalog, assignments])

  const tareaOptions = useMemo<SelectOption[]>(
    () =>
      tareasCatalogo.map((t) => ({
        label: t.nombre_tarea,
        value: t.id,
        badge: `${t.codigo} · ${t.fase_sugerida}`,
        sublabel: t.descripcion,
      })),
    [tareasCatalogo],
  )

  const faseOptions = useMemo<SelectOption[]>(
    () => FASES_TAREA.map((f) => ({ label: f, value: f })),
    [],
  )

  const clearUndo = () => {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = null
    setLastRemoved(null)
  }

  const handleAssignEmployee = (empId: string) => {
    const defaultTask = tareasCatalogo[0]
    setAssignments((prev) => ({
      ...prev,
      [empId]: {
        checked: true,
        tarea_id: prev[empId]?.tarea_id || defaultTask?.id || "1",
        fase:
          prev[empId]?.fase || defaultTask?.fase_sugerida || "Montaje",
      },
    }))
    if (lastRemoved?.empId === empId) clearUndo()
    setShowSelector(false)
  }

  const handleRemoveEmployee = (empId: string, nombre: string) => {
    setAssignments((prev) => ({
      ...prev,
      [empId]: { ...prev[empId], checked: false },
    }))
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setLastRemoved({ empId, nombre })
    undoTimer.current = setTimeout(() => setLastRemoved(null), UNDO_WINDOW_MS)
  }

  const handleUndoRemove = () => {
    if (!lastRemoved) return
    const { empId } = lastRemoved
    setAssignments((prev) => ({
      ...prev,
      [empId]: { ...prev[empId], checked: true },
    }))
    clearUndo()
  }

  const handleSelectTareaCatalogo = (empId: string, newTaskId: string) => {
    const selectedCatalogTask = tareasCatalogo.find((t) => t.id === newTaskId)
    setAssignments((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        tarea_id: newTaskId,
        fase: selectedCatalogTask?.fase_sugerida || prev[empId]?.fase || "Montaje",
      },
    }))
  }

  const handleCreateTareaInCatalogo = (empId: string, query: string) => {
    const cleanName = query.trim()
    if (!cleanName) return
    const currentFase = assignments[empId]?.fase || "Montaje"
    const created = addTareaCatalogo({
      nombre_tarea: cleanName,
      descripcion: `Tarea operativa creada al planificar evento (${currentFase}).`,
      fase_sugerida: currentFase,
    })
    setTareasCatalogo(getTareasCatalogo())
    setAssignments((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        tarea_id: created.id,
        fase: created.fase_sugerida,
      },
    }))
  }

  const handleUpdateFase = (empId: string, value: FaseTareaEvento) => {
    setAssignments((prev) => ({
      ...prev,
      [empId]: { ...prev[empId], fase: value },
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-[#262D3D]">
      {/* Columna izquierda: contexto + acción principal */}
      <div className="lg:col-span-3 space-y-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#F8FAFC]">
            Empleados
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowSelector((prev) => !prev)}
          aria-expanded={showSelector}
          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors shadow-sm shadow-[#2563EB]/25 flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1117]"
        >
          <Plus size={15} className="text-[#F8FAFC]"/>
          <span>{showSelector ? "Ocultar" : "Agregar"}</span>
        </button>

        {assignedList.length > 0 && (
          <p className="text-xs text-[#94A3B8]">
            {assignedList.length}{" "}
            {assignedList.length === 1
              ? "tarea asignada al evento"
              : "tareas asignadas al evento"}
          </p>
        )}
      </div>

      {/* Columna derecha: buscador (si está abierto) + tarjetas */}
      <div className="lg:col-span-9 space-y-3">
        {showSelector && (
          <div
            className="bg-[#181B22] rounded-2xl p-3 flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150 shadow-lg"
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowSelector(false)
            }}
          >
            <CustomSelect
              className="flex-1"
              options={employeeOptions}
              searchable={true}
              allowCreate={true}
              clearOnSelect={true}
              placeholder="Buscar"
              createLabel="Crear nuevo empleado"
              onChange={handleAssignEmployee}
              onCreate={(query) => {
                setShowSelector(false)
                onGoToCreateEmpleado(query)
              }}
            />
            <button
              type="button"
              onClick={() => setShowSelector(false)}
              aria-label="Cerrar buscador"
              title="Cerrar buscador"
              className="h-[42px] w-[42px] shrink-0 flex items-center justify-center rounded-xl bg-[#111318] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222734] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Aviso reversible tras quitar un empleado */}
        {lastRemoved && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-3 bg-[#181B22] border border-[#2D3748] rounded-xl px-4 py-2.5"
          >
            <p className="text-xs text-[#CBD5E1]">
              Quitaste a{" "}
              <span className="font-semibold">{lastRemoved.nombre}</span> del
              evento.
            </p>
            <button
              type="button"
              onClick={handleUndoRemove}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#60A5FA] hover:text-[#93C5FD] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] rounded-md px-1"
            >
              <Undo2 size={13} />
              Deshacer
            </button>
          </div>
        )}

        {assignedList.length > 0
          ? assignedList.map((item) => (
              <div
                key={item.empId}
                className="bg-[#181B22] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[#F8FAFC]">
                          {item.nombre}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#222734] text-[11px] font-semibold text-[#CBD5E1]">
                          {item.cargo}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                        {[item.telefono, item.correo]
                          .filter(Boolean)
                          .join(" · ") || "Equipo The High Events"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveEmployee(item.empId, item.nombre)
                    }
                    aria-label={`Quitar a ${item.nombre} del evento`}
                    title="Quitar del evento"
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]/60"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#262D3D]/60">
                  <div>
                    <label className="text-xs font-medium text-[#CBD5E1] flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        Tarea asignada
                      </span>
                      <span className="text-[10px] font-mono text-[#A78BFA]">
                        {item.tarea_codigo}
                      </span>
                    </label>
                    <CustomSelect
                      options={tareaOptions}
                      value={item.tarea_id}
                      searchable={true}
                      allowCreate={true}
                      createLabel="Crear nueva tarea"
                      onChange={(newTaskId) =>
                        handleSelectTareaCatalogo(item.empId, newTaskId)
                      }
                      onCreate={(query) =>
                        handleCreateTareaInCatalogo(item.empId, query)
                      }
                      placeholder="Seleccionar tarea"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#CBD5E1] block mb-1.5">
                      Fase de ejecución en el evento
                    </label>
                    <CustomSelect
                      options={faseOptions}
                      value={item.fase}
                      onChange={(newFase) =>
                        handleUpdateFase(
                          item.empId,
                          newFase as FaseTareaEvento,
                        )
                      }
                      placeholder="Seleccionar fase"
                    />
                  </div>
                </div>
              </div>
            ))
          : !showSelector && (
              <div className="bg-[#181B22] border border-[#262D3D] border-dashed rounded-2xl p-8 flex flex-col items-center text-center gap-3">
                <UserPlus
                  size={22}
                  className="text-[#94A3B8]"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-[#CBD5E1]">
                    Aún no hay empleados asignados en este evento
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Asigna empleados eligiendo las tareas del catálogo
                    maestro para el montaje, prueba de sonido, ejecución o
                    desmontaje.
                  </p>
                </div>
              </div>
            )}
      </div>
    </div>
  )
}
