import { usePagination } from "../../hooks/usePagination"
import { useCrudResource } from "../../hooks/useCrudResource"
import React, { useState, useMemo } from "react"
import { PageHeader } from "../../components/PageHeader"
import { CustomSelect } from "../../components/CustomSelect"
import { IndexTabs } from "../../components/IndexTabs"
import { BulkActionsBar } from "../../components/BulkActionsBar"
import { useToast } from "../../components/Toast"
import { CheckCircle2, Archive, Trash2 } from "lucide-react"
import type {
  IncidenteItem,
  HistoryEntry,
  EstadoIncidente,
  IncidenteFormData,
  Criticidad,
} from "./types"
import {
  INITIAL_INCIDENTS,
  INITIAL_HISTORY,
  ESTADO_FILTER_OPTIONS,
} from "./data"
import { IncidenteTable } from "./components/IncidenteTable"
import { IncidenteDetailDrawer } from "./drawers/IncidenteDetailDrawer"
import { IncidenteFormDrawer } from "./drawers/IncidenteFormDrawer"

export default function IncidentesPage() {
  const { items: incidents, setItems: setIncidents } =
    useCrudResource<IncidenteItem>({
      endpoint: "/incidentes",
      storageKey: "high_events_incidentes_v1",
      initialData: INITIAL_INCIDENTS,
    })
  const [history, setHistory] =
    useState<Record<string, HistoryEntry[]>>(INITIAL_HISTORY)
  const toast = useToast()

  // Selection for Bulk Actions (Shopify Polaris)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filters
  const [filterCriticidad, setFilterCriticidad] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  const statusCounts = useMemo(() => {
    return {
      Todos: incidents.length,
      Reportado: incidents.filter((i) => i.estado === "Reportado").length,
      "En Atención": incidents.filter((i) => i.estado === "En Atención").length,
      Solucionado: incidents.filter((i) => i.estado === "Solucionado").length,
      Escalado: incidents.filter((i) => i.estado === "Escalado").length,
    }
  }, [incidents])

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todos", count: statusCounts.Todos },
      { id: "Reportado", label: "Reportados", count: statusCounts.Reportado },
      {
        id: "En Atención",
        label: "En Atención",
        count: statusCounts["En Atención"],
      },
      { id: "Solucionado", label: "Solucionados", count: statusCounts.Solucionado },
      { id: "Escalado", label: "Escalados", count: statusCounts.Escalado },
    ],
    [statusCounts],
  )

  const [selectedIncident, setSelectedIncident] =
    useState<IncidenteItem | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editForm, setEditForm] = useState<Partial<IncidenteItem>>({})

  // New incident registration form
  const [newIncForm, setNewIncForm] = useState<IncidenteFormData>({})

  // New action form
  const [newActionText, setNewActionText] = useState("")
  const [newActionResponsable, setNewActionResponsable] = useState("")
  const [newActionEstado, setNewActionEstado] =
    useState<EstadoIncidente>("En Atención")

  const filteredData = useMemo(() => {
    return incidents.filter((inc) => {
      const q = search.toLowerCase()
      if (
        q &&
        !inc.titulo.toLowerCase().includes(q) &&
        !inc.evento.toLowerCase().includes(q)
      )
        return false
      if (filterCriticidad !== "Todos" && inc.criticidad !== filterCriticidad)
        return false
      if (filterEstado !== "Todos" && inc.estado !== filterEstado) return false
      return true
    })
  }, [incidents, search, filterCriticidad, filterEstado])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  const openView = (inc: IncidenteItem) => {
    setSelectedIncident(inc)
    setIsEditMode(false)
    setEditForm({})
    setNewActionText("")
    setNewActionResponsable("")
    setNewActionEstado("En Atención")
    setIsDrawerOpen(true)
  }

  const openEdit = (inc: IncidenteItem) => {
    setSelectedIncident(inc)
    setIsEditMode(true)
    setEditForm({ ...inc })
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedIncident(null)
    setIsEditMode(false)
  }

  const handleStatusChange = (id: string, newStatus: EstadoIncidente) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, estado: newStatus } : inc)),
    )
    toast.info(`Estado del incidente actualizado a ${newStatus}`)
  }

  const handleDelete = (r: IncidenteItem) => {
    if (confirm(`¿Eliminar incidente ${r.codigo}?`)) {
      setIncidents((prev) => prev.filter((i) => i.id !== r.id))
      setSelectedIds((prev) => prev.filter((id) => id !== r.id))
      toast.success("Incidente eliminado")
    }
  }

  // Bulk actions handlers (Shopify Polaris)
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleToggleSelectAll = () => {
    const pageIds = paginatedData.map((i) => i.id)
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
    setFilterCriticidad("Todos")
    setFilterEstado("Todos")
    setCurrentPage(1)
  }

  const isFiltered = Boolean(
    search || filterCriticidad !== "Todos" || filterEstado !== "Todos",
  )

  const handleBulkResolve = () => {
    setIncidents((prev) =>
      prev.map((i) =>
        selectedIds.includes(i.id) ? { ...i, estado: "Solucionado" } : i,
      ),
    )
    toast.success(`${selectedIds.length} incidente(s) marcados como solucionados`)
    setSelectedIds([])
  }

  const handleBulkEscalate = () => {
    setIncidents((prev) =>
      prev.map((i) =>
        selectedIds.includes(i.id) ? { ...i, estado: "Escalado" } : i,
      ),
    )
    toast.info(`${selectedIds.length} incidente(s) escalados`)
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    if (
      confirm(`¿Eliminar los ${selectedIds.length} incidentes seleccionados?`)
    ) {
      setIncidents((prev) => prev.filter((i) => !selectedIds.includes(i.id)))
      toast.success(`${selectedIds.length} incidente(s) eliminados`)
      setSelectedIds([])
    }
  }

  const saveEdit = () => {
    if (!selectedIncident) return
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === selectedIncident.id
          ? { ...i, ...editForm } as IncidenteItem
          : i,
      ),
    )
    setSelectedIncident((prev) =>
      prev ? { ...prev, ...editForm } as IncidenteItem : null,
    )
    setIsEditMode(false)
    toast.success("Incidente actualizado correctamente")
  }

  const addAction = () => {
    if (!selectedIncident || !newActionText.trim()) return
    const entry: HistoryEntry = {
      id: String(Date.now()),
      accion: newActionText.trim(),
      responsable: newActionResponsable.trim() || "Coordinador",
      estado: newActionEstado,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      tipo: "action",
    }
    setHistory((prev) => ({
      ...prev,
      [selectedIncident.id]: [...(prev[selectedIncident.id] ?? []), entry],
    }))
    handleStatusChange(selectedIncident.id, newActionEstado)
    setNewActionText("")
    setNewActionResponsable("")
    toast.success("Acción registrada en la bitácora")
  }

  const handleRegisterNewIncident = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIncForm.titulo?.trim()) {
      toast.error("El título del incidente es obligatorio")
      return
    }

    const nextId = String(Date.now())
    const nextNum = incidents.length + 1
    const code = `INC-2026-${String(nextNum).padStart(3, "0")}`

    const newInc: IncidenteItem = {
      id: nextId,
      codigo: code,
      titulo: newIncForm.titulo.trim(),
      evento: newIncForm.evento?.trim() || "General",
      reporta: newIncForm.reporta?.trim() || "Usuario",
      tipo_incidente: newIncForm.tipo_incidente || "otro",
      criticidad: (newIncForm.criticidad as Criticidad) || "Media",
      fecha: new Date().toISOString().split("T")[0],
      estado: "Reportado",
      descripcion: newIncForm.descripcion?.trim() || "",
      areaAfectada: newIncForm.areaAfectada?.trim() || "General",
      accionCorrectiva: newIncForm.accionCorrectiva?.trim() || "En análisis",
      costo_adicional: newIncForm.costo_adicional || 0,
    }

    setIncidents([newInc, ...incidents])
    setHistory((prev) => ({
      ...prev,
      [nextId]: [
        {
          id: String(Date.now()),
          accion: "Incidente reportado en el sistema",
          responsable: newIncForm.reporta?.trim() || "Usuario",
          estado: "Reportado",
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 16),
          tipo: "initial",
        },
      ],
    }))

    toast.success(`Incidente ${code} registrado`)
    setNewIncForm({})
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title="Incidentes"
          actionLabel="Crear incidente"
          onAction={() => {
            setSelectedIncident(null)
            setIsEditMode(false)
            setNewIncForm({
              titulo: "",
              evento: "",
              reporta: "",
              criticidad: "Media",
              descripcion: "",
              areaAfectada: "",
              accionCorrectiva: "",
            })
            setIsDrawerOpen(true)
          }}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (filterCriticidad !== "Todos" ? 1 : 0) +
            (filterEstado !== "Todos" ? 1 : 0)
          }
          activeFilterPills={[
            ...(filterCriticidad !== "Todos"
              ? [
                  {
                    key: "criticidad",
                    label: `Criticidad: ${filterCriticidad}`,
                    onClear: () => {
                      setFilterCriticidad("Todos")
                      setCurrentPage(1)
                    },
                  },
                ]
              : []),
            ...(filterEstado !== "Todos"
              ? [
                  {
                    key: "estado",
                    label: `Estado: ${filterEstado}`,
                    onClear: () => {
                      setFilterEstado("Todos")
                      setCurrentPage(1)
                    },
                  },
                ]
              : []),
          ]}
          onResetFilters={() => {
            setFilterCriticidad("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Criticidad
            </label>
            <div className="grid grid-cols-4 gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]">
              {(["Todos", "Alta", "Media", "Baja"] as const).map((crit) => (
                <button
                  key={crit}
                  type="button"
                  onClick={() => {
                    setFilterCriticidad(crit)
                    setCurrentPage(1)
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer text-center truncate ${
                    filterCriticidad === crit
                      ? "bg-[#7C3AED] text-white font-semibold"
                      : "text-[#94A3B8] hover:text-[#F1F5F9]"
                  }`}
                >
                  {crit}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado
            </label>
            <CustomSelect
              value={filterEstado}
              onChange={(val) => {
                setFilterEstado(val)
                setCurrentPage(1)
              }}
              options={ESTADO_FILTER_OPTIONS}
            />
          </div>
        </PageHeader>

        {/* ── Shopify Polaris IndexTabs: Vistas Rápidas ── */}
        <IndexTabs
          tabs={quickTabs}
          activeTab={filterEstado}
          onTabChange={(newTab) => {
            setFilterEstado(newTab)
            setCurrentPage(1)
          }}
        />

        {/* ── Tabla Modularizada y Paginación ── */}
        <IncidenteTable
          incidents={paginatedData}
          totalCount={filteredData.length}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEmptyAction={() => {
            setSelectedIncident(null)
            setIsEditMode(false)
            setNewIncForm({
              titulo: "",
              evento: "",
              reporta: "",
              criticidad: "Media",
              descripcion: "",
              areaAfectada: "",
              accionCorrectiva: "",
            })
            setIsDrawerOpen(true)
          }}
          onResetFilters={resetFilters}
          isFiltered={isFiltered}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          onPageChange={setCurrentPage}
          onStatusChange={handleStatusChange}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Bulk Actions Bar (Shopify Polaris) */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        totalCount={filteredData.length}
        onClearSelection={() => setSelectedIds([])}
        actions={[
          {
            label: "Marcar Solucionados",
            onClick: handleBulkResolve,
            variant: "success",
            icon: CheckCircle2,
          },
          {
            label: "Escalar Incidentes",
            onClick: handleBulkEscalate,
            variant: "secondary",
            icon: Archive,
          },
          {
            label: "Eliminar",
            onClick: handleBulkDelete,
            variant: "danger",
            icon: Trash2,
          },
        ]}
      />

      {/* Drawer Detalle / Edición */}
      <IncidenteDetailDrawer
        isOpen={isDrawerOpen && !!selectedIncident}
        incident={selectedIncident}
        history={selectedIncident ? (history[selectedIncident.id] ?? []) : []}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        editForm={editForm}
        setEditForm={setEditForm}
        onSaveEdit={saveEdit}
        onClose={closeDrawer}
        newActionText={newActionText}
        setNewActionText={setNewActionText}
        newActionResponsable={newActionResponsable}
        setNewActionResponsable={setNewActionResponsable}
        newActionEstado={newActionEstado}
        setNewActionEstado={setNewActionEstado}
        onAddAction={addAction}
      />

      {/* Drawer Crear Incidente */}
      <IncidenteFormDrawer
        isOpen={isDrawerOpen && !selectedIncident}
        newIncForm={newIncForm}
        setNewIncForm={setNewIncForm}
        onClose={closeDrawer}
        onSubmit={handleRegisterNewIncident}
      />
    </div>
  )
}
