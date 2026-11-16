import React, { useId } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { CustomSelect } from "../../../components/CustomSelect"
import { EVENTOS_DISPONIBLES, TIPOS_OPTIONS, ESTADOS_OPTIONS } from "../data"
import type { Recepcion, NewItem } from "../types"

interface RecepcionFormDrawerProps {
  isOpen: boolean; onClose: () => void
  isEditing: boolean
  selectedRecepcion: Recepcion | null
  formValues: {
    evento: string; proveedor: string
    tipo: string
    fecha: string
    observaciones: string
    estado: string
  }
  setFormValues: React.Dispatch<React.SetStateAction<{
    evento: string; proveedor: string
    tipo: string
    fecha: string
    observaciones: string
    estado: string
  }>>
  items: NewItem[]
  setItems: React.Dispatch<React.SetStateAction<NewItem[]>>
  onSubmit: (e: React.FormEvent) => void
}

const LABEL_CLASS = "text-[13px] font-medium text-[#F8FAFC] block mb-1.5"
const INPUT_BASE =
  "w-full h-[42px] bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] " +
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

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { nombre: "", cantidad: "1", estado: "Bueno" },
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title={
        isEditing
          ? `Editar ${selectedRecepcion?.codigo}`
          : "Registrar Recepción"
      }
      subtitle={
        isEditing
          ? "Modifica los datos del acta de recepción o entrega de equipos."
          : "Registra una nueva entrega o recepción de equipos y servicios técnicos."
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Evento */}
        <div>
          <label className={LABEL_CLASS}>
            Evento relacionado <span className="text-[#7C3AED]">*</span>
          </label>
          <CustomSelect
            options={EVENTOS_DISPONIBLES}
            value={formValues.evento}
            onChange={(val) => setFormValues((f) => ({ ...f, evento: val }))}
            searchable={true}
            placeholder="Seleccionar evento..."
          />
        </div>

        {/* Proveedor */}
        <div>
          <label htmlFor={`${uid}-proveedor`} className={LABEL_CLASS}>
            Proveedor o contratista <span className="text-[#7C3AED]">*</span>
          </label>
          <input
            id={`${uid}-proveedor`}
            type="text"
            required
            placeholder="Ej. TechLight S.A. o AudioPro"
            value={formValues.proveedor}
            onChange={(e) =>
              setFormValues((f) => ({ ...f, proveedor: e.target.value }))
            }
            className={`${INPUT_BASE} px-3.5`}
          />
        </div>

        {/* Tipo y Fecha en 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              Fecha de acta <span className="text-[#7C3AED]">*</span>
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
        </div>

        {/* Lista dinámica de Equipos / Ítems */}
        <div className="space-y-2.5 pt-2 border-t border-[#262D3D]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#F8FAFC]">
              Equipos / Ítems recibidos
            </label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-xs font-semibold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Agregar ítem</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-[#111318] border border-[#262D3D] rounded-xl p-2.5"
              >
                <input
                  type="text"
                  placeholder="Nombre o descripción del ítem"
                  value={item.nombre}
                  onChange={(e) => updateItem(idx, "nombre", e.target.value)}
                  className="flex-1 bg-transparent text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none px-1"
                />
                <div className="w-16">
                  <input
                    type="number"
                    min="1"
                    placeholder="Cant."
                    value={item.cantidad}
                    onChange={(e) =>
                      updateItem(idx, "cantidad", e.target.value)
                    }
                    className="w-full bg-[#181B22] border border-[#262D3D] rounded-lg text-xs text-[#F8FAFC] p-1 text-center focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div className="w-24">
                  <select
                    value={item.estado}
                    onChange={(e) => updateItem(idx, "estado", e.target.value)}
                    className="w-full text-xs bg-[#181B22] border border-[#262D3D] rounded-lg text-[#F8FAFC] p-1 focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                  >
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Dañado">Dañado</option>
                  </select>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    title="Eliminar ítem"
                    aria-label="Eliminar ítem"
                    className="p-1.5 text-[#64748B] hover:text-[#EF4444] transition-colors cursor-pointer rounded-lg hover:bg-[#EF4444]/10"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label htmlFor={`${uid}-observaciones`} className={LABEL_CLASS}>
            Observaciones o novedades{" "}
            <span className="text-[#64748B] font-normal">(Opcional)</span>
          </label>
          <textarea
            id={`${uid}-observaciones`}
            rows={3}
            placeholder="Novedades físicas o condiciones especiales encontradas..."
            value={formValues.observaciones}
            onChange={(e) =>
              setFormValues((f) => ({ ...f, observaciones: e.target.value }))
            }
            className="w-full p-3 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] hover:border-[#333C50] focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 transition-colors resize-none"
          />
        </div>

        {/* Estado del acta */}
        <div>
          <label className={LABEL_CLASS}>Estado del acta</label>
          <CustomSelect
            options={ESTADOS_OPTIONS}
            value={formValues.estado}
            onChange={(val) => setFormValues((f) => ({ ...f, estado: val }))}
            placeholder="Seleccionar estado..."
          />
        </div>

        {/* Acciones */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/25 cursor-pointer"
          >
            {isEditing ? "Guardar cambios" : "Crear recepción"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
