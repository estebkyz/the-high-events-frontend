import { usePagination } from "../../hooks/usePagination"
import { useCrudResource } from "../../hooks/useCrudResource"
import React, { useState, useMemo, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { PageHeader } from "../../components/PageHeader"
import { CustomSelect } from "../../components/CustomSelect"
import { IndexTabs } from "../../components/IndexTabs"
import { BulkActionsBar } from "../../components/BulkActionsBar"
import { useToast } from "../../components/Toast"
import { printDocumentPdf } from "../../utils/printDocumentPdf"
import { CheckCircle2, Send, Trash2 } from "lucide-react"
import type {
  CotizacionItem,
  CotizacionDrawerMode,
  CotizacionFormData,
  EstadoCotizacion,
} from "./types"
import { INITIAL_QUOTES, ALL_CLIENTS, ESTADO_FILTER_OPTIONS } from "./data"
import { CotizacionTable } from "./components/CotizacionTable"
import { CotizacionDetailDrawer } from "./drawers/CotizacionDetailDrawer"
import { CotizacionFormDrawer } from "./drawers/CotizacionFormDrawer"

export default function CotizacionesPage() {
  const toast = useToast()
  const location = useLocation()
  const { items: quotes, setItems: setQuotes } =
    useCrudResource<CotizacionItem>({
      endpoint: "/cotizaciones",
      storageKey: "high_events_cotizaciones_v1",
      initialData: INITIAL_QUOTES,
    })
  const [selectedQuote, setSelectedQuote] = useState<CotizacionItem | null>(
    null,
  )
  const [drawerMode, setDrawerMode] = useState<CotizacionDrawerMode>("create")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Selection for Bulk Actions (Shopify Polaris)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filters
  const [filterEstado, setFilterEstado] = useState("Todos")
  const [filterCliente, setFilterCliente] = useState("Todos")
  const [formState, setFormState] = useState<CotizacionFormData>({})

  // Auto pre-cargar cotización si viene desde una cita en Agendamiento
  useEffect(() => {
    const st = location.state as {
      fromAgenda?: boolean
      clientName?: string
      fechaTentativa?: string
      tipoEvento?: string
      lugar?: string
      notas?: string
    } | null
    if (st?.fromAgenda) {
      setSelectedQuote(null)
      setFormState({
        cliente: st.clientName || "",
        fecha: new Date().toISOString().split("T")[0],
        fechaVence: "",
        servicios: [],
        montos: [],
        total: "$ 0",
        estado: "Borrador",
        notas: st.notas ? `Referencia de reunión: ${st.notas}` : "",
        nombre_evento: st.tipoEvento
          ? `${st.tipoEvento} - ${st.clientName || ""}`
          : "",
        fecha_evento: st.fechaTentativa || "",
        hora_inicio: "",
        hora_fin: "",
        direccion: st.lugar || "",
        aforo_esperado: undefined,
        asesor: "",
        items: [],
      })
      setDrawerMode("create")
      setIsDrawerOpen(true)
      toast.info(
        "Formulario de cotización pre-cargado con los datos de la cita",
      )
    }
  }, [location.state])

  const clienteFilterOptions = useMemo(() => {
    const names = Array.from(new Set(["Todos", ...quotes.map((q) => q.cliente).filter(Boolean)]))
    return names.map((c) => ({
      label: c === "Todos" ? "Todos los Clientes" : c,
      value: c,
    }))
  }, [quotes])

  const statusCounts = useMemo(() => {
    return {
      Todos: quotes.length,
      Borrador: quotes.filter((q) => q.estado === "Borrador").length,
      Enviada: quotes.filter((q) => q.estado === "Enviada").length,
      Aceptada: quotes.filter((q) => q.estado === "Aceptada").length,
      Rechazada: quotes.filter((q) => q.estado === "Rechazada").length,
      Vencida: quotes.filter((q) => q.estado === "Vencida").length,
    }
  }, [quotes])

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todas", count: statusCounts.Todos },
      { id: "Borrador", label: "Borrador", count: statusCounts.Borrador },
      { id: "Enviada", label: "Enviadas", count: statusCounts.Enviada },
      { id: "Aceptada", label: "Aceptadas", count: statusCounts.Aceptada },
      { id: "Rechazada", label: "Rechazadas", count: statusCounts.Rechazada },
      { id: "Vencida", label: "Vencidas", count: statusCounts.Vencida },
    ],
    [statusCounts],
  )

  const filteredData = useMemo(() => {
    return quotes.filter((q) => {
      const matchSearch =
        !search ||
        q.codigo.toLowerCase().includes(search.toLowerCase()) ||
        q.cliente.toLowerCase().includes(search.toLowerCase())
      const matchEstado = filterEstado === "Todos" || q.estado === filterEstado
      const matchCliente =
        filterCliente === "Todos" || q.cliente === filterCliente
      return matchSearch && matchEstado && matchCliente
    })
  }, [quotes, search, filterEstado, filterCliente])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  const advanceEstado = (id: string, estado: EstadoCotizacion) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, estado } : q)))
    setSelectedQuote((prev) =>
      prev && prev.id === id ? { ...prev, estado } : prev,
    )
    toast.info(`Estado actualizado a ${estado}`)
  }

  const sendQuote = (quote: CotizacionItem) => {
    if (quote.estado === "Borrador") {
      advanceEstado(quote.id, "Enviada")
      toast.success(`Cotización ${quote.codigo} enviada al cliente`)
    }
  }

  const openView = (q: CotizacionItem) => {
    setSelectedQuote(q)
    setDrawerMode("view")
    setIsDrawerOpen(true)
  }

  const openEdit = (q: CotizacionItem) => {
    setSelectedQuote(q)
    setFormState({
      cliente: q.cliente,
      fecha: q.fecha,
      fechaVence: q.fechaVence,
      servicios: [...q.servicios],
      montos: q.montos ? [...q.montos] : [],
      total: q.total,
      estado: q.estado,
      notas: q.notas,
      nombre_evento: q.nombre_evento,
      fecha_evento: q.fecha_evento,
      hora_inicio: q.hora_inicio,
      hora_fin: q.hora_fin,
      direccion: q.direccion,
      aforo_esperado: q.aforo_esperado,
      asesor: q.asesor,
      url_documento: q.url_documento,
      items: q.items ? [...q.items] : undefined,
    })
    setDrawerMode("create")
    setIsDrawerOpen(true)
  }

  const openCreate = () => {
    setSelectedQuote(null)
    setFormState({
      cliente: "",
      fecha: new Date().toISOString().split("T")[0],
      fechaVence: "",
      servicios: [],
      montos: [],
      total: "$ 0",
      estado: "Borrador",
      notas: "",
      nombre_evento: "",
      fecha_evento: "",
      hora_inicio: "",
      hora_fin: "",
      direccion: "",
      aforo_esperado: undefined,
      asesor: "",
      items: [],
    })
    setDrawerMode("create")
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedQuote(null)
  }

  const handleDelete = (r: CotizacionItem) => {
    if (confirm(`¿Eliminar cotización ${r.codigo}?`)) {
      setQuotes((prev) => prev.filter((q) => q.id !== r.id))
      setSelectedIds((prev) => prev.filter((id) => id !== r.id))
      toast.success("Cotización eliminada")
    }
  }

  // Bulk actions handlers (Shopify Polaris)
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleToggleSelectAll = () => {
    const pageIds = paginatedData.map((q) => q.id)
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
    setFilterCliente("Todos")
    setFilterEstado("Todos")
    setCurrentPage(1)
  }

  const isFiltered = Boolean(
    search || filterCliente !== "Todos" || filterEstado !== "Todos",
  )

  const handleBulkAccept = () => {
    setQuotes((prev) =>
      prev.map((q) =>
        selectedIds.includes(q.id) ? { ...q, estado: "Aceptada" } : q,
      ),
    )
    toast.success(`${selectedIds.length} cotización(es) aceptadas`)
    setSelectedIds([])
  }

  const handleBulkSend = () => {
    setQuotes((prev) =>
      prev.map((q) =>
        selectedIds.includes(q.id) ? { ...q, estado: "Enviada" } : q,
      ),
    )
    toast.info(`${selectedIds.length} cotización(es) marcadas como enviadas`)
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    if (
      confirm(`¿Eliminar las ${selectedIds.length} cotizaciones seleccionadas?`)
    ) {
      setQuotes((prev) => prev.filter((q) => !selectedIds.includes(q.id)))
      toast.success(`${selectedIds.length} cotización(es) eliminadas`)
      setSelectedIds([])
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.cliente?.trim()) {
      toast.error("El cliente es obligatorio")
      return
    }

    if (selectedQuote) {
      setQuotes((prev) =>
        prev.map((q) =>
          q.id === selectedQuote.id
            ? {
                ...q,
                ...formState,
                servicios: formState.servicios || q.servicios,
              } as CotizacionItem
            : q,
        ),
      )
      toast.success("Cotización actualizada exitosamente")
    } else {
      const nextNum = quotes.length + 1
      const newQuote: CotizacionItem = {
        ...formState,
        id: String(Date.now()),
        codigo: `COT-2026-${String(nextNum).padStart(3, "0")}`,
        cliente: formState.cliente || "",
        nombre_evento: formState.nombre_evento || "",
        fecha: formState.fecha || new Date().toISOString().split("T")[0],
        fechaVence: formState.fechaVence || "",
        servicios: formState.servicios || [],
        montos: formState.montos || ["$ 0"],
        total: formState.total || "$ 0",
        totalNum: formState.totalNum ?? 0,
        estado: "Borrador",
        notas: formState.notas || "",
      }
      setQuotes([newQuote, ...quotes])
      toast.success("Cotización creada exitosamente")
    }
    closeDrawer()
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title="Cotizaciones"
          actionLabel="Crear cotización"
          onAction={openCreate}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (filterEstado !== "Todos" ? 1 : 0) +
            (filterCliente !== "Todos" ? 1 : 0)
          }
          activeFilterPills={[
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
            ...(filterCliente !== "Todos"
              ? [
                  {
                    key: "cliente",
                    label: `Cliente: ${filterCliente}`,
                    onClear: () => {
                      setFilterCliente("Todos")
                      setCurrentPage(1)
                    },
                  },
                ]
              : []),
          ]}
          onResetFilters={() => {
            setFilterEstado("Todos")
            setFilterCliente("Todos")
            setCurrentPage(1)
          }}
        >
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

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Cliente
            </label>
            <CustomSelect
              value={filterCliente}
              onChange={(val) => {
                setFilterCliente(val)
                setCurrentPage(1)
              }}
              options={clienteFilterOptions}
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
        <CotizacionTable
          quotes={paginatedData}
          totalCount={filteredData.length}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEmptyAction={openCreate}
          onResetFilters={resetFilters}
          isFiltered={isFiltered}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          onPageChange={setCurrentPage}
          onStatusChange={advanceEstado}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onSend={sendQuote}
          onDownloadPdf={(row) =>
            printDocumentPdf({
              tipoDocumento: "Cotización Comercial",
              codigo: row.codigo,
              fecha: row.fecha,
              terceroLabel: "Cliente",
              terceroNombre: row.cliente,
              evento: row.nombre_evento,
              estado: row.estado,
              total: row.total,
              items: (row.servicios || []).map((s, idx) => ({
                descripcion: s,
                valor: row.montos?.[idx] || row.total,
              })),
              notas: row.notas,
            })
          }
        />
      </main>

      {/* Bulk Actions Bar (Shopify Polaris) */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        totalCount={filteredData.length}
        onClearSelection={() => setSelectedIds([])}
        actions={[
          {
            label: "Aceptar cotizaciones",
            onClick: handleBulkAccept,
            variant: "success",
            icon: CheckCircle2,
          },
          {
            label: "Enviar cotizaciones",
            onClick: handleBulkSend,
            variant: "primary",
            icon: Send,
          },
          {
            label: "Eliminar",
            onClick: handleBulkDelete,
            variant: "danger",
            icon: Trash2,
          },
        ]}
      />

      {/* Detail Drawer */}
      <CotizacionDetailDrawer
        isOpen={isDrawerOpen && drawerMode === "view"}
        quote={selectedQuote}
        onClose={closeDrawer}
        onAdvanceEstado={advanceEstado}
        onSendEmail={(q) => {
          window.location.href = `mailto:?subject=${encodeURIComponent(`Cotización ${q.codigo} - The High Events`)}&body=${encodeURIComponent(`Hola ${q.cliente},\n\nAdjuntamos los detalles de la cotización ${q.codigo} para el evento "${q.nombre_evento}" por un total de ${q.total}.`)}`
        }}
        onDownloadPdf={(q) =>
          printDocumentPdf({
            tipoDocumento: "Cotización Comercial",
            codigo: q.codigo,
            fecha: q.fecha,
            terceroLabel: "Cliente",
            terceroNombre: q.cliente,
            evento: q.nombre_evento,
            estado: q.estado,
            total: q.total,
            items: (q.servicios || []).map((s, idx) => ({
              descripcion: s,
              valor: q.montos?.[idx] || q.total,
            })),
            notas: q.notas,
          })
        }
        onOpenEdit={openEdit}
      />

      {/* Form Drawer */}
      <CotizacionFormDrawer
        isOpen={isDrawerOpen && drawerMode === "create"}
        quote={selectedQuote}
        formState={formState}
        setFormState={setFormState}
        onClose={closeDrawer}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
