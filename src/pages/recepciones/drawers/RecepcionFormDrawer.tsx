import React, { useId, useMemo } from "react"
import { Plus, Trash2, Camera, CheckCircle2 } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { CustomSelect, type SelectOption } from "../../../components/CustomSelect"
import { EVENTOS_DISPONIBLES, TIPOS_OPTIONS, ESTADOS_OPTIONS } from "../data"
import { INITIAL_PROVIDERS } from "../../proveedores/data"
import { EVENTOS_MOCK } from "../../eventos/data"
import { INITIAL_EQUIPOS } from "../../equipos/data"
import type { Recepcion, NewItem } from "../types"

interface RecepcionFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  selectedRecepcion: Recepcion | null
  formValues: {
    evento: string
    proveedor: string
    tipo: string
    fecha: string
    observaciones: string
    estado: string
  }
  setFormValues: React.Dispatch<
    React.SetStateAction<{
      evento: string
      proveedor: string
      tipo: string
      fecha: string
      observaciones: string
      estado: string
    }>
  >
  items: NewItem[]
  setItems: React.Dispatch<React.SetStateAction<NewItem[]>>
  onSubmit: (e: React.FormEvent) => void
}

const LABEL_CLASS = "text-[12.5px] font-medium text-[#F8FAFC] block mb-1"
const INPUT_BASE =
  "w-full h-[38px] bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] " +
  "placeholder-[#64748B] hover:border-[#333C50] transition-colors " +
  "focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40"

