import { usePagination } from "../../hooks/usePagination"
import React, { useState, useMemo } from "react"
import {
  LayoutGrid,
  List,
  BookOpen,
  CheckSquare,
  Clock,
  Trash2,
} from "lucide-react"
import { PageHeader } from "../../components/PageHeader"
import { CustomSelect } from "../../components/CustomSelect"
import { IndexTabs } from "../../components/IndexTabs"
import { BulkActionsBar } from "../../components/BulkActionsBar"
import { useToast } from "../../components/Toast"
import type {
  TareaItem,
  TareaDrawerMode,
  TareaFormData,
  TareaCatalogoFormValues,
  EstadoTarea,
  Fase,
} from "./types"
import {
  getEventoTareasStore,
  saveEventoTareasStore,
  FASE_OPTIONS,
} from "./data"
import {
  getTareasCatalogo,
  addTareaCatalogo,
  updateTareaCatalogo,
  deleteTareaCatalogo,
  getEmpleadosCatalogo,
  type TareaCatalogoItem,
} from "../eventos/catalogStore"
import { EVENTOS_MOCK } from "../eventos/data"
import type { FaseTareaEvento } from "../eventos/types"
import { TareaKanban } from "./components/TareaKanban"
import { TareaTable } from "./components/TareaTable"
import { TareaCatalogoView } from "./components/TareaCatalogoView"
import { TareaDetailDrawer } from "./drawers/TareaDetailDrawer"
import { TareaFormDrawer } from "./drawers/TareaFormDrawer"
import { TareaCatalogoFormDrawer } from "./drawers/TareaCatalogoFormDrawer"

function mapFaseToEventoFase(f: Fase): FaseTareaEvento {
  return f
}

function mapEventoFaseToTareaFase(f: string): Fase {
  if (
    f === "Planificación" ||
    f === "Montaje" ||
    f === "Ejecución" ||
    f === "Desmontaje"
  ) {
    return f
  }
  return "Montaje"
}

