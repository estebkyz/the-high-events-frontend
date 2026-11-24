interface FormActionsProps {
  onCancel: () => void
  submitLabel: string
  saving?: boolean
}

/** Pie único de formulario: Cancelar a la izquierda, acción principal a la derecha. */
export function FormActions({ onCancel, submitLabel, saving = false }: FormActionsProps) {
  return (
    <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2D3748]">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#F1F5F9] bg-transparent border border-[#2D3748] hover:bg-[#242830] transition-colors cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Guardando…" : submitLabel}
      </button>
    </div>
  )
}
