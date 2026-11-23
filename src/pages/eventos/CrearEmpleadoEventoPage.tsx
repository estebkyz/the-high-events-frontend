import React, { useId, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  ChevronRight,
  User,
  Mail,
  Phone,
  FileBadge,
  ArrowLeft,
  Plus,
} from "lucide-react"
import { useToast } from "../../components/Toast"
import { CustomSelect, type SelectOption } from "../../components/CustomSelect"
import { EVENTO_PATHS } from "../../routes/paths"
import { addEmpleadoCatalogo, addEmpleadoToDraft } from "./catalogStore"
import { TAREAS_CATALOGO } from "./data"
import { FASES_TAREA, type FaseTareaEvento } from "./types"

const CARGOS_DISPONIBLES = [
  "Ingeniero de Audio",
  "Técnico de Luces",
  "Coordinadora Logística",
  "DJ Residente",
  "Fotógrafo / Fotógrafa",
  "Videógrafo / Videógrafa",
  "Director de Escenografía",
  "Auxiliar de Montaje",
  "Operador de Pantallas LED",
  "Rigging & Estructuras",
]

const TIPOS_DOCUMENTO: SelectOption[] = [
  { label: "CC", value: "CC" },
  { label: "CE", value: "CE" },
  { label: "NIT", value: "NIT" },
  { label: "Pasaporte", value: "PASAPORTE" },
]

const MODALIDADES_VINCULACION: SelectOption[] = [
  {
    label: "Por Evento (Freelance / Honorarios)",
    value: "Por Evento",
    sublabel: "Contratación puntual para el evento",
  },
  {
    label: "Fijo (Nómina The High Events)",
    value: "Fijo",
    sublabel: "Personal de planta permanente",
  },
]

const LABEL_CLASS = "text-[13px] font-medium text-[#F8FAFC] block mb-1.5"
const INPUT_BASE =
  "w-full h-[42px] bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] " +
  "placeholder-[#64748B] hover:border-[#333C50] transition-colors " +
  "focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40"

/**
 * Divide un nombre completo escrito en el buscador (ej. "Laura Sofía Gómez")
 * en nombres y apellidos para pre-llenar los campos sin fricción.
 */
function splitInitialFullName(
  raw: string,
): { nombres: string; apellidos: string } {
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { nombres: "", apellidos: "" }
  if (parts.length === 1) return { nombres: parts[0], apellidos: "" }
  if (parts.length === 2) return { nombres: parts[0], apellidos: parts[1] }
  const half = Math.ceil(parts.length / 2)
  return {
    nombres: parts.slice(0, half).join(" "),
    apellidos: parts.slice(half).join(" "),
  }
}