export default function TareasPage() {
  const [tasks, setTasksState] = useState<TareaItem[]>(() =>
    getEventoTareasStore(),
  )
  const [catalogo, setCatalogo] = useState<TareaCatalogoItem[]>(() =>
    getTareasCatalogo(),
  )
  const [viewMode, setViewMode] = useState<"kanban" | "table" | "catalogo">(
    "kanban",
  )
  const toast = useToast()

  const setTasks: React.Dispatch<React.SetStateAction<TareaItem[]>> = (
    updater,
  ) => {
    setTasksState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater
      saveEventoTareasStore(next)
      return next
    })
  }

  // Selection for Bulk Actions (Shopify Polaris)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filters
  const [filterEvento, setFilterEvento] = useState("Todos")
  const [filterFase, setFilterFase] = useState("Todos")
  const [filterEmpleado, setFilterEmpleado] = useState("Todos")
  const [filterPrioridad, setFilterPrioridad] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  const [drawerMode, setDrawerMode] = useState<TareaDrawerMode>("none")
  const [selectedTask, setSelectedTask] = useState<TareaItem | null>(null)
  const [editForm, setEditForm] = useState<TareaFormData>({})
  const [catalogoForm, setCatalogoForm] = useState<TareaCatalogoFormValues>({
    nombre_tarea: "",
    descripcion: "",
    fase_sugerida: "Montaje",
  })

  const statusCounts = useMemo(() => {
    return {
      Todos: tasks.length,
      Pendiente: tasks.filter((t) => t.estado === "Pendiente").length,
      "En Proceso": tasks.filter((t) => t.estado === "En Proceso").length,
      Completada: tasks.filter((t) => t.estado === "Completada").length,
    }
  }, [tasks])

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todas", count: statusCounts.Todos },
      { id: "Pendiente", label: "Pendientes", count: statusCounts.Pendiente },
      {
        id: "En Proceso",
        label: "En proceso",
        count: statusCounts["En Proceso"],
      },
      {
        id: "Completada",
        label: "Completadas",
        count: statusCounts.Completada,
      },
    ],
    [statusCounts],
  )

  const eventos = useMemo(() => {
    const names = new Set<string>([
      ...EVENTOS_MOCK.map((e) => e.nombre),
      ...tasks.map((t) => t.evento),
    ])
    return Array.from(names)
  }, [tasks])

  const empleados = useMemo(() => {
    const empCatalog = getEmpleadosCatalogo()
    const names = new Set<string>([
      ...empCatalog.map((e) => e.nombre),
      ...tasks.map((t) => t.responsable),
    ])
    return Array.from(names)
  }, [tasks])

  const eventoOptions = useMemo(
    () => [
      { label: "Todos los Eventos", value: "Todos" },
      ...eventos.map((e) => ({ label: e, value: e })),
    ],
    [eventos],
  )

  const faseOptions = useMemo(
    () => [{ label: "Todas las Fases", value: "Todos" }, ...FASE_OPTIONS],
    [],
  )

  const empleadoOptions = useMemo(
    () => [
      { label: "Todos los Empleados", value: "Todos" },
      ...empleados.map((emp) => ({ label: emp, value: emp })),
    ],
    [empleados],
  )

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const q = search.toLowerCase()
      if (
        q &&
        !t.tarea.toLowerCase().includes(q) &&
        !t.evento.toLowerCase().includes(q) &&
        !t.responsable.toLowerCase().includes(q)
      ) {
        return false
      }
      if (filterEvento !== "Todos" && t.evento !== filterEvento) return false
      if (filterFase !== "Todos" && t.fase !== filterFase) return false
      if (filterEmpleado !== "Todos" && t.responsable !== filterEmpleado)
        return false
      if (filterPrioridad !== "Todos" && t.prioridad !== filterPrioridad)
        return false
      if (
        viewMode === "table" &&
        filterEstado !== "Todos" &&
        t.estado !== filterEstado
      )
        return false
      return true
    })
  }, [
    tasks,
    search,
    filterEvento,
    filterFase,
    filterEmpleado,
    filterPrioridad,
    filterEstado,
    viewMode,
  ])

  const filteredCatalogo = useMemo(() => {
    return catalogo.filter((c) => {
      const q = search.toLowerCase()
      if (
        q &&
        !c.nombre_tarea.toLowerCase().includes(q) &&
        !c.descripcion.toLowerCase().includes(q) &&
        !c.codigo.toLowerCase().includes(q)
      ) {
        return false
      }
      if (
        filterFase !== "Todos" &&
        mapEventoFaseToTareaFase(c.fase_sugerida) !== filterFase
      ) {
        return false
      }
      return true
    })
  }, [catalogo, search, filterFase])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedTasks,
  } = usePagination(filteredTasks)

  const updateEstado = (id: string, nuevoEstado: EstadoTarea) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t)),
    )
    setSelectedTask((prev) =>
      prev && prev.id === id ? { ...prev, estado: nuevoEstado } : prev,
    )
    toast.info(`Estado actualizado a ${nuevoEstado}`)
  }

  const openView = (task: TareaItem) => {
    setSelectedTask(task)
    setDrawerMode("view")
  }

  const openEdit = (task: TareaItem) => {
    setSelectedTask(task)
    setEditForm({ ...task })
    setDrawerMode("edit")
  }

  const openCreateAssignment = (preselectedCat?: TareaCatalogoItem) => {
    const defaultCat = preselectedCat || catalogo[0]
    const defaultEv = EVENTOS_MOCK[0]
    const empCatalog = getEmpleadosCatalogo()
    const defaultEmp = empCatalog[0]

    setSelectedTask(null)
    setEditForm({
      tarea_id: defaultCat?.id || "1",
      codigo_tarea: defaultCat?.codigo || "TAR-001",
      tarea: defaultCat?.nombre_tarea || "",
      descripcion_catalogo: defaultCat?.descripcion || "",
      evento: defaultEv?.nombre || eventos[0] || "Festival de Música 360",
      evento_id: defaultEv?.id || "1",
      fase: defaultCat
        ? mapEventoFaseToTareaFase(defaultCat.fase_sugerida)
        : "Montaje",
      responsable: defaultEmp?.nombre || empleados[0] || "Carlos Alberto Ruiz Montoya",
      responsable_id: defaultEmp?.id || "1",
      cargo_responsable: defaultEmp?.cargo || "Ingeniero de Audio",
      prioridad: "Alta",
      fechaLimite:
        defaultEv?.hora_inicio.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      hora_inicio_estimada: "08:00",
      hora_fin_estimada: "13:00",
      estado: "Pendiente",
      notas: defaultCat?.descripcion || "",
    })
    setDrawerMode("new")
  }

  const openCreateCatalogo = () => {
    setCatalogoForm({
      nombre_tarea: "",
      descripcion: "",
      fase_sugerida: "Montaje",
    })
    setDrawerMode("new_catalogo")
  }

  const openEditCatalogo = (item: TareaCatalogoItem) => {
    setCatalogoForm({
      id: item.id,
      codigo: item.codigo,
      nombre_tarea: item.nombre_tarea,
      descripcion: item.descripcion,
      fase_sugerida: mapEventoFaseToTareaFase(item.fase_sugerida),
    })
    setDrawerMode("edit_catalogo")
  }

  const closeDrawer = () => {
    setDrawerMode("none")
    setSelectedTask(null)
    setEditForm({})
  }

  const handleDelete = (r: TareaItem) => {
    if (confirm(`¿Eliminar la tarea asignada "${r.tarea}" de ${r.evento}?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== r.id))
      setSelectedIds((prev) => prev.filter((id) => id !== r.id))
      toast.success("Asignación de tarea eliminada")
    }
  }

  const handleDeleteCatalogo = (item: TareaCatalogoItem) => {
    const inUse = tasks.some((t) => t.tarea_id === item.id)
    if (inUse) {
      toast.error(
        `No puedes eliminar "${item.nombre_tarea}" porque está asignada a un evento en curso.`,
      )
      return
    }
    if (confirm(`¿Eliminar "${item.nombre_tarea}" del catálogo maestro?`)) {
      const updated = deleteTareaCatalogo(item.id)
      setCatalogo(updated)
      toast.success("Plantilla eliminada del catálogo de tareas")
    }
  }

  const handleCreateCatalogTaskInline = (
    nombre: string,
    faseActual: Fase,
  ): TareaCatalogoItem => {
    const created = addTareaCatalogo({
      nombre_tarea: nombre,
      descripcion: `Actividad técnica estándar (${faseActual}).`,
      fase_sugerida: mapFaseToEventoFase(faseActual),
    })
    setCatalogo(getTareasCatalogo())
    toast.success(`"${created.nombre_tarea}" agregada al catálogo maestro`)
    return created
  }

  const handleCatalogoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!catalogoForm.nombre_tarea.trim()) {
      toast.error("El nombre de la tarea estándar es obligatorio")
      return
    }
    if (drawerMode === "edit_catalogo" && catalogoForm.id) {
      const updated = updateTareaCatalogo(catalogoForm.id, {
        nombre_tarea: catalogoForm.nombre_tarea.trim(),
        descripcion: catalogoForm.descripcion.trim(),
        fase_sugerida: mapFaseToEventoFase(catalogoForm.fase_sugerida),
      })
      setCatalogo(updated)
      // Propagar cambio de nombre a las tareas en curso vinculadas
      setTasks((prev) =>
        prev.map((t) =>
          t.tarea_id === catalogoForm.id
            ? {
                ...t,
                tarea: catalogoForm.nombre_tarea.trim(),
                descripcion_catalogo: catalogoForm.descripcion.trim(),
              }
            : t,
        ),
      )
      toast.success("Plantilla del catálogo actualizada")
    } else {
      addTareaCatalogo({
        nombre_tarea: catalogoForm.nombre_tarea.trim(),
        descripcion: catalogoForm.descripcion.trim(),
        fase_sugerida: mapFaseToEventoFase(catalogoForm.fase_sugerida),
      })
      setCatalogo(getTareasCatalogo())
      toast.success(
        "Tarea agregada al catálogo (disponible al crear eventos)",
      )
    }
    closeDrawer()
  }

  // Bulk actions handlers (Shopify Polaris)
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleToggleSelectAll = () => {
    const pageIds = paginatedTasks.map((t) => t.id)
    const allSelected =
      pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  const resetFilters = () => {
    setSearch("")
    setFilterEvento("Todos")
    setFilterFase("Todos")
    setFilterEmpleado("Todos")
    setFilterPrioridad("Todos")
    setFilterEstado("Todos")
    setCurrentPage(1)
  }

  const isFiltered = Boolean(
    search ||
      filterEvento !== "Todos" ||
      filterFase !== "Todos" ||
      filterEmpleado !== "Todos" ||
      filterPrioridad !== "Todos" ||
      filterEstado !== "Todos",
  )

  const handleBulkComplete = () => {
    setTasks((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) ? { ...t, estado: "Completada" } : t,
      ),
    )
    toast.success(`${selectedIds.length} tarea(s) marcadas como completadas`)
    setSelectedIds([])
  }

  const handleBulkEnProceso = () => {
    setTasks((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id) ? { ...t, estado: "En Proceso" } : t,
      ),
    )
    toast.info(`${selectedIds.length} tarea(s) puestas en proceso`)
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    if (confirm(`¿Eliminar las ${selectedIds.length} tareas seleccionadas?`)) {
      setTasks((prev) => prev.filter((t) => !selectedIds.includes(t.id)))
      toast.success(`${selectedIds.length} tarea(s) eliminadas`)
      setSelectedIds([])
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.tarea?.trim()) {
      toast.error("Debes seleccionar una tarea del catálogo")
      return
    }

    if (drawerMode === "edit" && selectedTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id ? ({ ...t, ...editForm } as TareaItem) : t,
        ),
      )
      toast.success("Asignación de tarea actualizada")
    } else {
      const nueva: TareaItem = {
        id: String(Date.now()),
        tarea_id: editForm.tarea_id || "1",
        codigo_tarea: editForm.codigo_tarea || "TAR-001",
        tarea: editForm.tarea.trim(),
        descripcion_catalogo: editForm.descripcion_catalogo,
        evento: editForm.evento || "Festival de Música 360",
        evento_id: editForm.evento_id,
        fase: (editForm.fase as Fase) || "Montaje",
        responsable: editForm.responsable || "Carlos Alberto Ruiz Montoya",
        responsable_id: editForm.responsable_id,
        cargo_responsable: editForm.cargo_responsable,
        prioridad: editForm.prioridad || "Media",
        fechaLimite:
          editForm.fechaLimite || new Date().toISOString().split("T")[0],
        hora_inicio_estimada: editForm.hora_inicio_estimada || "08:00",
        hora_fin_estimada: editForm.hora_fin_estimada || "13:00",
        estado: editForm.estado || "Pendiente",
        notas: editForm.notas || "",
      }
      setTasks([nueva, ...tasks])
      toast.success("Tarea asignada al evento exitosamente")
    }
    closeDrawer()
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title="Tareas"
          actionLabel={
            viewMode === "catalogo"
              ? "Crear tarea"
              : "Asignar tarea"
          }
          onAction={
            viewMode === "catalogo"
              ? openCreateCatalogo
              : () => openCreateAssignment()
          }
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder={
            viewMode === "catalogo"
              ? "Buscar"
              : "Buscar"
          }
          activeFilterCount={
            (filterEvento !== "Todos" ? 1 : 0) +
            (filterFase !== "Todos" ? 1 : 0) +
            (filterEmpleado !== "Todos" ? 1 : 0) +
            (filterPrioridad !== "Todos" ? 1 : 0)
          }
          onResetFilters={() => {
            setFilterEvento("Todos")
            setFilterFase("Todos")
            setFilterEmpleado("Todos")
            setFilterPrioridad("Todos")
            setCurrentPage(1)
          }}
          extraControls={
            <div className="flex items-center bg-[#181B22] border border-[#262D3D] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-[#7C3AED] text-white shadow-xs font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
                title="Tareas en Curso (Tablero Kanban)"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">En Curso (Kanban)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#7C3AED] text-white shadow-xs font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
                title="Tareas en Curso (Tabla)"
              >
                <List size={14} />
                <span className="hidden sm:inline">En Curso (Tabla)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("catalogo")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "catalogo"
                    ? "bg-[#7C3AED] text-white shadow-xs font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
                title="Catálogo Maestro de Tareas (Plantillas asignables al crear eventos)"
              >
                <BookOpen size={14} />
                <span className="hidden sm:inline">
                  Catálogo ({catalogo.length})
                </span>
              </button>
            </div>
          }
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Evento
            </label>
            <CustomSelect
              value={filterEvento}
              onChange={(val) => {
                setFilterEvento(val)
                setCurrentPage(1)
              }}
              options={eventoOptions}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Fase del Evento
            </label>
            <CustomSelect
              value={filterFase}
              onChange={(val) => {
                setFilterFase(val)
                setCurrentPage(1)
              }}
              options={faseOptions}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Responsable
            </label>
            <CustomSelect
              value={filterEmpleado}
              onChange={(val) => {
                setFilterEmpleado(val)
                setCurrentPage(1)
              }}
              options={empleadoOptions}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Prioridad
            </label>
            <div className="grid grid-cols-4 gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]">
              {(["Todos", "Alta", "Media", "Baja"] as const).map((prio) => (
                <button
                  key={prio}
                  type="button"
                  onClick={() => {
                    setFilterPrioridad(prio)
                    setCurrentPage(1)
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer text-center truncate ${
                    filterPrioridad === prio
                      ? "bg-[#7C3AED] text-white font-semibold"
                      : "text-[#94A3B8] hover:text-[#F1F5F9]"
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>
        </PageHeader>

        {viewMode === "catalogo" ? (
          <TareaCatalogoView
            catalogo={filteredCatalogo}
            assignedTasks={tasks}
            isFiltered={Boolean(search || filterFase !== "Todos")}
            onResetFilters={resetFilters}
            onCreateCatalogo={openCreateCatalogo}
            onEditCatalogo={openEditCatalogo}
            onDeleteCatalogo={handleDeleteCatalogo}
            onAssignToEvent={(catItem) => openCreateAssignment(catItem)}
            onViewAssignedTask={openView}
          />
        ) : viewMode === "table" ? (
          <div className="space-y-4">
            <IndexTabs
              tabs={quickTabs}
              activeTab={filterEstado}
              onTabChange={(newTab) => {
                setFilterEstado(newTab)
                setCurrentPage(1)
              }}
            />
            <TareaTable
              tasks={paginatedTasks}
              totalCount={filteredTasks.length}
              pageSize={pageSize}
              currentPage={currentPage}
              totalPages={totalPages}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              onEmptyAction={() => openCreateAssignment()}
              onResetFilters={resetFilters}
              isFiltered={isFiltered}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setCurrentPage(1)
              }}
              onPageChange={setCurrentPage}
              onUpdateEstado={updateEstado}
              onView={openView}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <TareaKanban tasks={filteredTasks} onOpenView={openView} />
        )}
      </main>

      {/* Bulk Actions Bar (Shopify Polaris) */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        totalCount={filteredTasks.length}
        onClearSelection={() => setSelectedIds([])}
        actions={[
          {
            label: "Completar",
            onClick: handleBulkComplete,
            variant: "success",
            icon: CheckSquare,
          },
          {
            label: "En proceso",
            onClick: handleBulkEnProceso,
            variant: "secondary",
            icon: Clock,
          },
          {
            label: "Eliminar",
            onClick: handleBulkDelete,
            variant: "danger",
            icon: Trash2,
          },
        ]}
      />

      {/* Detail Drawer (`evento_tarea`) */}
      <TareaDetailDrawer
        isOpen={drawerMode === "view"}
        task={selectedTask}
        onClose={closeDrawer}
        onUpdateEstado={updateEstado}
        onOpenEdit={openEdit}
      />

      {/* Assignment Form Drawer (`evento_tarea`) */}
      <TareaFormDrawer
        isOpen={drawerMode === "new" || drawerMode === "edit"}
        mode={drawerMode === "edit" ? "edit" : "new"}
        selectedTask={selectedTask}
        catalogoTareas={catalogo}
        onCreateCatalogTaskInline={handleCreateCatalogTaskInline}
        editForm={editForm}
        setEditForm={setEditForm}
        onClose={closeDrawer}
        onSubmit={handleFormSubmit}
      />

      {/* Master Catalog Form Drawer (`tarea`) */}
      <TareaCatalogoFormDrawer
        isOpen={
          drawerMode === "new_catalogo" || drawerMode === "edit_catalogo"
        }
        mode={drawerMode === "edit_catalogo" ? "edit_catalogo" : "new_catalogo"}
        form={catalogoForm}
        setForm={setCatalogoForm}
        onClose={closeDrawer}
        onSubmit={handleCatalogoSubmit}
      />
    </div>
  )
}
