import { FormInput, type FormInputProps } from "@/components/FormInput"
import { useMoneyInput } from "@/hooks/useMoneyInput"

interface FormMoneyInputProps extends Omit<
  FormInputProps,
  "type" | "value" | "onChange" | "min" | "max"
> {
  /** Pesos colombianos; `undefined` deja el campo vacío. */
  value: number | null | undefined
  onChange: (value: number | undefined) => void
}

/** Campo de dinero: pone los puntos de miles y millones al escribir. */
export function FormMoneyInput({
  value,
  onChange,
  placeholder = "$ 0",
  ...props
}: FormMoneyInputProps) {
  const field = useMoneyInput(value, onChange)
  return (
    <FormInput
      {...props}
      {...field}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
    />
  )
}