export default function CrearEmpleadoEventoPage() {
  const uid = useId()
  const navigate = useNavigate()
  const toast = useToast()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()

  const isEditing = Boolean(id)
  const returnPath = isEditing ? EVENTO_PATHS.edit(id!) : EVENTO_PATHS.create

  const initialSplit = splitInitialFullName(searchParams.get("nombre") || "")

  // Datos personales
  const [nombres, setNombres] = useState(initialSplit.nombres)
  const [apellidos, setApellidos] = useState(initialSplit.apellidos)
  const [tipoDocumento, setTipoDocumento] = useState("CC")
  const [numeroDocumento, setNumeroDocumento] = useState("")

  // Datos de contacto y cargo
  const [cargos, setCargos] = useState<string[]>(CARGOS_DISPONIBLES)
  const [cargo, setCargo] = useState("Ingeniero de Audio")
  const [telefono, setTelefono] = useState("")
  const [correo, setCorreo] = useState("")
  const [vinculacion, setVinculacion] = useState<"Por Evento" | "Fijo">(
    "Por Evento",
  )

  // Asignación directa para el evento
  const [tareaId, setTareaId] = useState(TAREAS_CATALOGO[0].id)
  const [fase, setFase] = useState<FaseTareaEvento>("Montaje")

  const cargoOptions = useMemo<SelectOption[]>(
    () => cargos.map((c) => ({ label: c, value: c })),
    [cargos],
  )

  const tareaOptions = useMemo<SelectOption[]>(
    () =>
      TAREAS_CATALOGO.map((t) => ({
        label: t.nombre_tarea,
        value: t.id,
      })),
    [],
  )

  const faseOptions = useMemo<SelectOption[]>(
    () => FASES_TAREA.map((f) => ({ label: f, value: f })),
    [],
  )

  const handleCreateCargo = (nuevoCargo: string) => {
    const clean = nuevoCargo.trim()
    if (!clean) return
    if (!cargos.includes(clean)) {
      setCargos((prev) => [...prev, clean])
    }
    setCargo(clean)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombres.trim() || !apellidos.trim()) {
      toast.error("Por favor ingresa los nombres y apellidos del empleado")
      return
    }

    const nombreCompleto = `${nombres.trim()} ${apellidos.trim()}`.replace(
      /\s+/g,
      " ",
    )

    const nuevoEmpleado = addEmpleadoCatalogo({
      nombre: nombreCompleto,
      cargo,
      telefono: telefono.trim(),
      correo: correo.trim(),
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento.trim(),
    })

    addEmpleadoToDraft(nuevoEmpleado, tareaId, fase)

    toast.success(`Colaborador "${nombreCompleto}" creado y asignado al evento`)
    navigate(returnPath)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb requerido: eventos / crear evento / crear empleado */}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-4">
          <button
            type="button"
            onClick={() => navigate(EVENTO_PATHS.list)}
            className="hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            Eventos
          </button>
          <ChevronRight size={14} className="text-[#64748B]" />
          <button
            type="button"
            onClick={() => navigate(returnPath)}
            className="hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            {isEditing ? "Editar evento" : "Crear evento"}
          </button>
          <ChevronRight size={14} className="text-[#64748B]" />
          <span className="text-[#F8FAFC] font-medium">Crear empleado</span>
        </div>

        {/* Encabezado */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[26px] font-bold text-[#F8FAFC] tracking-tight">
              Crear nuevo empleado
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Se guardará en el catálogo y se agregará de inmediato al evento en
              curso.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección 1: Información Personal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-[16px] font-bold text-[#F8FAFC]">
                Información personal
              </h2>
            </div>

            <div className="lg:col-span-9 bg-[#181B22] rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-5">
              {/* Nombres y Apellidos en 2 campos claros */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${uid}-nombres`} className={LABEL_CLASS}>
                    Nombres <span className="text-[#7C3AED]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={`${uid}-nombres`}
                      type="text"
                      required
                      autoFocus={!initialSplit.nombres}
                      placeholder="Ej. Juan Carlos"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      className={`${INPUT_BASE} px-3.5`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`${uid}-apellidos`} className={LABEL_CLASS}>
                    Apellidos <span className="text-[#7C3AED]">*</span>
                  </label>
                  <input
                    id={`${uid}-apellidos`}
                    type="text"
                    required
                    autoFocus={
                      Boolean(initialSplit.nombres) && !initialSplit.apellidos
                    }
                    placeholder="Ej. Restrepo Giraldo"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    className={`${INPUT_BASE} px-3.5`}
                  />
                </div>
              </div>

              {/* Documento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Tipo de documento</label>
                  <CustomSelect
                    options={TIPOS_DOCUMENTO}
                    value={tipoDocumento}
                    onChange={setTipoDocumento}
                    placeholder="Seleccionar tipo..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-documento`} className={LABEL_CLASS}>
                    Número de documento{" "}
                    <span className="text-[#64748B] font-normal">
                      (Opcional)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id={`${uid}-documento`}
                      type="text"
                      inputMode="numeric"
                      autoFocus={Boolean(
                        initialSplit.nombres && initialSplit.apellidos,
                      )}
                      placeholder="Ej. 1020304050"
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value)}
                      className={`${INPUT_BASE} px-3.5 tabular-nums`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Cargo y Contacto */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-[#262D3D]">
            <div className="lg:col-span-3">
              <h2 className="text-[16px] font-bold text-[#F8FAFC]">
                Cargo y contacto
              </h2>
            </div>

            <div className="lg:col-span-9 bg-[#181B22] rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>
                    Especialidad / Cargo técnico
                  </label>
                  <CustomSelect
                    options={cargoOptions}
                    value={cargo}
                    onChange={setCargo}
                    searchable={true}
                    allowCreate={true}
                    createLabel="Crear cargo"
                    onCreate={handleCreateCargo}
                    placeholder="Seleccionar o buscar cargo..."
                  />
                </div>

                <div>
                  <label className={LABEL_CLASS}>
                    Modalidad de vinculación
                  </label>
                  <CustomSelect
                    options={MODALIDADES_VINCULACION}
                    value={vinculacion}
                    onChange={(val) =>
                      setVinculacion(val as "Por Evento" | "Fijo")
                    }
                    placeholder="Seleccionar modalidad..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${uid}-telefono`} className={LABEL_CLASS}>
                    Teléfono
                  </label>
                  <div className="relative">
                    <input
                      id={`${uid}-telefono`}
                      type="tel"
                      placeholder="Ej. +57 312 900 1122"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className={`${INPUT_BASE} px-3.5`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`${uid}-correo`} className={LABEL_CLASS}>
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      id={`${uid}-correo`}
                      type="email"
                      placeholder="Ej. colaborador@thehighevents.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      className={`${INPUT_BASE} px-3.5`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 3: Asignación Inicial al Evento Actual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-[#262D3D]">
            <div className="lg:col-span-3">
              <h2 className="text-[16px] font-bold text-[#F8FAFC]">
                Asignación al evento
              </h2>
            </div>

            <div className="lg:col-span-9 bg-[#181B22] rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Tarea asignada</label>
                  <CustomSelect
                    options={tareaOptions}
                    value={tareaId}
                    onChange={setTareaId}
                    searchable={true}
                    placeholder="Seleccionar tarea..."
                  />
                </div>

                <div>
                  <label className={LABEL_CLASS}>
                    Fase operativa del evento
                  </label>
                  <CustomSelect
                    options={faseOptions}
                    value={fase}
                    onChange={(val) => setFase(val as FaseTareaEvento)}
                    placeholder="Seleccionar fase..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pie de acciones */}
          <div className="pt-6 border-t border-[#262D3D] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(returnPath)}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/25 cursor-pointer flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Guardar y asignar al evento</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
