import { useLayoutEffect, useReducer, useRef, type ChangeEvent } from "react"
import { formatCOP } from "@/utils/format"

/** `DECIMAL(12,2)`: hasta 9.999.999.999. */
const MAX_DIGITS = 10

const onlyDigits = (text: string) => text.replace(/\D/g, "")

/** Posición del cursor con `digitsAfter` dígitos a su derecha, pegada a un dígito. */
function caretPosition(text: string, digitsAfter: number): number {
  let position = text.length
  for (let pending = digitsAfter; pending > 0 && position > 0; position--) {
    if (/\d/.test(text[position - 1])) pending--
  }
  while (text[position - 1] === ".") position--
  return position
}

interface Edit {
  before: string
  after: string
}

/** Dígitos a cada lado del cursor; los centavos de un valor pegado se descartan. */
function readEdit({ value, selectionStart }: HTMLInputElement): Edit {
  const pesos = value.replace(/,\d{0,2}\s*$/, "")
  const caret = Math.min(selectionStart ?? pesos.length, pesos.length)
  return {
    before: onlyDigits(pesos.slice(0, caret)),
    after: onlyDigits(pesos.slice(caret)),
  }
}

/** Si solo se borró un punto, se borra el dígito vecino (si no, no pasaría nada). */
function skipSeparator(edit: Edit, previous: string, inputType: string): Edit {
  if (edit.before + edit.after !== previous) return edit
  if (inputType === "deleteContentBackward") {
    return { ...edit, before: edit.before.slice(0, -1) }
  }
  if (inputType === "deleteContentForward") {
    return { ...edit, after: edit.after.slice(1) }
  }
  return edit
}

/**
 * Formatea el dinero mientras se escribe (`1250000` → `$ 1.250.000`) sin mover el
 * cursor. El formulario guarda el número; `undefined` es "sin dato".
 */
export function useMoneyInput(
  value: number | null | undefined,
  onChange: (value: number | undefined) => void,
) {
  const caret = useRef<{ input: HTMLInputElement; digitsAfter: number } | null>(null)
  const [, rerender] = useReducer((count: number) => count + 1, 0)
  const text = typeof value === "number" ? formatCOP(value) : ""

  useLayoutEffect(() => {
    if (!caret.current) return
    const { input, digitsAfter } = caret.current
    caret.current = null
    const position = caretPosition(input.value, digitsAfter)
    input.setSelectionRange(position, position)
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const { inputType = "" } = e.nativeEvent as InputEvent
    const { before, after } = skipSeparator(readEdit(input), onlyDigits(text), inputType)
    // Al llegar al máximo se recorta lo insertado, no lo que ya estaba a la derecha.
    const digits = before.slice(0, Math.max(0, MAX_DIGITS - after.length)) + after
    caret.current = { input, digitsAfter: after.length }
    onChange(digits ? Number(digits) : undefined)
    // Si el número no cambió (se escribió una letra), igual se restaura el cursor.
    rerender()
  }

  return { value: text, onChange: handleChange }
}
