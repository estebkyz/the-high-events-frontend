import { usePagination } from "../../hooks/usePagination"
import React, { useState, useMemo } from "react"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { CustomSelect } from "../../components/CustomSelect"
import { useToast } from "../../components/Toast"
import { INITIAL_EMPLOYEES, CARGOS } from "./data"
import { getEmpleadoFullName } from "./utils"
import { EmpleadoTable } from "./components/EmpleadoTable"
import { EmpleadoDetailDrawer } from "./drawers/EmpleadoDetailDrawer"
import { EmpleadoFormDrawer } from "./drawers/EmpleadoFormDrawer"
import type {
  EmpleadoItem,
  EmpleadoFormData,
  EmpleadoDrawerMode,
  EstadoEmpleado,
  TipoDocumentoEmpleado,
  VinculacionEmpleado,
} from "./types"

const INITIAL_FORM: EmpleadoFormData = {
  tipo_documento: "CC",
  numero_documento: "",
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  cargo: "Ingeniero de Audio",
  telefono: "",
  correo: "",
  vinculacion: "Fijo",
  estado: "Activo",
  emergenciaNombre: "",
  emergenciaTel: "",
  emergenciaParentesco: "",
}

export default function EmpleadosPage() {
  const toast = useToast()

  const [employees, setEmployees] = useState<EmpleadoItem[]>(INITIAL_EMPLOYEES)
  const [selectedEmp, setSelectedEmp] = useState<EmpleadoItem | null>(null)
  const [drawerMode, setDrawerMode] = useState<EmpleadoDrawerMode>(null)

  // Filtros y paginación
  const [search, setSearch] = useState("")
  const [filterCargo, setFilterCargo] = useState("Todos")
  const [filterVinculacion, setFilterVinculacion] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  // Estado del formulario
  const [formState, setFormState] = useState<EmpleadoFormData>(INITIAL_FORM)

  // Filtrado de colaboradores
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase()
    return employees.filter((e) => {
      const fullName = getEmpleadoFullName(e).toLowerCase()
      const matchSearch =
        !q ||
        fullName.includes(q) ||
        e.cargo.toLowerCase().includes(q) ||
        e.numero_documento.toLowerCase().includes(q) ||
        e.correo.toLowerCase().includes(q)
      const matchCargo = filterCargo === "Todos" || e.cargo === filterCargo
      const matchVinc =
        filterVinculacion === "Todos" || e.vinculacion === filterVinculacion
      const matchEstado = filterEstado === "Todos" || e.estado === filterEstado
      return matchSearch && matchCargo && matchVinc && matchEstado
    })
  }, [employees, search, filterCargo, filterVinculacion, filterEstado])

  // Paginación
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  // Manejadores de Drawers
  const closeDrawer = () => {
    setDrawerMode(null)
    setSelectedEmp(null)
  }

  const openView = (emp: EmpleadoItem) => {
    setSelectedEmp(emp)
    setDrawerMode("view")
  }

  const openCreate = () => {
    setSelectedEmp(null)
    setFormState(INITIAL_FORM)
    setDrawerMode("create")
  }

  const openEdit = (emp: EmpleadoItem) => {
    setSelectedEmp(emp)
    setFormState({
      tipo_documento: emp.tipo_documento,
      numero_documento: emp.numero_documento,
      primer_nombre: emp.primer_nombre,
      segundo_nombre: emp.segundo_nombre || "",
      primer_apellido: emp.primer_apellido,
      segundo_apellido: emp.segundo_apellido || "",
      cargo: emp.cargo,
      telefono: emp.telefono,
      correo: emp.correo,
      vinculacion: emp.vinculacion || "Fijo",
      estado: emp.estado,
      emergenciaNombre: emp.emergenciaNombre || "",
      emergenciaTel: emp.emergenciaTel || "",
      emergenciaParentesco: emp.emergenciaParentesco || "",
    })
    setDrawerMode("edit")
  }

  // Alternar y cambiar estado
  const toggleEstado = (emp: EmpleadoItem) => {
    const newEst: EstadoEmpleado =
      emp.estado === "Activo" ? "Inactivo" : "Activo"
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, estado: newEst } : e)),
    )
    toast.info(`${getEmpleadoFullName(emp)} ahora está ${newEst}`)
  }

  const setEmpEstado = (id: string, estado: EstadoEmpleado) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, estado } : e)),
    )
    setSelectedEmp((prev) =>
      prev && prev.id === id ? { ...prev, estado } : prev,
    )
    toast.success(`Estado actualizado a "${estado}"`)
  }

  const handleDelete = (emp: EmpleadoItem) => {
    const name = getEmpleadoFullName(emp)
    if (window.confirm(`¿Eliminar colaborador "${name}"?`)) {
      setEmployees((prev) => prev.filter((item) => item.id !== emp.id))
      toast.success(`Colaborador "${name}" eliminado`)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formState.primer_nombre.trim() || !formState.primer_apellido.trim()) {
      toast.error("El primer nombre y primer apellido son obligatorios")
      return
    }
    if (!formState.numero_documento.trim()) {
      toast.error("El número de documento es obligatorio")
      return
    }
    if (!formState.correo.trim()) {
      toast.error("El correo electrónico es obligatorio")
      return
    }

    if (drawerMode === "create") {
      const newEmployee: EmpleadoItem = {
        id: String(Date.now()),
        tipo_documento: formState.tipo_documento,
        numero_documento: formState.numero_documento.trim(),
        primer_nombre: formState.primer_nombre.trim(),
        segundo_nombre: formState.segundo_nombre.trim() || undefined,
        primer_apellido: formState.primer_apellido.trim(),
        segundo_apellido: formState.segundo_apellido.trim() || undefined,
        cargo: formState.cargo,
        telefono: formState.telefono.trim(),
        correo: formState.correo.trim(),
        vinculacion: formState.vinculacion,
        estado: "Activo",
        emergenciaNombre: formState.emergenciaNombre.trim() || undefined,
        emergenciaTel: formState.emergenciaTel.trim() || undefined,
        emergenciaParentesco:
          formState.emergenciaParentesco.trim() || undefined,
      }
      setEmployees([newEmployee, ...employees])
      toast.success(
        `Colaborador "${getEmpleadoFullName(newEmployee)}" registrado`,
      )
    } else if (drawerMode === "edit" && selectedEmp) {
      setEmployees(
        employees.map((emp) =>
          emp.id === selectedEmp.id
            ? {
                ...emp,
                tipo_documento: formState.tipo_documento,
                numero_documento: formState.numero_documento.trim(),
                primer_nombre: formState.primer_nombre.trim(),
                segundo_nombre: formState.segundo_nombre.trim() || undefined,
                primer_apellido: formState.primer_apellido.trim(),
                segundo_apellido:
                  formState.segundo_apellido.trim() || undefined,
                cargo: formState.cargo,
                telefono: formState.telefono.trim(),
                correo: formState.correo.trim(),
                vinculacion: formState.vinculacion,
                estado: formState.estado,
                emergenciaNombre:
                  formState.emergenciaNombre.trim() || undefined,
                emergenciaTel: formState.emergenciaTel.trim() || undefined,
                emergenciaParentesco:
                  formState.emergenciaParentesco.trim() || undefined,
              }
            : emp,
        ),
      )
      toast.success("Colaborador actualizado correctamente")
    }

    closeDrawer()
  }

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todos", count: employees.length },
      {
        id: "Fijo",
        label: "Vinculación Fija",
        count: employees.filter((e) => (e.vinculacion || "Fijo") === "Fijo")
          .length,
      },
      {
        id: "Por Evento",
        label: "Por Evento",
        count: employees.filter((e) => e.vinculacion === "Por Evento").length,
      },
    ],
    [employees],
  )

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Cabecera con buscador y filtros */}
        <PageHeader
          title="Empleados"
          actionLabel="Crear empleado"
          onAction={openCreate}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (filterCargo !== "Todos" ? 1 : 0) +
            (filterVinculacion !== "Todos" ? 1 : 0) +
            (filterEstado !== "Todos" ? 1 : 0)
          }
          activeFilterPills={[
            ...(filterCargo !== "Todos"
              ? [
                  {
                    key: "cargo",
                    label: `Cargo: ${filterCargo}`,
                    onClear: () => {
                      setFilterCargo("Todos")
                      setCurrentPage(1)
                    },
                  },
                ]
              : []),
            ...(filterVinculacion !== "Todos"
              ? [
                  {
                    key: "vinc",
                    label: `Vinculación: ${filterVinculacion}`,
                    onClear: () => {
                      setFilterVinculacion("Todos")
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
            setFilterCargo("Todos")
            setFilterVinculacion("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Cargo
            </label>
            <CustomSelect
              value={filterCargo}
              onChange={(val) => {
                setFilterCargo(val)
                setCurrentPage(1)
              }}
              options={[
                { label: "Todos los Cargos", value: "Todos" },
                ...CARGOS.map((c) => ({ label: c, value: c })),
              ]}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Modalidad de Vinculación
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]">
              {["Todos", "Fijo", "Por Evento"].map((vinc) => (
                <button
                  key={vinc}
                  type="button"
                  onClick={() => {
                    setFilterVinculacion(vinc)
                    setCurrentPage(1)
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer text-center truncate ${
                    filterVinculacion === vinc
                      ? "bg-[#7C3AED] text-white font-semibold"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  {vinc === "Por Evento" ? "Evento" : vinc}
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
          activeTab={filterVinculacion}
          onTabChange={(newTab) => {
            setFilterVinculacion(newTab)
            setCurrentPage(1)
          }}
        />

        {/* Tabla principal con paginación */}
        <EmpleadoTable
          data={filteredData}
          paginatedData={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          onPageChange={setCurrentPage}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          onToggleEstado={toggleEstado}
          onEmptyAction={openCreate}
          isFiltered={
            Boolean(search) ||
            filterCargo !== "Todos" ||
            filterVinculacion !== "Todos" ||
            filterEstado !== "Todos"
          }
          onResetFilters={() => {
            setSearch("")
            setFilterCargo("Todos")
            setFilterVinculacion("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
        />
      </main>

      {/* Drawer de Detalle */}
      <EmpleadoDetailDrawer
        isOpen={drawerMode === "view" && Boolean(selectedEmp)}
        onClose={closeDrawer}
        selectedEmp={selectedEmp}
        onEdit={openEdit}
        onSetEstado={setEmpEstado}
      />

      {/* Drawer de Formulario (Crear / Editar) */}
      <EmpleadoFormDrawer
        isOpen={
          drawerMode === "create" ||
          (drawerMode === "edit" && Boolean(selectedEmp))
        }
        onClose={closeDrawer}
        isEditing={drawerMode === "edit"}
        selectedEmp={selectedEmp}
        formState={formState}
        setFormState={setFormState}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
