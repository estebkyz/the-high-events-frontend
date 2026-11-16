import { usePagination } from "../../hooks/usePagination"
import React, { useState, useMemo } from "react"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { useToast } from "../../components/Toast"
import { INITIAL_PRESTAMOS } from "./data"
import { PrestamoTable } from "./components/PrestamoTable"
import { PrestamoFormDrawer } from "./drawers/PrestamoFormDrawer"
import { PrestamoDetailDrawer } from "./drawers/PrestamoDetailDrawer"
import { PrestamoReturnDrawer } from "./drawers/PrestamoReturnDrawer"
import type {
  PrestamoItem,
  PrestamoDrawerMode,
  PrestamoFormData,
  PrestamoEstado,
} from "./types"

export default function PrestamosPage() {
  const toast = useToast()
  const [prestamos, setPrestamos] = useState<PrestamoItem[]>(INITIAL_PRESTAMOS)

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filter Tab (Polaris Quick Views)
  const [activeTab, setActiveTab] = useState<string>("Todos")

  // Drawer
  const [drawerMode, setDrawerMode] = useState<PrestamoDrawerMode>("none")
  const [selectedPrestamo, setSelectedPrestamo] = useState<PrestamoItem | null>(
    null,
  )
  const [editForm, setEditForm] = useState<PrestamoFormData>({})

  // Return flow state
  const [returnConditions, setReturnConditions] =
    useState<Record<string, string>>({})
  const [returnDate, setReturnDate] = useState("2026-09-18")
  const [returnObs, setReturnObs] = useState("")

  const statusCounts = useMemo(() => {
    return {
      Todos: prestamos.length,
      Activo: prestamos.filter((p) => p.estado === "Activo").length,
      Devuelto: prestamos.filter((p) => p.estado === "Devuelto").length,
      "Con Retraso": prestamos.filter((p) => p.estado === "Con Retraso").length,
      "Con Daños": prestamos.filter((p) => p.estado === "Con Daños").length,
    }
  }, [prestamos])

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todos", count: statusCounts.Todos },
      { id: "Activo", label: "Activos", count: statusCounts.Activo },
      { id: "Devuelto", label: "Devueltos", count: statusCounts.Devuelto },
      { id: "Con Retraso", label: "Con Retraso", count: statusCounts["Con Retraso"] },
      { id: "Con Daños", label: "Con Daños", count: statusCounts["Con Daños"] },
    ],
    [statusCounts],
  )

  const filteredData = useMemo(() => {
    return prestamos.filter((p) => {
      const q = search.toLowerCase()
      if (
        q &&
        !p.responsable.toLowerCase().includes(q) &&
        !p.evento.toLowerCase().includes(q)
      )
        return false
      if (activeTab !== "Todos" && p.estado !== activeTab) return false
      return true
    })
  }, [prestamos, search, activeTab])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  const openReturn = (p: PrestamoItem) => {
    setSelectedPrestamo(p)
    const initial: Record<string, string> = {}
    p.equipos.forEach((eq) => {
      initial[eq.id] = "Bueno"
    })
    setReturnConditions(initial)
    setReturnDate(new Date().toISOString().split("T")[0])
    setReturnObs("")
    setDrawerMode("return")
  }

  const confirmReturn = () => {
    if (!selectedPrestamo) return
    const hasDamages = Object.values(returnConditions).some(
      (c) => c === "Daño Leve" || c === "Daño Mayor",
    )
    const isLate = returnDate > selectedPrestamo.fechaDevolucion

    let finalEstado: PrestamoEstado = "Devuelto"
    if (hasDamages) {
      finalEstado = "Con Daños"
    } else if (isLate) {
      finalEstado = "Con Retraso"
    }

    setPrestamos((prev) =>
      prev.map((p) =>
        p.id === selectedPrestamo.id
          ? {
              ...p,
              estado: finalEstado,
              fecha_devolucion_real: returnDate,
              observaciones_devolucion: returnObs.trim() || undefined,
            }
          : p,
      ),
    )
    toast.success(`Préstamo ${selectedPrestamo.codigo} registrado como ${finalEstado}`)
    setDrawerMode("none")
  }

  const handleStatusChange = (id: string, newEstado: PrestamoEstado) => {
    setPrestamos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: newEstado } : p)),
    )
    toast.info(`Estado del préstamo actualizado a ${newEstado}`)
  }

  const handleDelete = (p: PrestamoItem) => {
    if (confirm(`¿Eliminar préstamo de ${p.responsable}?`)) {
      setPrestamos((prev) => prev.filter((item) => item.id !== p.id))
      toast.success("Préstamo eliminado")
    }
  }

  const handleCreatePrestamo = (e: React.FormEvent) => {
    e.preventDefault()
    const newP: PrestamoItem = {
      id: String(Date.now()),
      codigo: `PR-${100 + prestamos.length + 4}`,
      responsable: editForm.responsable ?? "",
      evento: editForm.evento ?? "",
      equipos: [],
      fechaSalida: editForm.fechaSalida ?? new Date().toISOString().split("T")[0],
      fechaDevolucion: editForm.fechaDevolucion ?? "",
      estado: "Activo",
    }
    setPrestamos((prev) => [newP, ...prev])
    toast.success("Préstamo registrado exitosamente")
    setDrawerMode("none")
  }

  const handleUpdatePrestamo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPrestamo) return
    setPrestamos((prev) =>
      prev.map((p) =>
        p.id === selectedPrestamo.id
          ? {
              ...p,
              responsable: editForm.responsable ?? p.responsable,
              evento: editForm.evento ?? p.evento,
              fechaDevolucion: editForm.fechaDevolucion ?? p.fechaDevolucion,
            }
          : p,
      ),
    )
    toast.success("Préstamo actualizado exitosamente")
    setDrawerMode("none")
  }

  const openView = (p: PrestamoItem) => {
    setSelectedPrestamo(p)
    setDrawerMode("view")
  }

  const openEdit = (p: PrestamoItem) => {
    setSelectedPrestamo(p)
    setEditForm({
      responsable: p.responsable,
      evento: p.evento,
      fechaSalida: p.fechaSalida,
      fechaDevolucion: p.fechaDevolucion,
    })
    setDrawerMode("edit")
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title="Préstamos"
          actionLabel="Crear préstamo"
          onAction={() => {
            setSelectedPrestamo(null)
            setEditForm({
              responsable: "",
              evento: "",
              fechaSalida: "2026-09-18",
              fechaDevolucion: "2026-09-20",
            })
            setDrawerMode("new")
          }}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={0}
        />

        {/* ── Shopify Polaris IndexTabs: Vistas Rápidas ── */}
        <IndexTabs
          tabs={quickTabs}
          activeTab={activeTab}
          onTabChange={(newTab) => {
            setActiveTab(newTab)
            setCurrentPage(1)
          }}
        />

        {/* ── Tabla Modularizada y Paginación ── */}
        <PrestamoTable
          prestamos={paginatedData}
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
          onOpenReturn={openReturn}
        />
      </main>

      {/* Form Drawer (New / Edit) */}
      <PrestamoFormDrawer
        mode={drawerMode === "edit" ? "edit" : "new"}
        isOpen={drawerMode === "new" || drawerMode === "edit"}
        onClose={() => setDrawerMode("none")}
        prestamo={selectedPrestamo}
        formData={editForm}
        setFormData={setEditForm}
        onSubmit={
          drawerMode === "edit" ? handleUpdatePrestamo : handleCreatePrestamo
        }
      />

      {/* Detail Drawer */}
      <PrestamoDetailDrawer
        isOpen={drawerMode === "view"}
        onClose={() => setDrawerMode("none")}
        prestamo={selectedPrestamo}
        onOpenReturn={openReturn}
      />

      {/* Return Registration Drawer */}
      <PrestamoReturnDrawer
        isOpen={drawerMode === "return"}
        onClose={() => setDrawerMode("none")}
        prestamo={selectedPrestamo}
        returnConditions={returnConditions}
        onConditionChange={(id, val) =>
          setReturnConditions((prev) => ({ ...prev, [id]: val }))
        }
        returnDate={returnDate}
        onReturnDateChange={setReturnDate}
        returnObs={returnObs}
        onReturnObsChange={setReturnObs}
        onConfirm={confirmReturn}
        onBackToView={() => setDrawerMode("view")}
      />
    </div>
  )
}
