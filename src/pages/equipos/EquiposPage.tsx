import { usePagination } from "../../hooks/usePagination"
import { useCrudResource } from "../../hooks/useCrudResource"
import React, { useState, useMemo } from "react"
import { Layers, Plus, Trash2, Edit2, Check } from "lucide-react"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { CustomSelect } from "../../components/CustomSelect"
import { Drawer } from "../../components/Drawer"
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
  CategoriaEquipoItem,
} from "./types"

const INITIAL_CATEGORIAS_EQUIPO: CategoriaEquipoItem[] = []

export default function EquiposPage() {
  const toast = useToast()
  const { items: equipos, setItems: setEquipos } = useCrudResource<EquipoItem>({
    endpoint: "/equipos",
    storageKey: "high_events_equipos_v1",
    initialData: INITIAL_EQUIPMENT,
  })
  const { items: categorias, setItems: setCategorias } =
    useCrudResource<CategoriaEquipoItem>({
      endpoint: "/categorias-equipo",
      storageKey: "high_events_categorias_equipo_v1",
      initialData: INITIAL_CATEGORIAS_EQUIPO,
    })

  //Estado para formulario de Categorías (tabla categorias_equipo)
  const [catNombre, setCatNombre] = useState("")
  const [catDesc, setCatDesc] = useState("")
  const [editingCatId, setEditingCatId] = useState<string | null>(null)

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

  const nombresCategorias = useMemo(
    () => categorias.map((c) => c.nombre),
    [categorias],
  )

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
    setEditingCatId(null)
    setCatNombre("")
    setCatDesc("")
  }

  const handleDelete = (item: EquipoItem) => {
    setEquipos((prev) => prev.filter((e) => e.id !== item.id))
    toast.success("Equipo eliminado")
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
          descripcion: "Categoría personalizada de inventario técnico",
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
        setEquipos((prev) =>
          prev.map((eq) =>
            eq.categoria === oldCat.nombre ? { ...eq, categoria: clean } : eq,
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
          descripcion: catDesc.trim() || "Categoría de equipos técnicos",
          estado: "Activo",
        },
      ])
      toast.success(`Categoría "${clean}" agregada`)
    }
    setEditingCatId(null)
    setCatNombre("")
    setCatDesc("")
  }

  const handleDeleteCategory = (cat: CategoriaEquipoItem) => {
    const count = equipos.filter((e) => e.categoria === cat.nombre).length
    if (count > 0) {
      toast.error(
        `No se puede eliminar "${cat.nombre}" porque tiene ${count} equipo(s) asociado(s)`,
      )
      return
    }
    setCategorias((prev) => prev.filter((c) => c.id !== cat.id))
    toast.success(`Categoría "${cat.nombre}" eliminada`)
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.nombre?.trim()) {
      toast.error("El nombre del equipo es obligatorio")
      return
    }

    const propiedad = (editForm.propiedad as EquipoItem["propiedad"]) || "Propio"
    if (propiedad === "Alquilado" && !editForm.proveedor_nombre?.trim()) {
      toast.error(
        "Para un equipo alquilado debes seleccionar el proveedor que lo suministra",
      )
      return
    }

    const normalizedForm: EquipoFormData = {
      ...editForm,
      propiedad,
      proveedor_id:
        propiedad === "Alquilado" ? (editForm.proveedor_id ?? null) : null,
      proveedor_nombre:
        propiedad === "Alquilado"
          ? editForm.proveedor_nombre?.trim()
          : undefined,
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
        estadoOperativo: "Disponible",
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
      categoria: nombresCategorias[0] || "",
      estadoOperativo: "Disponible",
      propiedad: "Propio",
      proveedor_id: null,
      proveedor_nombre: undefined,
    })
    setDrawerMode("new")
  }

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todos", count: equipos.length },
      {
        id: "Disponible",
        label: "Disponibles",
        count: equipos.filter((e) => e.estadoOperativo === "Disponible").length,
      },
      {
        id: "En Evento",
        label: "En Evento",
        count: equipos.filter((e) => e.estadoOperativo === "En Evento").length,
      },
      {
        id: "Prestado",
        label: "Prestados",
        count: equipos.filter((e) => e.estadoOperativo === "Prestado").length,
      },
      {
        id: "En Mantenimiento",
        label: "Mantenimiento",
        count: equipos.filter((e) => e.estadoOperativo === "En Mantenimiento")
          .length,
      },
    ],
    [equipos],
  )

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
          activeFilterPills={[
            ...(filterCategoria !== "Todos"
              ? [
                  {
                    key: "cat",
                    label: `Categoría: ${filterCategoria}`,
                    onClear: () => {
                      setFilterCategoria("Todos")
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
            setFilterCategoria("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
          extraControls={
            <button
              type="button"
              onClick={() => setDrawerMode("categorias")}
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
              value={filterCategoria}
              onChange={(val) => {
                setFilterCategoria(val)
                setCurrentPage(1)
              }}
              options={[
                { label: "Todas las Categorías", value: "Todos" },
                ...nombresCategorias.map((cat) => ({ label: cat, value: cat })),
              ]}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado Operativo
            </label>
            <CustomSelect
              value={filterEstado}
              onChange={(val) => {
                setFilterEstado(val)
                setCurrentPage(1)
              }}
              options={[
                { label: "Todos los Estados", value: "Todos" },
                { label: "Disponible", value: "Disponible" },
                { label: "En Evento", value: "En Evento" },
                { label: "Prestado", value: "Prestado" },
                { label: "En Mantenimiento", value: "En Mantenimiento" },
                { label: "De Baja", value: "De Baja" },
              ]}
            />
          </div>
        </PageHeader>

        {/* KPI Cards */}
        <EquiposKPIs
          total={kpiTotal}
          disponible={kpiDisponible}
          prestamo={kpiPrestamo}
          mantenimiento={kpiMantenimiento}
        />

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
        categorias={nombresCategorias}
        onCreateCategoria={handleCreateQuickCategory}
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

      {/* Modal de Gestión de Categorías de Equipos (Tabla categorias_equipo) */}
      <Drawer
        isOpen={drawerMode === "categorias"}
        onClose={closeDrawer}
        position="center"
        width="max-w-2xl"
        title="Gestión de categorías de equipos"
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
                  placeholder="Ej. Efectos / Humo, Accesorios..."
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
              const count = equipos.filter(
                (e) => e.categoria === cat.nombre,
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
                        {count} {count === 1 ? "equipo" : "equipos"}
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
              onClick={closeDrawer}
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
