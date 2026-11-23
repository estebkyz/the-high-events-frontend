import { usePagination } from "../../hooks/usePagination"
import { useCrudResource } from "../../hooks/useCrudResource"
import React, { useState, useMemo } from "react"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { CustomSelect } from "../../components/CustomSelect"
import { useToast } from "../../components/Toast"
import { INITIAL_RECEPCIONES } from "./data"
import { RecepcionesKPIs } from "./components/RecepcionesKPIs"
import { RecepcionTable } from "./components/RecepcionTable"
import { RecepcionDetailDrawer } from "./drawers/RecepcionDetailDrawer"
import { RecepcionFormDrawer } from "./drawers/RecepcionFormDrawer"
import { RecepcionDevolucionDrawer } from "./drawers/RecepcionDevolucionDrawer"
import type {
  Recepcion,
  RecepcionDrawerMode,
  NewItem,
  DevolucionItem,
  EstadoRecepcion,
  TipoRecepcion,
} from "./types"

const BLANK_ITEM: NewItem = { nombre: "", cantidad: "1", estado: "Bueno" }

export default function RecepcionesPage() {
  const toast = useToast()

  const { items: recepciones, setItems: setRecepciones } =
    useCrudResource<Recepcion>({
      endpoint: "/recepciones",
      storageKey: "high_events_recepciones_v1",
      initialData: INITIAL_RECEPCIONES,
    })
  const [drawerMode, setDrawerMode] = useState<RecepcionDrawerMode>(null)
  const [selectedRcp, setSelectedRcp] = useState<Recepcion | null>(null)
  const [devolucionParent, setDevolucionParent] = useState<Recepcion | null>(
    null,
  )

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("")

  // Filtros
  const [filterTipo, setFilterTipo] = useState("")
  const [filterEstado, setFilterEstado] = useState("")

  // Formulario de creación/edición
  const [createForm, setCreateForm] = useState({
    evento: "Festival 360",
    proveedor: "",
    tipo: "Entrega",
    fecha: new Date().toISOString().split("T")[0],
    observaciones: "",
    estado: "Pendiente",
  })
  const [createItems, setCreateItems] = useState<NewItem[]>([{ ...BLANK_ITEM }])

  // Formulario de devolución
  const [devObservaciones, setDevObservaciones] = useState("")
  const [devItems, setDevItems] = useState<DevolucionItem[]>([])

  // KPIs
  const kpis = useMemo(() => {
    const total = recepciones.length
    const pendientes = recepciones.filter(
      (r) => r.estado === "Pendiente",
    ).length
    const conformes = recepciones.filter((r) => r.estado === "Conforme").length
    const cerradas = recepciones.filter((r) => r.estado === "Cerrada").length
    return { total, pendientes, conformes, cerradas }
  }, [recepciones])

  // Datos filtrados
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return recepciones.filter((r) => {
      const matchesSearch =
        !q ||
        r.codigo.toLowerCase().includes(q) ||
        r.evento.toLowerCase().includes(q) ||
        r.proveedor.toLowerCase().includes(q) ||
        r.subcontrato?.toLowerCase().includes(q)
      const matchesTipo = !filterTipo || r.tipo === filterTipo
      const matchesEstado = !filterEstado || r.estado === filterEstado
      return matchesSearch && matchesTipo && matchesEstado
    })
  }, [recepciones, searchQuery, filterTipo, filterEstado])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  // Acciones de Drawers
  const closeDrawer = () => {
    setDrawerMode(null)
    setSelectedRcp(null)
    setDevolucionParent(null)
  }

  const openView = (rcp: Recepcion) => {
    setSelectedRcp(rcp)
    setDrawerMode("view")
  }

  const openCreate = () => {
    setSelectedRcp(null)
    setCreateForm({
      evento: "Festival 360",
      proveedor: "",
      tipo: "Recepción Montaje",
      fecha: new Date().toISOString().split("T")[0],
      observaciones: "",
      estado: "Pendiente",
    })
    setCreateItems([{ ...BLANK_ITEM }])
    setDrawerMode("create")
  }

  const openEdit = (rcp: Recepcion) => {
    setSelectedRcp(rcp)
    setCreateForm({
      evento: rcp.evento,
      proveedor: rcp.proveedor,
      tipo: rcp.tipo,
      fecha: rcp.fecha,
      observaciones: rcp.observaciones,
      estado: rcp.estado,
    })
    setCreateItems(
      rcp.items.map((it) => ({
        nombre: it.nombre,
        cantidad: String(it.cantidad),
        estado: it.estado,
        observaciones: it.observaciones || "",
        evidencia_foto: it.evidencia_foto || "",
      })),
    )
    setDrawerMode("edit")
  }

  const openDevolucion = (parent: Recepcion) => {
    setDevolucionParent(parent)
    setDevItems(
      parent.items.map((it) => ({
        nombre: it.nombre,
        cantidad: it.cantidad,
        condicion: "Bueno",
      })),
    )
    setDevObservaciones("")
    setDrawerMode("devolucion")
  }

  const handleStatusChange = (id: string, newStatus: EstadoRecepcion) => {
    setRecepciones((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: newStatus } : item,
      ),
    )
    toast.success(`Estado actualizado a "${newStatus}"`)
  }

  const handleDelete = (row: Recepcion) => {
    if (confirm(`¿Eliminar acta "${row.codigo}"?`)) {
      setRecepciones((prev) => prev.filter((r) => r.id !== row.id))
      toast.info(`Acta "${row.codigo}" eliminada`)
    }
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.proveedor.trim()) {
      toast.error("Por favor ingresa el nombre del proveedor")
      return
    }

    const cleanItems = createItems
      .filter((it) => it.nombre.trim())
      .map((it) => ({
        nombre: it.nombre.trim(),
        cantidad: parseInt(it.cantidad, 10) || 1,
        estado: it.estado,
        observaciones: it.observaciones?.trim() || undefined,
        evidencia_foto: it.evidencia_foto?.trim() || undefined,
      }))

    if (cleanItems.length === 0) {
      toast.error("Debes incluir al menos un ítem o equipo")
      return
    }

    if (drawerMode === "edit" && selectedRcp) {
      setRecepciones((prev) =>
        prev.map((r) =>
          r.id === selectedRcp.id
            ? {
                ...r,
                evento: createForm.evento,
                proveedor: createForm.proveedor.trim(),
                tipo: createForm.tipo as TipoRecepcion,
                fecha: createForm.fecha,
                estado: createForm.estado as EstadoRecepcion,
                observaciones: createForm.observaciones.trim(),
                items: cleanItems,
              }
            : r,
        ),
      )
      toast.success(`Acta "${selectedRcp.codigo}" actualizada exitosamente`)
    } else {
      const nextNum = recepciones.length + 1
      const prefix = createForm.tipo === "Recepción Montaje" ? "RCP-M-2026" : "RCP-D-2026"
      const newCodigo = `${prefix}-${String(nextNum).padStart(3, "0")}`

      const newRecepcion: Recepcion = {
        id: String(Date.now()),
        codigo: newCodigo,
        evento: createForm.evento,
        proveedor: createForm.proveedor.trim(),
        subcontrato: "Subcontrato General",
        tipo: createForm.tipo as TipoRecepcion,
        fecha: createForm.fecha,
        estado: createForm.estado as EstadoRecepcion,
        descripcion:
          createForm.observaciones.trim() || "Acta de recepción/entrega",
        observaciones: createForm.observaciones.trim(),
        items: cleanItems,
      }

      setRecepciones([newRecepcion, ...recepciones])
      toast.success(`Acta "${newCodigo}" creada exitosamente`)
    }

    closeDrawer()
  }

  const handleDevolucionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!devolucionParent) return

    const nextNum = recepciones.length + 1
    const newCodigo = `ACT-D-2026-${String(nextNum).padStart(3, "0")}`
    const today = new Date().toISOString().split("T")[0]

    const newDev: Recepcion = {
      id: String(Date.now()),
      codigo: newCodigo,
      evento: devolucionParent.evento,
      proveedor: devolucionParent.proveedor,
      subcontrato: devolucionParent.subcontrato,
      tipo: "Recepción Desmontaje",
      fecha: today,
      estado: "Cerrada",
      descripcion: `Devolución de equipos vinculada a ${devolucionParent.codigo}`,
      parentCodigo: devolucionParent.codigo,
      observaciones: devObservaciones.trim(),
      items: devItems.map((it) => ({
        nombre: it.nombre,
        cantidad: it.cantidad,
        estado: it.condicion,
      })),
    }

    setRecepciones([newDev, ...recepciones])
    toast.success(`Acta de devolución "${newCodigo}" registrada y firmada`)
    closeDrawer()
  }

  const quickTabs = useMemo(
    () => [
      { id: "", label: "Todas", count: recepciones.length },
      {
        id: "Pendiente",
        label: "Pendientes",
        count: recepciones.filter((r) => r.estado === "Pendiente").length,
      },
      {
        id: "Conforme",
        label: "Conformes",
        count: recepciones.filter((r) => r.estado === "Conforme").length,
      },
      {
        id: "Cerrada",
        label: "Cerradas",
        count: recepciones.filter((r) => r.estado === "Cerrada").length,
      },
    ],
    [recepciones],
  )

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Cabecera con PageHeader estandarizado */}
        <PageHeader
          title="Recepciones"
          actionLabel="Crear recepción"
          onAction={openCreate}
          searchValue={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={(filterTipo ? 1 : 0) + (filterEstado ? 1 : 0)}
          activeFilterPills={[
            ...(filterTipo
              ? [
                  {
                    key: "tipo",
                    label: `Tipo: ${filterTipo}`,
                    onClear: () => {
                      setFilterTipo("")
                      setCurrentPage(1)
                    },
                  },
                ]
              : []),
            ...(filterEstado
              ? [
                  {
                    key: "estado",
                    label: `Estado: ${filterEstado}`,
                    onClear: () => {
                      setFilterEstado("")
                      setCurrentPage(1)
                    },
                  },
                ]
              : []),
          ]}
          onResetFilters={() => {
            setFilterTipo("")
            setFilterEstado("")
            setCurrentPage(1)
          }}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Tipo de acta
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]">
              {[
                { value: "", label: "Todas" },
                { value: "Recepción Montaje", label: "Montaje" },
                { value: "Recepción Desmontaje", label: "Desmontaje" },
              ].map((t) => (
                <button
                  key={t.value || "all"}
                  type="button"
                  onClick={() => {
                    setFilterTipo(t.value)
                    setCurrentPage(1)
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer text-center truncate ${
                    filterTipo === t.value
                      ? "bg-[#7C3AED] text-white font-semibold"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado del acta
            </label>
            <CustomSelect
              value={filterEstado || "Todos"}
              onChange={(val) => {
                setFilterEstado(val === "Todos" ? "" : val)
                setCurrentPage(1)
              }}
              options={[
                { label: "Todos los Estados", value: "Todos" },
                { label: "Pendiente", value: "Pendiente" },
                { label: "Conforme", value: "Conforme" },
                { label: "Cerrada", value: "Cerrada" },
                { label: "Anulada", value: "Anulada" },
              ]}
            />
          </div>
        </PageHeader>

        {/* Fila de KPIs */}
        <RecepcionesKPIs kpis={kpis} />

        {/* ── Shopify Polaris IndexTabs: Vistas Rápidas ── */}
        <IndexTabs
          tabs={quickTabs}
          activeTab={filterEstado}
          onTabChange={(newTab) => {
            setFilterEstado(newTab)
            setCurrentPage(1)
          }}
        />

        {/* Tabla principal con paginación */}
        <RecepcionTable
          recepciones={paginatedData}
          totalCount={filteredData.length}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          onPageChange={setCurrentPage}
          onStatusChange={handleStatusChange}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onDevolucion={openDevolucion}
        />
      </main>

      {/* Drawer de Detalle */}
      <RecepcionDetailDrawer
        isOpen={drawerMode === "view" && Boolean(selectedRcp)}
        onClose={closeDrawer}
        recepcion={selectedRcp}
        onOpenDevolucion={openDevolucion}
      />

      {/* Drawer de Creación / Edición */}
      <RecepcionFormDrawer
        isOpen={
          (drawerMode === "create" || drawerMode === "edit") &&
          (drawerMode === "create" || Boolean(selectedRcp))
        }
        onClose={closeDrawer}
        isEditing={drawerMode === "edit"}
        selectedRecepcion={selectedRcp}
        formValues={createForm}
        setFormValues={setCreateForm}
        items={createItems}
        setItems={setCreateItems}
        onSubmit={handleCreateSubmit}
      />

      {/* Drawer de Devolución */}
      <RecepcionDevolucionDrawer
        isOpen={drawerMode === "devolucion" && Boolean(devolucionParent)}
        onClose={closeDrawer}
        devolucionParent={devolucionParent}
        devItems={devItems}
        setDevItems={setDevItems}
        devObservaciones={devObservaciones}
        setDevObservaciones={setDevObservaciones}
        onSubmit={handleDevolucionSubmit}
      />
    </div>
  )
}
