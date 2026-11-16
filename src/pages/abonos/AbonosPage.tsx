import { usePagination } from "../../hooks/usePagination"
import React, { useState, useMemo, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Users, Truck, CheckCircle2, Download, Trash2 } from "lucide-react"
import { PageHeader } from "../../components/PageHeader"
import { BulkActionsBar } from "../../components/BulkActionsBar"
import { useToast } from "../../components/Toast"
import { INITIAL_ABONOS } from "./data"
import { AbonoTable } from "./components/AbonoTable"
import { AbonosKPIs } from "./components/AbonosKPIs"
import { AbonoDetailDrawer } from "./drawers/AbonoDetailDrawer"
import { AbonoFormDrawer } from "./drawers/AbonoFormDrawer"
import type {
  AbonoItem,
  AbonoDrawerMode,
  AbonoFormData,
  TipoAbonoTab,
  AbonosKPIsData,
  PagoFormState,
  PaymentHistoryEntry,
} from "./types"

export default function AbonosPage() {
  const toast = useToast()
  const location = useLocation()
  const [abonos, setAbonos] = useState<AbonoItem[]>(INITIAL_ABONOS)
  const [selectedAbono, setSelectedAbono] = useState<AbonoItem | null>(null)
  const [drawerMode, setDrawerMode] = useState<AbonoDrawerMode>("create")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Selection for Bulk Actions (Shopify Polaris)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Pestaña Activa: 'Clientes' o 'Proveedores' (Regla de negocio UI/UX)
  const [activeTab, setActiveTab] = useState<TipoAbonoTab>("Clientes")

  // Form State para creación y edición de abonos
  const [formState, setFormState] = useState<AbonoFormData>({})
  const [showPagoForm, setShowPagoForm] = useState(false)

  // Auto precargar datos cuando viene de una cotización aceptada
  useEffect(() => {
    const st = location.state as {
      fromQuote?: boolean
      cotizacionCodigo?: string
      cliente?: string
      evento?: string
      total?: string
    } | null
    if (st?.fromQuote) {
      const rawTotal = st.total || "$ 0"
      const cleanNum = Number(rawTotal.replace(/[^0-9]/g, "")) || 0
      const half = Math.round(cleanNum * 0.5)
      const halfFmt = `$ ${half.toLocaleString("es-CO")}`

      setActiveTab("Clientes")
      setDrawerMode("create")
      setFormState({
        tipoCartera: "Clientes",
        evento: st.evento || `Evento de ${st.cliente || ""}`,
        cliente: st.cliente || "",
        total: rawTotal,
        totalNum: cleanNum,
        anticipo: halfFmt,
        anticipoNum: half,
        saldo: halfFmt,
        saldoNum: half,
        estadoAnticipo: "Pendiente",
        estadoSaldo: "Pendiente",
        porcentaje: 0,
        historial: [],
      })
      setIsDrawerOpen(true)
      toast.info(
        `Registrando plan de abonos para cotización ${st.cotizacionCodigo || ""}`,
      )
    }
  }, [location.state])

  // Form State para registrar transacción (pago_cliente / pago_proveedor)
  const [pagoForm, setPagoForm] = useState<PagoFormState>({
    tipoPago: "Anticipo",
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    metodo: "Transferencia",
    comprobante: "",
    estado: "Pagado",
    observaciones: "",
    verificacionCondicion: false,
  })

  const isClientes = activeTab === "Clientes"

  // Filtrado por pestaña y búsqueda en tiempo real
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase()
    return abonos.filter((a) => {
      if (a.tipoCartera !== activeTab) return false
      if (!q) return true
      const matchEvento = a.evento.toLowerCase().includes(q)
      const matchCliente = a.cliente
        ? a.cliente.toLowerCase().includes(q)
        : false
      const matchProveedor = a.proveedor
        ? a.proveedor.toLowerCase().includes(q)
        : false
      const matchServicio = a.servicio
        ? a.servicio.toLowerCase().includes(q)
        : false
      return matchEvento || matchCliente || matchProveedor || matchServicio
    })
  }, [abonos, activeTab, search])

  // Paginación
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  // Cálculo de KPIs financieros
  const kpis: AbonosKPIsData = useMemo(() => {
    const clientList = abonos.filter((a) => a.tipoCartera === "Clientes")
    const supplierList = abonos.filter((a) => a.tipoCartera === "Proveedores")

    const anticiposClientes = clientList
      .filter((a) => a.estadoAnticipo === "Pagado")
      .reduce((sum, a) => sum + a.anticipoNum, 0)
    const saldosPendClientes = clientList
      .filter((a) => a.estadoSaldo === "Pendiente")
      .reduce((sum, a) => sum + a.saldoNum, 0)
    const anticiposProv = supplierList
      .filter((a) => a.estadoAnticipo === "Pagado")
      .reduce((sum, a) => sum + a.anticipoNum, 0)
    const saldosPendProv = supplierList
      .filter((a) => a.estadoSaldo === "Pendiente")
      .reduce((sum, a) => sum + a.saldoNum, 0)

    return {
      anticiposClientes,
      saldosPendClientes,
      anticiposProv,
      saldosPendProv,
    }
  }, [abonos])

  // Handlers estandarizados para apertura de Drawers
  const openCreate = () => {
    setSelectedAbono(null)
    setFormState({
      evento: "",
      cliente: "",
      proveedor: "",
      servicio: "",
      total: "",
      anticipo: "",
      saldo: "",
      porcentaje: 0,
      estadoAnticipo: "Pendiente",
      estadoSaldo: "Pendiente",
      fechaPago: new Date().toISOString().split("T")[0],
      observaciones: "",
    })
    setDrawerMode("create")
    setIsDrawerOpen(true)
  }

  const openEdit = (row: AbonoItem) => {
    setSelectedAbono(row)
    setFormState({ ...row })
    setDrawerMode("edit")
    setIsDrawerOpen(true)
  }

  const openView = (row: AbonoItem) => {
    setSelectedAbono(row)
    setShowPagoForm(false)
    setDrawerMode("view")
    setIsDrawerOpen(true)
  }

  // Botón de billete [ 💵 ] para registrar nuevo abono / pago
  const openRegistrarAbono = (row: AbonoItem) => {
    setSelectedAbono(row)
    const tipoPago = row.estadoAnticipo === "Pendiente" ? "Anticipo" : "Saldo"
    const monto = tipoPago === "Anticipo" ? row.anticipo : row.saldo

    setPagoForm({
      tipoPago,
      monto,
      fecha: new Date().toISOString().split("T")[0],
      metodo: "Transferencia",
      comprobante: `TR-${Date.now().toString().slice(-6)}`,
      estado: "Pagado",
      observaciones: "",
      verificacionCondicion: isClientes
        ? !!row.eventoFinalizado
        : !!row.cumplimientoVerificado,
    })
    setShowPagoForm(true)
    setDrawerMode("payment")
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedAbono(null)
    setShowPagoForm(false)
  }

  const handleDelete = (row: AbonoItem) => {
    const entidad =
      row.tipoCartera === "Clientes"
        ? `del cliente ${row.cliente || row.evento}`
        : `del proveedor ${row.proveedor || row.evento}`
    if (confirm(`¿Eliminar el registro de abono ${entidad}?`)) {
      setAbonos((prev) => prev.filter((a) => a.id !== row.id))
      setSelectedIds((prev) => prev.filter((id) => id !== row.id))
      toast.success("Registro eliminado exitosamente")
    }
  }

  // Bulk actions handlers (Shopify Polaris)
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleToggleSelectAll = () => {
    const pageIds = paginatedData.map((a) => a.id)
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
    setCurrentPage(1)
  }

  const isFiltered = Boolean(search)

  const handleBulkLiquidate = () => {
    setAbonos((prev) =>
      prev.map((a) =>
        selectedIds.includes(a.id)
          ? {
              ...a,
              estadoAnticipo: "Pagado",
              estadoSaldo: "Pagado",
              porcentaje: 100,
            }
          : a,
      ),
    )
    toast.success(
      `${selectedIds.length} acuerdo(s) de cartera liquidados al 100%`,
    )
    setSelectedIds([])
  }

  const handleBulkReceipts = () => {
    toast.info(
      `Generando recibos de caja en PDF para ${selectedIds.length} registro(s)...`,
    )
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    if (
      confirm(
        `¿Eliminar los ${selectedIds.length} registros de cartera seleccionados?`,
      )
    ) {
      setAbonos((prev) => prev.filter((a) => !selectedIds.includes(a.id)))
      toast.success(`${selectedIds.length} registro(s) eliminados`)
      setSelectedIds([])
    }
  }

  // Registrar Transacción (pago_cliente o pago_proveedor)
  const handlePagoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAbono || !pagoForm.monto) {
      toast.error("El monto del pago es obligatorio")
      return
    }

    if (!pagoForm.comprobante.trim()) {
      toast.error("El comprobante o referencia de transacción es obligatorio")
      return
    }

    // Regla de Negocio para Saldo 50%
    if (pagoForm.tipoPago === "Saldo" && !pagoForm.verificacionCondicion) {
      if (isClientes) {
        toast.error(
          "Para registrar el saldo del cliente, debes confirmar que el evento ha finalizado satisfactoriamente.",
        )
        return
      } else {
        toast.error(
          "Para registrar el saldo al proveedor, debes confirmar que se ha verificado el cumplimiento del servicio.",
        )
        return
      }
    }

    const montoNum = Number(pagoForm.monto.replace(/[^0-9]/g, "")) || 0
    const newTxId = isClientes
      ? `PC-${Date.now().toString().slice(-4)}`
      : `PP-${Date.now().toString().slice(-4)}`

    const newHistoryEntry: PaymentHistoryEntry = {
      id: newTxId,
      fecha: pagoForm.fecha || new Date().toISOString().split("T")[0],
      monto: pagoForm.monto,
      montoNum,
      metodo: pagoForm.metodo,
      concepto: pagoForm.tipoPago === "Anticipo" ? "Anticipo" : "Saldo",
      tipoPago: pagoForm.tipoPago,
      comprobante: pagoForm.comprobante.trim(),
      estado: pagoForm.estado,
      observaciones: pagoForm.observaciones.trim() || undefined,
    }

    const updateItem = (item: AbonoItem): AbonoItem => {
      if (item.id !== selectedAbono.id) return item

      let nuevoEstadoAnticipo = item.estadoAnticipo
      let nuevoEstadoSaldo = item.estadoSaldo
      let nuevaFechaAnticipo = item.fechaAnticipo
      let nuevaFechaSaldo = item.fechaSaldo

      if (pagoForm.tipoPago === "Anticipo") {
        nuevoEstadoAnticipo = "Pagado"
        nuevaFechaAnticipo = pagoForm.fecha
      } else if (pagoForm.tipoPago === "Saldo") {
        nuevoEstadoSaldo = "Pagado"
        nuevaFechaSaldo = pagoForm.fecha
      }

      const totalCalculado =
        (nuevoEstadoAnticipo === "Pagado" ? 50 : 0) +
        (nuevoEstadoSaldo === "Pagado" ? 50 : 0)

      return {
        ...item,
        estadoAnticipo: nuevoEstadoAnticipo,
        estadoSaldo: nuevoEstadoSaldo,
        fechaAnticipo: nuevaFechaAnticipo,
        fechaSaldo: nuevaFechaSaldo,
        eventoFinalizado: isClientes
          ? pagoForm.verificacionCondicion || item.eventoFinalizado
          : item.eventoFinalizado,
        cumplimientoVerificado: !isClientes
          ? pagoForm.verificacionCondicion || item.cumplimientoVerificado
          : item.cumplimientoVerificado,
        porcentaje: totalCalculado,
        historial: [newHistoryEntry, ...item.historial],
      }
    }

    setAbonos((prev) => prev.map(updateItem))

    toast.success(
      isClientes
        ? `Transacción de cliente registrada exitosamente (${pagoForm.tipoPago})`
        : `Pago a proveedor registrado exitosamente (${pagoForm.tipoPago})`,
    )

    setShowPagoForm(false)
    setSelectedAbono((prev) => (prev ? updateItem(prev) : null))
  }

  // Crear o Editar acuerdo general de abono
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.evento?.trim()) {
      toast.error("El nombre del evento es requerido")
      return
    }

    if (drawerMode === "edit" && selectedAbono) {
      setAbonos((prev) =>
        prev.map((a) =>
          a.id === selectedAbono.id ? { ...a, ...formState } as AbonoItem : a,
        ),
      )
      toast.success("Acuerdo de abono actualizado correctamente")
    } else {
      const totalNum =
        Number((formState.total || "").replace(/[^0-9]/g, "")) || 0
      const anticipoNum =
        Number((formState.anticipo || "").replace(/[^0-9]/g, "")) ||
        Math.round(totalNum * 0.5)
      const saldoNum = Math.max(0, totalNum - anticipoNum)

      const nuevo: AbonoItem = {
        id: String(Date.now()),
        tipoCartera: activeTab,
        evento: formState.evento || "",
        cliente: formState.cliente || "",
        proveedor: formState.proveedor || "",
        servicio: formState.servicio || "",
        total: formState.total || "$ 0",
        totalNum,
        anticipo:
          formState.anticipo || `$ ${anticipoNum.toLocaleString("es-CO")}`,
        anticipoNum,
        saldo: formState.saldo || `$ ${saldoNum.toLocaleString("es-CO")}`,
        saldoNum,
        porcentaje:
          formState.estadoAnticipo === "Pagado"
            ? formState.estadoSaldo === "Pagado"
              ? 100
              : 50
            : 0,
        estadoAnticipo: formState.estadoAnticipo || "Pendiente",
        estadoSaldo: formState.estadoSaldo || "Pendiente",
        fechaPago:
          formState.fechaPago || new Date().toISOString().split("T")[0],
        observaciones: formState.observaciones || "",
        historial: [],
      }

      setAbonos((prev) => [nuevo, ...prev])
      toast.success(
        isClientes
          ? "Nuevo abono de cliente registrado exitosamente"
          : "Nuevo contrato con proveedor registrado exitosamente",
      )
    }
    closeDrawer()
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title={isClientes ? "Abonos" : "Pagos"}
          actionLabel={isClientes ? "Crear abono" : "Crear pago"}
          onAction={openCreate}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={0}
        />

        {/* ── PESTAÑAS PRINCIPALES UI/UX (Clientes vs Proveedores) ── */}
        <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-2.5 shadow-sm space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Botones de Pestaña */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("Clientes")
                  setCurrentPage(1)
                  setSearch("")
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "Clientes"
                    ? "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/25"
                    : "bg-[#111318] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#3B455A]"
                }`}
              >
                <Users size={16} />
                <span>Clientes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("Proveedores")
                  setCurrentPage(1)
                  setSearch("")
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "Proveedores"
                    ? "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/25"
                    : "bg-[#111318] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#3B455A]"
                }`}
              >
                <Truck size={16} />
                <span>Proveedores</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary KPI Cards Contextualizados */}
        <AbonosKPIs kpis={kpis} activeTab={activeTab} />

        {/* ── Tabla Modularizada y Paginación ── */}
        <AbonoTable
          abonos={paginatedData}
          activeTab={activeTab}
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
          onRegistrarAbono={openRegistrarAbono}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onGenerarRecibo={(row) =>
            toast.info(`Generando comprobante en PDF para ${row.evento}...`)
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
            label: "Liquidar Saldos (100%)",
            onClick: handleBulkLiquidate,
            variant: "success",
            icon: CheckCircle2,
          },
          {
            label: "Generar Recibos PDF",
            onClick: handleBulkReceipts,
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

      {/* Detail Drawer (Transacciones de pago_cliente o pago_proveedor) */}
      <AbonoDetailDrawer
        isOpen={
          isDrawerOpen &&
          (drawerMode === "view" || drawerMode === "payment") &&
          !!selectedAbono
        }
        abono={selectedAbono}
        onClose={closeDrawer}
        showPagoForm={showPagoForm}
        setShowPagoForm={setShowPagoForm}
        pagoForm={pagoForm}
        setPagoForm={setPagoForm}
        onPagoSubmit={handlePagoSubmit}
        onGenerarRecibo={() => {
          if (selectedAbono)
            toast.success(`Comprobante generado para ${selectedAbono.evento}`)
        }}
      />

      {/* Create / Edit Drawer (Crear o Editar acuerdo general) */}
      <AbonoFormDrawer
        isOpen={
          isDrawerOpen && (drawerMode === "create" || drawerMode === "edit")
        }
        activeTab={activeTab}
        mode={drawerMode === "edit" ? "edit" : "create"}
        abono={selectedAbono}
        formState={formState}
        setFormState={setFormState}
        onClose={closeDrawer}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
