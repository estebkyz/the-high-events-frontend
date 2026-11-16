import { usePagination } from "../../hooks/usePagination"
import React, { useState, useMemo } from "react"
import { PageHeader } from "../../components/PageHeader"
import { useToast } from "../../components/Toast"
import { INITIAL_SERVICES, CATEGORIES } from "./data"
import { ServicioTable } from "./components/ServicioTable"
import { ServicioDetailDrawer } from "./drawers/ServicioDetailDrawer"
import { ServicioFormDrawer } from "./drawers/ServicioFormDrawer"
import type { ServicioItem, ServicioModalMode, ServicioFormData } from "./types"

export default function ServiciosPage() {
  const toast = useToast()
  const [services, setServices] = useState<ServicioItem[]>(INITIAL_SERVICES)

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filters
  const [filterCat, setFilterCat] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  // Modal State
  const [modalMode, setModalMode] = useState<ServicioModalMode>("closed")
  const [selectedService, setSelectedService] = useState<ServicioItem | null>(
    null,
  )
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<ServicioFormData>({})

  const filteredData = useMemo(() => {
    return services.filter((s) => {
      const matchSearch =
        !search || s.nombre.toLowerCase().includes(search.toLowerCase())
      const matchCat = filterCat === "Todos" || s.categoria === filterCat
      const matchEstado = filterEstado === "Todos" || s.estado === filterEstado
      return matchSearch && matchCat && matchEstado
    })
  }, [services, search, filterCat, filterEstado])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  const setServiceEstado = (id: string, estado: string) => {
    const nextEstado = estado as ServicioItem["estado"]
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: nextEstado } : s)),
    )
    setSelectedService((prev) =>
      prev && prev.id === id ? { ...prev, estado: nextEstado } : prev,
    )
    const target = services.find((s) => s.id === id)
    if (target) {
      toast.info(`${target.nombre} ahora está ${estado}`)
    }
  }

  const openCreate = () => {
    setSelectedService(null)
    setIsEditing(false)
    setEditForm({
      nombre: "",
      categoria: "Sonido",
      tipo_cobro: "por_evento",
      descripcion: "",
      precioBase: "",
      estado: "Activo",
    })
    setModalMode("form")
  }

  const openEdit = (svc: ServicioItem) => {
    setSelectedService(svc)
    setIsEditing(true)
    setEditForm({ ...svc })
    setModalMode("form")
  }

  const openView = (svc: ServicioItem) => {
    setSelectedService(svc)
    setModalMode("view")
  }

  const closeModal = () => {
    setModalMode("closed")
    setSelectedService(null)
    setIsEditing(false)
  }

  const handleDelete = (r: ServicioItem) => {
    if (confirm(`¿Eliminar servicio ${r.nombre}?`)) {
      setServices((prev) => prev.filter((s) => s.id !== r.id))
      toast.success("Servicio eliminado")
    }
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.nombre?.trim()) {
      toast.error("El nombre del servicio es obligatorio")
      return
    }

    if (isEditing && selectedService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === selectedService.id
            ? { ...s, ...editForm } as ServicioItem
            : s,
        ),
      )
      toast.success("Servicio actualizado exitosamente")
    } else {
      const nuevo: ServicioItem = {
        id: String(Date.now()),
        nombre: editForm.nombre.trim(),
        categoria: editForm.categoria || "Sonido",
        tipo_cobro: editForm.tipo_cobro || "por_evento",
        descripcion: editForm.descripcion?.trim() || "",
        precioBase: editForm.precioBase?.trim() || "$ 0",
        estado: (editForm.estado as "Activo" | "Inactivo") || "Activo",
      }
      setServices((prev) => [nuevo, ...prev])
      toast.success("Servicio creado exitosamente")
    }
    closeModal()
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Servicios"
          actionLabel="Crear servicio"
          onAction={openCreate}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (filterCat !== "Todos" ? 1 : 0) + (filterEstado !== "Todos" ? 1 : 0)
          }
          onResetFilters={() => {
            setFilterCat("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Categoría
            </label>
            <select
              value={filterCat}
              onChange={(e) => {
                setFilterCat(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full h-[36px] px-3 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] cursor-pointer"
            >
              <option value="Todos">Todas las Categorías</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado
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
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </PageHeader>

        {/* ── Tabla Modularizada y Paginación ── */}
        <ServicioTable
          services={paginatedData}
          totalCount={filteredData.length}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          onPageChange={setCurrentPage}
          onStatusChange={setServiceEstado}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* View Detail Drawer */}
      <ServicioDetailDrawer
        isOpen={modalMode === "view" && !!selectedService}
        onClose={closeModal}
        service={selectedService}
        onOpenEdit={openEdit}
      />

      {/* Form Drawer */}
      <ServicioFormDrawer
        isOpen={modalMode === "form"}
        onClose={closeModal}
        isEditing={isEditing}
        service={selectedService}
        formData={editForm}
        setFormData={setEditForm}
        onSubmit={handleSaveForm}
      />
    </div>
  )
}
