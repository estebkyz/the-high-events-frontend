import { usePagination } from "../../hooks/usePagination"
import React, { useState, useMemo } from "react"
import { PageHeader } from "../../components/PageHeader"
import { useToast } from "../../components/Toast"
import { INITIAL_EQUIPMENT } from "./data"
import { EquiposKPIs } from "./components/EquiposKPIs"
import { EquipoTable } from "./components/EquipoTable"
import { EquipoDetailDrawer } from "./drawers/EquipoDetailDrawer"
import { EquipoFormDrawer } from "./drawers/EquipoFormDrawer"
import type {
  EquipoItem,
  EquipoDrawerMode,
  EquipoFormData,
  EstadoOperativo,
  Categoria,
} from "./types"

export default function EquiposPage() {
  const toast = useToast()
  const [equipos, setEquipos] = useState<EquipoItem[]>(INITIAL_EQUIPMENT)

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filters
  const [filterCategoria, setFilterCategoria] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  const [drawerMode, setDrawerMode] = useState<EquipoDrawerMode>("none")
  const [selectedEquipo, setSelectedEquipo] = useState<EquipoItem | null>(null)
  const [editForm, setEditForm] = useState<EquipoFormData>({})
  const [viewDetailEstado, setViewDetailEstado] =
    useState<EstadoOperativo>("Disponible")

  const filtered = useMemo(() => {
    return equipos.filter((e) => {
      const q = search.toLowerCase()
      if (
        q &&
        !e.nombre.toLowerCase().includes(q) &&
        !e.serie.toLowerCase().includes(q)
      )
        return false
      if (filterCategoria !== "Todos" && e.categoria !== filterCategoria)
        return false
      if (filterEstado !== "Todos" && e.estadoOperativo !== filterEstado)
        return false
      return true
    })
  }, [equipos, search, filterCategoria, filterEstado])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filtered)

  const kpiTotal = equipos.length
  const kpiDisponible = equipos.filter(
    (e) => e.estadoOperativo === "Disponible",
  ).length
  const kpiPrestamo = equipos.filter(
    (e) => e.estadoOperativo === "Prestado" || e.estadoOperativo === "En Evento",
  ).length
  const kpiMantenimiento = equipos.filter(
    (e) =>
      e.estadoOperativo === "En Mantenimiento" || e.estadoOperativo === "De Baja",
  ).length

  const updateEstado = (id: string, estado: EstadoOperativo) => {
    setEquipos((prev) =>
      prev.map((e) => (e.id === id ? { ...e, estadoOperativo: estado } : e)),
    )
    const target = equipos.find((e) => e.id === id)
    if (target) {
      toast.info(`${target.nombre} ahora está ${estado}`)
    }
  }

  const openEdit = (equipo: EquipoItem) => {
    setSelectedEquipo(equipo)
    setEditForm({ ...equipo })
    setDrawerMode("edit")
  }

  const openView = (equipo: EquipoItem) => {
    setSelectedEquipo(equipo)
    setViewDetailEstado(equipo.estadoOperativo)
    setDrawerMode("view")
  }

  const closeDrawer = () => {
    setDrawerMode("none")
    setSelectedEquipo(null)
    setEditForm({})
  }

  const handleDelete = (item: EquipoItem) => {
    if (confirm(`¿Eliminar equipo ${item.nombre}?`)) {
      setEquipos((prev) => prev.filter((e) => e.id !== item.id))
      toast.success("Equipo eliminado")
    }
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.nombre?.trim()) {
      toast.error("El nombre del equipo es obligatorio")
      return
    }

    const propiedad = (editForm.propiedad as EquipoItem["propiedad"]) || "Propio"
    if (propiedad === "Alquilado" && !editForm.proveedor_nombre?.trim()) {
      toast.error("Para un equipo alquilado debes seleccionar el proveedor que lo suministra")
      return
    }

    const normalizedForm: EquipoFormData = {
      ...editForm,
      propiedad,
      proveedor_id: propiedad === "Alquilado" ? (editForm.proveedor_id ?? null) : null,
      proveedor_nombre:
        propiedad === "Alquilado" ? editForm.proveedor_nombre?.trim() : undefined,
    }

    if (drawerMode === "edit" && selectedEquipo) {
      setEquipos((prev) =>
        prev.map((e) =>
          e.id === selectedEquipo.id
            ? ({ ...e, ...normalizedForm } as EquipoItem)
            : e,
        ),
      )
      toast.success("Equipo actualizado exitosamente")
    } else {
      const nuevo: EquipoItem = {
        ...normalizedForm,
        id: String(Date.now()),
        codigo: `EQ-${String(equipos.length + 1).padStart(3, "0")}`,
        nombre: editForm.nombre.trim(),
        serie:
          editForm.serie?.trim() || `SN-${Date.now().toString().slice(-4)}`,
        categoria: (editForm.categoria as Categoria) || "Audio",
        estadoOperativo:
          (editForm.estadoOperativo as EstadoOperativo) || "Disponible",
        propiedad,
      }
      setEquipos((prev) => [nuevo, ...prev])
      toast.success("Equipo registrado exitosamente")
    }
    closeDrawer()
  }

  const openNew = () => {
    setSelectedEquipo(null)
    setEditForm({
      nombre: "",
      serie: "",
      categoria: "Audio",
      estadoOperativo: "Disponible",
      propiedad: "Propio",
      proveedor_id: null,
      proveedor_nombre: undefined,
    })
    setDrawerMode("new")
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Equipos"
          actionLabel="Crear equipo"
          onAction={openNew}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (filterCategoria !== "Todos" ? 1 : 0) +
            (filterEstado !== "Todos" ? 1 : 0)
          }
          onResetFilters={() => {
            setFilterCategoria("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Categoría
            </label>
            <select
              value={filterCategoria}
              onChange={(e) => {
                setFilterCategoria(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full h-[36px] px-3 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] cursor-pointer"
            >
              <option value="Todos">Todas las Categorías</option>
              <option value="Audio">Audio</option>
              <option value="Iluminación">Iluminación</option>
              <option value="Video">Video</option>
              <option value="Estructuras">Estructuras</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado Operativo
            </label>
            <select
              value={filterEstado}
              onChange={(e) => {
                setFilterEstado(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full h-[36px] px-3 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] cursor-pointer"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Disponible">Disponible</option>
              <option value="En Préstamo">En Préstamo</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Dañado">Dañado</option>
            </select>
          </div>
        </PageHeader>

        {/* KPI Cards */}
        <EquiposKPIs
          total={kpiTotal}
          disponible={kpiDisponible}
          prestamo={kpiPrestamo}
          mantenimiento={kpiMantenimiento}
        />

        {/* ── Tabla Modularizada y Paginación ── */}
        <EquipoTable
          equipos={paginatedData}
          totalCount={filtered.length}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          onPageChange={setCurrentPage}
          onStatusChange={updateEstado}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onEmptyAction={openNew}
          isFiltered={
            Boolean(search) ||
            filterCategoria !== "Todos" ||
            filterEstado !== "Todos"
          }
          onResetFilters={() => {
            setSearch("")
            setFilterCategoria("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
        />
      </main>

      {/* Form Drawer (New / Edit) */}
      <EquipoFormDrawer
        mode={drawerMode === "edit" ? "edit" : "new"}
        isOpen={drawerMode === "new" || drawerMode === "edit"}
        onClose={closeDrawer}
        equipo={selectedEquipo}
        formData={editForm}
        setFormData={setEditForm}
        onSubmit={handleSaveForm}
      />

      {/* Detail Drawer */}
      <EquipoDetailDrawer
        isOpen={drawerMode === "view"}
        onClose={closeDrawer}
        equipo={selectedEquipo}
        selectedEstado={viewDetailEstado}
        setSelectedEstado={setViewDetailEstado}
        onApplyEstado={(id: string, newEst: EstadoOperativo) => {
          updateEstado(id, newEst)
          setViewDetailEstado(newEst)
          toast.success(`Estado actualizado a ${newEst}`)
        }}
      />
    </div>
  )
}
