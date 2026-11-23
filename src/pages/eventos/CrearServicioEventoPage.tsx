import React, { useId, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ChevronRight, ArrowLeft, Plus } from "lucide-react"
import { useToast } from "../../components/Toast"
import { CustomSelect, type SelectOption } from "../../components/CustomSelect"
import { EVENTO_PATHS } from "../../routes/paths"
import { useCrudResource } from "../../hooks/useCrudResource"
import type { CategoriaServicioItem, ServicioItem } from "../servicios/types"
import { addServicioToDraft } from "./catalogStore"

const LABEL_CLASS = "text-[13px] font-medium text-[#F8FAFC] block mb-1.5"
const INPUT_BASE =
  "w-full h-[42px] bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] " +
  "placeholder-[#64748B] hover:border-[#333C50] transition-colors " +
  "focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40"

const formatCOPNumber = (rawDigits: string): string => {
  const digits = rawDigits.replace(/\D/g, "")
  if (!digits) return ""
  return Number(digits).toLocaleString("es-CO")
}

export default function CrearServicioEventoPage() {
  const uid = useId()
  const navigate = useNavigate()
  const toast = useToast()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()

  const isEditing = Boolean(id)
  const returnPath = isEditing ? EVENTO_PATHS.edit(id!) : EVENTO_PATHS.create

  const initialNombre = searchParams.get("nombre")?.trim() || ""

  const [nombre, setNombre] = useState(initialNombre)
  const { items: rawCategorias, createItem: createCategoriaApi } =
    useCrudResource<CategoriaServicioItem>({
      endpoint: "/categorias-servicio",
    })
  const { createItem: createServicioApi } = useCrudResource<ServicioItem>({
    endpoint: "/servicios",
  })
  const [categoria, setCategoria] = useState("")
  const [precioDigits, setPrecioDigits] = useState("2500000")
  const [descripcion, setDescripcion] = useState("")

  const categoriaOptions = useMemo<SelectOption[]>(
    () => rawCategorias.map((cat) => ({ label: cat.nombre, value: cat.nombre })),
    [rawCategorias],
  )

  const handleCreateCategoria = (nuevaCat: string) => {
    const clean = nuevaCat.trim()
    if (!clean) return
    void createCategoriaApi({
      id: String(Date.now()),
      nombre: clean,
      descripcion: "Categoría de servicios comerciales",
      estado: "Activo",
    })
    setCategoria(clean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) {
      toast.error("Por favor ingresa el nombre del servicio")
      return
    }

    const numPrecio = Number(precioDigits.replace(/\D/g, "")) || 0
    const precioFormatted = `$ ${numPrecio.toLocaleString("es-CO")}`
    const finalCat = categoria || rawCategorias[0]?.nombre || "General"

    const saved = await createServicioApi({
      id: String(Date.now()),
      nombre: nombre.trim(),
      categoria: finalCat,
      tipo_cobro: "por_evento",
      precioBase: precioFormatted,
      precioBaseNum: numPrecio,
      descripcion: descripcion.trim(),
      estado: "Activo",
    })

    // Lo agregamos automáticamente al borrador del evento
    addServicioToDraft({
      id: saved.id,
      nombre: saved.nombre,
      categoria: saved.categoria,
      precioBase: saved.precioBase,
      descripcion: saved.descripcion,
    })

    toast.success(
      `Servicio "${saved.nombre}" creado y agregado al evento`,
    )
    navigate(returnPath)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb requerido: eventos / crear evento / crear servicio */}
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
          <span className="text-[#F8FAFC] font-medium">Crear servicio</span>
        </div>

        {/* Encabezado */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[26px] font-bold text-[#F8FAFC] tracking-tight">
              Crear nuevo servicio
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Se guardará en el catálogo y se agregará de inmediato al evento en
              curso.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección 1: Datos del servicio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-[16px] font-bold text-[#F8FAFC]">
                Datos del servicio
              </h2>
            </div>

            <div className="lg:col-span-9 bg-[#181B22] border border-[#262D3D] rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-5">
              {/* Nombre del servicio */}
              <div>
                <label htmlFor={`${uid}-nombre`} className={LABEL_CLASS}>
                  Nombre del servicio <span className="text-[#7C3AED]">*</span>
                </label>
                <input
                  id={`${uid}-nombre`}
                  type="text"
                  required
                  autoFocus={!initialNombre}
                  placeholder="Ej. Pantalla LED Curva P2.6 (4x3m)"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`${INPUT_BASE} px-3.5`}
                />
              </div>

              {/* Categoría y Tarifa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Categoría</label>
                  <CustomSelect
                    options={categoriaOptions}
                    value={categoria}
                    onChange={setCategoria}
                    searchable={true}
                    allowCreate={true}
                    createLabel="Crear categoría"
                    onCreate={handleCreateCategoria}
                    placeholder="Seleccionar categoría..."
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-precio`} className={LABEL_CLASS}>
                    Precio base
                  </label>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#94A3B8] select-none pointer-events-none"
                    >
                      $
                    </span>
                    <input
                      id={`${uid}-precio`}
                      type="text"
                      inputMode="numeric"
                      autoFocus={Boolean(initialNombre)}
                      placeholder="0"
                      value={formatCOPNumber(precioDigits)}
                      onChange={(e) =>
                        setPrecioDigits(e.target.value.replace(/\D/g, ""))
                      }
                      className={`${INPUT_BASE} pl-8 pr-4 tabular-nums`}
                    />
                  </div>
                </div>
              </div>

              {/* Descripción envuelta en su propio bloque para mantener espaciado consistente */}
              <div>
                <label htmlFor={`${uid}-descripcion`} className={LABEL_CLASS}>
                  Descripción técnica{" "}
                  <span className="text-[#64748B] font-normal">(Opcional)</span>
                </label>
                <textarea
                  id={`${uid}-descripcion`}
                  rows={4}
                  placeholder="Detalla los componentes incluidos, marcas, requerimientos eléctricos o condiciones especiales de montaje..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full p-3.5 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] hover:border-[#333C50] focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 transition-colors resize-none"
                />
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
              <span>Guardar y agregar al evento</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
