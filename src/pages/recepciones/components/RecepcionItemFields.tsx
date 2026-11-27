import type { SelectOption } from "@/components/CustomSelect"
import { FormInput } from "@/components/FormInput"
import { FormSelect } from "@/components/form/FormSelect"
import { RemoveButton } from "@/components/form/RemoveButton"
import { ESTADO_ITEM_OPTIONS } from "../constants"
import type { EstadoItemRecepcion, RecepcionEquipo } from "../types"

interface RecepcionItemFieldsProps {
  index: number
  item: RecepcionEquipo
  equipoOptions: SelectOption[]
  onChange: (changes: Partial<RecepcionEquipo>) => void
  onRemove?: () => void
}

/** Un equipo del acta: identificación, estado físico, observación y evidencia. */
export function RecepcionItemFields({
  index,
  item,
  equipoOptions,
  onChange,
  onRemove,
}: RecepcionItemFieldsProps) {
  return (
    <div className="py-3 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_130px_auto] gap-2.5 items-end">
        <FormSelect
          label={`Equipo ${index + 1}`}
          required
          searchable
          placeholder="Seleccionar equipo"
          value={item.nombre}
          onChange={(val) => onChange({ nombre: val, equipo_id: undefined })}
          options={equipoOptions}
        />
        <FormInput
          label="Cantidad"
          type="number"
          min={1}
          value={item.cantidad}
          onChange={(e) => onChange({ cantidad: Number(e.target.value) })}
        />
        <FormSelect
          label="Estado físico"
          value={item.estado}
          onChange={(val) => onChange({ estado: val as EstadoItemRecepcion })}
          options={ESTADO_ITEM_OPTIONS}
        />
        {onRemove && (
          <RemoveButton label={`Quitar equipo ${index + 1}`} onClick={onRemove} />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-end">
        <FormInput
          label="Observación"
          placeholder="Ej. Rayón en esquina derecha"
          value={item.observaciones ?? ""}
          onChange={(e) => onChange({ observaciones: e.target.value })}
        />
        <FormInput
          label="Enlace de la evidencia"
          type="url"
          maxLength={255}
          placeholder="https://"
          value={item.evidencia_foto ?? ""}
          onChange={(e) => onChange({ evidencia_foto: e.target.value })}
        />
      </div>
    </div>
  )
}
