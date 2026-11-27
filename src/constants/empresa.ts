/**
 * Datos de la empresa: único lugar donde se cambian. Los que varían por instalación
 * se pueden fijar al compilar con variables `VITE_EMPRESA_*`.
 */
const env = import.meta.env
const nombre: string = env.VITE_EMPRESA_NOMBRE || "The High Events"

export const EMPRESA = {
  nombre,
  /** Monograma del logotipo: las dos primeras iniciales. */
  siglas: nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join("")
    .toUpperCase(),
  lema: env.VITE_EMPRESA_LEMA || "Producción técnica y logística de eventos",
  /** Las direcciones sugeridas prefieren los resultados cercanos a la sede. */
  sede: {
    lat: env.VITE_EMPRESA_LAT || "6.2442",
    lon: env.VITE_EMPRESA_LON || "-75.5812",
  },
} as const

/** Esquema de pago de los acuerdos: lo calcula el servidor; aquí solo se rotula. */
export const ESQUEMA_PAGO = { anticipo: 50, saldo: 50 } as const
