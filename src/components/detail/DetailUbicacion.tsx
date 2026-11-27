import { MapsLink } from "@/components/MapsLink"
import { DetailField, type DetailFieldProps } from "./DetailPrimitives"

interface DetailUbicacionProps extends Pick<DetailFieldProps, "label" | "span" | "icon"> {
  value: string | undefined
  /** Texto si no hay ubicación registrada. */
  fallback: string
}

/** Ubicación en un detalle, con su enlace a Google Maps. */
export function DetailUbicacion({ value, fallback, ...field }: DetailUbicacionProps) {
  const ubicacion = value?.trim()
  return (
    <DetailField {...field}>
      {ubicacion ? (
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="min-w-0 break-words">{ubicacion}</span>
          <MapsLink ubicacion={ubicacion} />
        </span>
      ) : (
        fallback
      )}
    </DetailField>
  )
}