export function RecepcionFormDrawer({
  isOpen,
  onClose,
  isEditing,
  selectedRecepcion,
  formValues,
  setFormValues,
  items,
  setItems,
  onSubmit,
}: RecepcionFormDrawerProps) {
  const uid = useId()

  const eventoOptions = useMemo<SelectOption[]>(() => {
    const names = new Set<string>([
      ...EVENTOS_MOCK.map((e) => e.nombre),
      ...EVENTOS_DISPONIBLES.map((e) => e.value),
    ])
    return Array.from(names).map((n) => ({ label: n, value: n }))
  }, [])

  const proveedorOptions = useMemo<SelectOption[]>(
    () =>
      INITIAL_PROVIDERS.map((p) => ({
        label: p.razon_social,
        value: p.razon_social,
        sublabel: `NIT ${p.nit_documento} · ${(p.servicios || []).join(", ")}`,
      })),
    [],
  )

  // Sugerencias de equipos alquilados del proveedor seleccionado
  const equiposDelProveedor = useMemo(() => {
    return INITIAL_EQUIPOS.filter(
      (eq) =>
        eq.propiedad === "Alquilado" &&
        (!formValues.proveedor ||
          eq.proveedor_nombre === formValues.proveedor),
    )
  }, [formValues.proveedor])

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        nombre: "",
        cantidad: "1",
        estado: "Bueno",
        observaciones: "",
        evidencia_foto: "",
      },
    ])
  }

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateItem = (idx: number, field: keyof NewItem, value: string) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    )
  }

  const handlePhotoUpload = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    updateItem(idx, "evidencia_foto", file.name)
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-3xl"
      title={
        isEditing
          ? `Editar recepción ${selectedRecepcion?.codigo}`
          : "Crear recepción"
      }
      subtitle="Formato de entrega y recepción normalizado: estado físico, observación y evidencia fotográfica por cada equipo recibido"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Cabecera del Acta (Tabla recepciones): Evento (FK), Proveedor (FK), Tipo, Fecha y Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={LABEL_CLASS}>
              Evento vinculado (FK id_evento) <span className="text-[#7C3AED]">*</span>
            </label>
            <CustomSelect
              options={eventoOptions}
              value={formValues.evento}
              onChange={(val) => setFormValues((f) => ({ ...f, evento: val }))}
              searchable={true}
              placeholder="Seleccionar evento..."
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>
              Proveedor contratado (FK id_proveedor) <span className="text-[#7C3AED]">*</span>
            </label>
            <CustomSelect
              options={proveedorOptions}
              value={formValues.proveedor}
              onChange={(val) =>
                setFormValues((f) => ({ ...f, proveedor: val }))
              }
              searchable={true}
              placeholder="Seleccionar proveedor..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className={LABEL_CLASS}>Tipo de acta</label>
            <CustomSelect
              options={TIPOS_OPTIONS}
              value={formValues.tipo}
              onChange={(val) => setFormValues((f) => ({ ...f, tipo: val }))}
              placeholder="Seleccionar tipo..."
            />
          </div>

          <div>
            <label htmlFor={`${uid}-fecha`} className={LABEL_CLASS}>
              Fecha de verificación <span className="text-[#7C3AED]">*</span>
            </label>
            <input
              id={`${uid}-fecha`}
              type="date"
              required
              value={formValues.fecha}
              onChange={(e) =>
                setFormValues((f) => ({ ...f, fecha: e.target.value }))
              }
              className={`${INPUT_BASE} px-3.5 [color-scheme:dark]`}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Estado del acta</label>
            <CustomSelect
              options={ESTADOS_OPTIONS}
              value={formValues.estado}
              onChange={(val) => setFormValues((f) => ({ ...f, estado: val }))}
              placeholder="Seleccionar estado..."
            />
          </div>
        </div>

        {/* Detalle Normalizado por Equipo (Tabla detalle_recepcion) */}
        <div className="space-y-3 pt-3 border-t border-[#262D3D]">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-[#F8FAFC]">
                Detalle individual por equipo recibido (Tabla detalle_recepcion)
              </label>
              <p className="text-[11px] text-[#94A3B8]">
                Registra el estado físico, observaciones específicas y foto de evidencia por cada aparato
              </p>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-xs font-semibold text-[#C4B5FD] hover:bg-[#7C3AED]/25 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Agregar aparato</span>
            </button>
          </div>

          {equiposDelProveedor.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-[#94A3B8]">Carga rápida del proveedor:</span>
              {equiposDelProveedor.map((eq) => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => {
                    if (items.length === 1 && !items[0].nombre.trim()) {
                      updateItem(0, "nombre", `${eq.nombre} (${eq.serie})`)
                    } else {
                      setItems((prev) => [
                        ...prev,
                        {
                          nombre: `${eq.nombre} (${eq.serie})`,
                          cantidad: "1",
                          estado: "Bueno",
                          observaciones: "",
                          evidencia_foto: "",
                        },
                      ])
                    }
                  }}
                  className="px-2 py-0.5 rounded-md bg-[#181B22] border border-[#262D3D] text-[#A78BFA] hover:border-[#7C3AED] cursor-pointer"
                >
                  + {eq.nombre}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2.5 max-h-[270px] overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#111318] border border-[#262D3D] rounded-xl p-3 space-y-2.5"
              >
                {/* Fila 1 del aparato: Nombre, Cantidad, Estado Físico y Eliminar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  <div className="sm:col-span-6">
                    <label className="text-[10.5px] text-[#94A3B8] block mb-0.5">
                      Aparato / Equipo #{idx + 1} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Cabina Line Array JBL VTX A8 (SN-9821)"
                      value={item.nombre}
                      onChange={(e) =>
                        updateItem(idx, "nombre", e.target.value)
                      }
                      className="w-full h-[34px] bg-[#181B22] border border-[#262D3D] rounded-lg text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] px-2.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10.5px] text-[#94A3B8] block mb-0.5">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        updateItem(idx, "cantidad", e.target.value)
                      }
                      className="w-full h-[34px] bg-[#181B22] border border-[#262D3D] rounded-lg text-xs text-[#F8FAFC] px-2 text-center focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10.5px] text-[#94A3B8] block mb-0.5">
                      Estado físico individual
                    </label>
                    <select
                      value={item.estado}
                      onChange={(e) =>
                        updateItem(idx, "estado", e.target.value)
                      }
                      className="w-full h-[34px] text-xs bg-[#181B22] border border-[#262D3D] rounded-lg text-[#F8FAFC] px-2 focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                    >
                      <option value="Excelente">Excelente</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Regular">Regular (Desgaste/Rayón)</option>
                      <option value="Dañado">Dañado (Falla/Golpe)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1 flex justify-end pt-4">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        title="Eliminar aparato"
                        className="p-1.5 text-[#64748B] hover:text-[#EF4444] transition-colors cursor-pointer rounded-lg hover:bg-[#EF4444]/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Fila 2 del aparato: Observación específica del equipo + Evidencia fotográfica por equipo */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center pt-1.5 border-t border-[#262D3D]/60">
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      placeholder="Observación individual de este equipo (ej. Rayón preexistente en esquina derecha, sin tapa frontal...)"
                      value={item.observaciones || ""}
                      onChange={(e) =>
                        updateItem(idx, "observaciones", e.target.value)
                      }
                      className="w-full h-[34px] bg-[#181B22] border border-[#262D3D] rounded-lg text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] px-2.5"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="w-full h-[34px] px-2.5 rounded-lg border border-dashed border-[#3B455A] hover:border-[#7C3AED] bg-[#181B22] flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#CBD5E1] cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(idx, e)}
                        className="sr-only"
                      />
                      {item.evidencia_foto ? (
                        <>
                          <CheckCircle2 size={13} className="text-[#10B981] shrink-0" />
                          <span className="truncate text-[#34D399]">
                            {item.evidencia_foto}
                          </span>
                        </>
                      ) : (
                        <>
                          <Camera size={13} className="text-[#A78BFA] shrink-0" />
                          <span className="truncate">Subir foto del aparato</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/25 cursor-pointer"
          >
            {isEditing ? "Guardar cambios" : "Crear recepción"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
