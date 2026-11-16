import { usePagination } from "../../hooks/usePagination"
import React, { useState, useMemo } from "react"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { BulkActionsBar } from "../../components/BulkActionsBar"
import { useToast } from "../../components/Toast"
import { CheckCircle2, Download, Trash2 } from "lucide-react"
import { INITIAL_SALES, ESTADO_PAGO_OPTIONS } from "./data"
import { VentaTable } from "./components/VentaTable"
import { VentasKPIs } from "./components/VentasKPIs"
import { VentaDetailDrawer } from "./drawers/VentaDetailDrawer"
import { VentaFormDrawer } from "./drawers/VentaFormDrawer"
import type {
  VentaItem,
  VentaDrawerMode,
  VentaFormData,
  EstadoPagoVenta,
  TipoVenta,
  VentasKPIsData,
} from "./types"

export default function VentasPage() {
  const toast = useToast()
  const [sales, setSales] = useState<VentaItem[]>(INITIAL_SALES)

  // Selection for Bulk Actions (Shopify Polaris)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filters
  const [filterTipo, setFilterTipo] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  const statusCounts = useMemo(() => {
    return {
      Todos: sales.length,
      Pendiente: sales.filter((s) => s.estadoPago === "Pendiente").length,
      Parcial: sales.filter((s) => s.estadoPago === "Parcial").length,
      Pagado: sales.filter((s) => s.estadoPago === "Pagado").length,
    }
  }, [sales])

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todas", count: statusCounts.Todos },
      { id: "Pendiente", label: "Pendientes", count: statusCounts.Pendiente },
      { id: "Parcial", label: "Parciales", count: statusCounts.Parcial },
      { id: "Pagado", label: "Pagadas", count: statusCounts.Pagado },
    ],
    [statusCounts],
  )

  // Drawer
  const [drawerMode, setDrawerMode] = useState<VentaDrawerMode>("none")
  const [selectedSale, setSelectedSale] = useState<VentaItem | null>(null)
  const [formState, setFormState] = useState<VentaFormData>({
    tipo: "Cliente",
    clienteEvento: "",
    total: "",
    estadoPago: "Pendiente",
  })

  const filteredData = useMemo(() => {
    return sales.filter((s) => {
      const q = search.toLowerCase()
      if (q && !s.clienteEvento.toLowerCase().includes(q)) return false
      if (filterTipo !== "Todos" && s.tipo !== filterTipo) return false
      if (filterEstado !== "Todos" && s.estadoPago !== filterEstado)
        return false
      return true
    })
  }, [sales, search, filterTipo, filterEstado])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  // Cálculo de KPIs de ventas
  const kpis: VentasKPIsData = useMemo(() => {
    let totalVentasCOP = 0
    let cobradoCOP = 0
    let pendienteCOP = 0
    let cobradoCount = 0
    let pendienteCount = 0
    let clientesCount = 0
    let propiosCount = 0

    sales.forEach((s) => {
      totalVentasCOP += s.totalNum
      if (s.estadoPago === "Pagado") {
        cobradoCOP += s.totalNum
        cobradoCount += 1
      } else if (s.estadoPago === "Parcial") {
        const medio = Math.round(s.totalNum * 0.5)
        cobradoCOP += medio
        pendienteCOP += s.totalNum - medio
        pendienteCount += 1
      } else {
        pendienteCOP += s.totalNum
        pendienteCount += 1
      }

      if (s.tipo === "Cliente") {
        clientesCount += 1
      } else {
        propiosCount += 1
      }
    })

    return {
      totalVentasCOP,
      totalVentasCount: sales.length,
      cobradoCOP,
      cobradoCount,
      pendienteCOP,
      pendienteCount,
      clientesCount,
      propiosCount,
    }
  }, [sales])

  const handleStatusChangeById = (id: string, nuevoEstado: EstadoPagoVenta) => {
    setSales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estadoPago: nuevoEstado } : s)),
    )
    setSelectedSale((prev) =>
      prev && prev.id === id ? { ...prev, estadoPago: nuevoEstado } : prev,
    )
    toast.info(`Estado de pago actualizado a ${nuevoEstado}`)
  }

  const handleChangePago = (sale: VentaItem, nuevoEstado: EstadoPagoVenta) => {
    handleStatusChangeById(sale.id, nuevoEstado)
  }

  const handleDownloadInvoice = (sale: VentaItem) => {
    toast.info(`Generando comprobante para ${sale.clienteEvento}...`)
  }

  const openCreate = () => {
    setSelectedSale(null)
    setFormState({
      tipo: "Cliente",
      clienteEvento: "",
      total: "",
      estadoPago: "Pendiente",
    })
    setDrawerMode("create")
  }

  const openEdit = (sale: VentaItem) => {
    setSelectedSale(sale)
    setFormState({ ...sale })
    setDrawerMode("edit")
  }

  const openView = (sale: VentaItem) => {
    setSelectedSale(sale)
    setDrawerMode("view")
  }

  const closeDrawer = () => {
    setDrawerMode("none")
    setSelectedSale(null)
  }

  const handleDelete = (r: VentaItem) => {
    if (confirm(`¿Eliminar registro de venta ${r.clienteEvento}?`)) {
      setSales((prev) => prev.filter((s) => s.id !== r.id))
      setSelectedIds((prev) => prev.filter((id) => id !== r.id))
      toast.success("Venta eliminada")
    }
  }

  // Bulk actions handlers (Shopify Polaris)
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleToggleSelectAll = () => {
    const pageIds = paginatedData.map((s) => s.id)
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
    setFilterTipo("Todos")
    setFilterEstado("Todos")
    setCurrentPage(1)
  }

  const isFiltered = Boolean(
    search || filterTipo !== "Todos" || filterEstado !== "Todos",
  )

  const handleBulkMarkPaid = () => {
    setSales((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) ? { ...s, estadoPago: "Pagado" } : s,
      ),
    )
    toast.success(`${selectedIds.length} venta(s) marcadas como pagadas`)
    setSelectedIds([])
  }

  const handleBulkExport = () => {
    toast.info(
      `Exportando comprobantes de ${selectedIds.length} venta(s) en PDF...`,
    )
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    if (confirm(`¿Eliminar las ${selectedIds.length} ventas seleccionadas?`)) {
      setSales((prev) => prev.filter((s) => !selectedIds.includes(s.id)))
      toast.success(`${selectedIds.length} venta(s) eliminadas`)
      setSelectedIds([])
    }
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.clienteEvento?.trim()) {
      toast.error("El cliente / evento es obligatorio")
      return
    }

    if (drawerMode === "edit" && selectedSale) {
      setSales((prev) =>
        prev.map((s) =>
          s.id === selectedSale.id ? { ...s, ...formState } as VentaItem : s,
        ),
      )
      toast.success("Venta actualizada")
    } else {
      const numTotal =
        formState.totalNum ||
        Number((formState.total || "").replace(/[^0-9]/g, "")) || 0
      const nextNum = sales.length + 1
      const nueva: VentaItem = {
        id: String(Date.now()),
        codigo: `VEN-2026-${String(nextNum).padStart(3, "0")}`,
        numero_factura: formState.numero_factura || `FACT-2026-${String(nextNum).padStart(3, "0")}`,
        tipo: formState.tipo || "Cliente",
        clienteEvento: formState.clienteEvento || "",
        fecha: formState.fecha || new Date().toISOString().split("T")[0],
        total: formState.total || `$ ${numTotal.toLocaleString("es-CO")}`,
        totalNum: numTotal,
        estadoPago: formState.estadoPago || "Pendiente",
        estado_venta: "Confirmada",
      }
      setSales([nueva, ...sales])
      toast.success("Venta registrada")
    }
    closeDrawer()
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title="Ventas"
          actionLabel="Crear venta"
          onAction={openCreate}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (filterTipo !== "Todos" ? 1 : 0) +
            (filterEstado !== "Todos" ? 1 : 0)
          }
          onResetFilters={() => {
            setFilterTipo("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Tipo de Venta
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]">
              {(["Todos", "Cliente", "Propio"] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => {
                    setFilterTipo(tipo)
                    setCurrentPage(1)
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-center ${
                    filterTipo === tipo
                      ? "bg-[#7C3AED] text-white font-semibold"
                      : "text-[#94A3B8] hover:text-[#F1F5F9]"
                  }`}
                >
                  {tipo === "Cliente"
                    ? "Servicios"
                    : tipo === "Propio"
                      ? "Propios"
                      : tipo}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado de Pago
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
              <option value="Pendiente">Pendiente</option>
              <option value="Parcial">Parcial</option>
              <option value="Pagado">Pagado</option>
            </select>
          </div>
        </PageHeader>

        {/* 4 Summary KPI Cards */}
        <VentasKPIs kpis={kpis} />

        {/* ── Shopify Polaris IndexTabs: Vistas Rápidas ── */}
        <IndexTabs
          tabs={quickTabs}
          activeTab={filterEstado}
          onTabChange={(newTab) => {
            setFilterEstado(newTab)
            setCurrentPage(1)
          }}
        />

        {/* ── Tabla Modularizada y Paginación (Ancho Completo) ── */}
        <VentaTable
          sales={paginatedData}
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
          onStatusChange={handleStatusChangeById}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onDownloadInvoice={handleDownloadInvoice}
        />
      </main>

      {/* Bulk Actions Bar (Shopify Polaris) */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        totalCount={filteredData.length}
        onClearSelection={() => setSelectedIds([])}
        actions={[
          {
            label: "Marcar Pagado",
            onClick: handleBulkMarkPaid,
            variant: "success",
            icon: CheckCircle2,
          },
          {
            label: "Exportar PDF",
            onClick: handleBulkExport,
            variant: "secondary",
            icon: Download,
          },
          {
            label: "Eliminar",
            onClick: handleBulkDelete,
            variant: "danger",
            icon: Trash2,
          },
        ]}
      />

      {/* View Detail Drawer */}
      <VentaDetailDrawer
        isOpen={drawerMode === "view"}
        onClose={closeDrawer}
        sale={selectedSale}
        onChangePago={handleChangePago}
        onDownload={handleDownloadInvoice}
      />

      {/* Create / Edit Drawer */}
      <VentaFormDrawer
        mode={drawerMode === "edit" ? "edit" : "create"}
        isOpen={drawerMode === "create" || drawerMode === "edit"}
        onClose={closeDrawer}
        sale={selectedSale}
        formData={formState}
        setFormData={setFormState}
        onSubmit={handleSaveForm}
      />
    </div>
  )
}
