import { usePagination } from "../../hooks/usePagination"
import { useCrudResource } from "../../hooks/useCrudResource"
import React, { useState, useMemo } from "react"
import { Layers, Edit2, Trash2 } from "lucide-react"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { CustomSelect } from "../../components/CustomSelect"
import { Drawer } from "../../components/Drawer"
import { useToast } from "../../components/Toast"
import { INITIAL_SERVICES, INITIAL_CATEGORIAS_SERVICIO } from "./data"
import { ServicioTable } from "./components/ServicioTable"
import { ServicioDetailDrawer } from "./drawers/ServicioDetailDrawer"
import { ServicioFormDrawer } from "./drawers/ServicioFormDrawer"
import type {
  ServicioItem,
  ServicioModalMode,
  ServicioFormData,
  CategoriaServicioItem,
} from "./types"

export default function ServiciosPage() {
  const toast = useToast()
  const { items: services, setItems: setServices } =
    useCrudResource<ServicioItem>({
      endpoint: "/servicios",
      storageKey: "high_events_servicios_v1",
      initialData: INITIAL_SERVICES,
    })
  const { items: categorias, setItems: setCategorias } =
    useCrudResource<CategoriaServicioItem>({
      endpoint: "/categorias-servicio",
      storageKey: "high_events_categorias_servicio_v1",
      initialData: INITIAL_CATEGORIAS_SERVICIO,
    })

  // Estado para formulario de Categorías (tabla categorias_servicio)
  const [catNombre, setCatNombre] = useState("")
  const [catDesc, setCatDesc] = useState("")
  const [editingCatId, setEditingCatId] = useState<string | null>(null)

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

  const nombresCategorias = useMemo(
    () => categorias.map((c) => c.nombre),
    [categorias],
  )

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
      categoria: nombresCategorias[0] || "",
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
    setEditingCatId(null)
    setCatNombre("")
    setCatDesc("")
  }

  const handleDelete = (r: ServicioItem) => {
    if (confirm(`¿Eliminar servicio ${r.nombre}?`)) {
      setServices((prev) => prev.filter((s) => s.id !== r.id))
      toast.success("Servicio eliminado")
    }
  }

  const handleCreateQuickCategory = (nombre: string) => {
    const clean = nombre.trim()
    if (!clean) return
    if (!categorias.some((c) => c.nombre.toLowerCase() === clean.toLowerCase())) {
      setCategorias((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          nombre: clean,
          descripcion: "Categoría de servicios comerciales",
          estado: "Activo",
        },
      ])
      toast.success(`Categoría "${clean}" creada en el catálogo`)
    }
  }

  const handleSaveCategoryForm = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = catNombre.trim()
    if (!clean) return

    if (editingCatId) {
      const oldCat = categorias.find((c) => c.id === editingCatId)
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === editingCatId
            ? { ...c, nombre: clean, descripcion: catDesc.trim() }
            : c,
        ),
      )
      if (oldCat && oldCat.nombre !== clean) {
        setServices((prev) =>
          prev.map((s) =>
            s.categoria === oldCat.nombre ? { ...s, categoria: clean } : s,
          ),
        )
      }
      toast.success("Categoría actualizada")
    } else {
      if (
        categorias.some((c) => c.nombre.toLowerCase() === clean.toLowerCase())
      ) {
        toast.error("Ya existe una categoría con ese nombre")
        return
      }
      setCategorias((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          nombre: clean,
          descripcion: catDesc.trim() || "Categoría de servicios comerciales",
          estado: "Activo",
        },
      ])
      toast.success(`Categoría "${clean}" agregada`)
    }
    setEditingCatId(null)
    setCatNombre("")
    setCatDesc("")
  }

  const handleDeleteCategory = (cat: CategoriaServicioItem) => {
    const count = services.filter((s) => s.categoria === cat.nombre).length
    if (count > 0) {
      toast.error(
        `No se puede eliminar "${cat.nombre}" porque tiene ${count} servicio(s) asociado(s)`,
      )
      return
    }
    setCategorias((prev) => prev.filter((c) => c.id !== cat.id))
    toast.success(`Categoría "${cat.nombre}" eliminada`)
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
        categoria: editForm.categoria || nombresCategorias[0] || "Sonido",
        tipo_cobro: editForm.tipo_cobro || "por_evento",
        descripcion: editForm.descripcion?.trim() || "",
        precioBase: editForm.precioBase?.trim() || "$ 0",
        estado: "Activo",
      }
      setServices((prev) => [nuevo, ...prev])
      toast.success("Servicio creado exitosamente")
    }
    closeModal()
  }

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todos", count: services.length },
      {
        id: "Activo",
        label: "Activos",
        count: services.filter((s) => s.estado === "Activo").length,
      },
      {
        id: "Inactivo",
        label: "Inactivos",
        count: services.filter((s) => s.estado === "Inactivo").length,
      },
    ],
    [services],
  )

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
          activeFilterPills={[
            ...(filterCat !== "Todos"
              ? [
                  {
                    key: "cat",
                    label: `Categoría: ${filterCat}`,
                    onClear: () => {
                      setFilterCat("Todos")
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
            setFilterCat("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
          extraControls={
            <button
              type="button"
              onClick={() => setModalMode("categorias")}
              className="h-[36px] px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] bg-[#181B22] border-[#262D3D] text-[#CBD5E1] hover:border-[#3B455A] hover:text-[#F1F5F9]"
            >
              <Layers size={13} />
              <span>Categorías ({categorias.length})</span>
            </button>
          }
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Categoría
            </label>
            <CustomSelect
              value={filterCat}
              onChange={(val) => {
                setFilterCat(val)
                setCurrentPage(1)
              }}
              options={[
                { label: "Todas las Categorías", value: "Todos" },
                ...nombresCategorias.map((c) => ({ label: c, value: c })),
              ]}
            />
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
              options={[
                { label: "Todos los Estados", value: "Todos" },
                { label: "Activo", value: "Activo" },
                { label: "Inactivo", value: "Inactivo" },
              ]}
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
        categorias={nombresCategorias}
        onCreateCategoria={handleCreateQuickCategory}
      />

      {/* Drawer Gestión de Categorías */}
      <Drawer
        isOpen={modalMode === "categorias"}
        onClose={closeModal}
        position="center"
        title="Gestión de Categorías de Servicios"
        subtitle="Administra el catálogo de categorías para clasificar los servicios comerciales"
      >
        <div className="space-y-4">
          <form
            onSubmit={handleSaveCategoryForm}
            className="p-3.5 bg-[#111318] border border-[#262D3D] rounded-xl space-y-3"
          >
            <p className="text-xs font-bold text-[#F8FAFC]">
              {editingCatId ? "Editar categoría" : "Agregar nueva categoría"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  required
                  placeholder="Ej. Efectos Especiales, Animación..."
                  value={catNombre}
                  onChange={(e) => setCatNombre(e.target.value)}
                  className="w-full h-[38px] px-3 bg-[#181B22] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Descripción breve..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full h-[38px] px-3 bg-[#181B22] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
              <div className="sm:col-span-2 flex gap-1.5">
                <button
                  type="submit"
                  className="w-full h-[38px] rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>{editingCatId ? "Guardar" : "Crear"}</span>
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {categorias.map((cat) => {
              const count = services.filter(
                (s) => s.categoria === cat.nombre,
              ).length
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#111318] border border-[#262D3D]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F8FAFC]">
                        {cat.nombre}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#7C3AED]/15 text-[#A78BFA]">
                        {count} {count === 1 ? "servicio" : "servicios"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                      {cat.descripcion}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCatId(cat.id)
                        setCatNombre(cat.nombre)
                        setCatDesc(cat.descripcion)
                      }}
                      title="Editar categoría"
                      className="p-1.5 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/15 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      title="Eliminar categoría"
                      className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/15 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end pt-3 border-t border-[#262D3D]">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#181B22] border border-[#262D3D] text-[#F8FAFC] hover:bg-[#222734] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
