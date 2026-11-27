import { EMPRESA } from "@/constants/empresa"

/**
 * Direcciones y lugares reales de Colombia (OpenStreetMap, a través de Photon).
 * Es el único archivo que conoce al proveedor: para cambiarlo, basta con
 * conservar `buscarUbicaciones`.
 */
const API_URL = "https://photon.komoot.io/api/"
/** Oeste, sur, este y norte de Colombia. */
const COLOMBIA = "-79.1,-4.3,-66.8,13.5"
/** Lo que no sirve como dirección: quebradas, paraderos, rieles. */
const EXCLUIDOS = ["!waterway", "!public_transport", "!railway", "!natural", "!boundary"]
const PARADEROS = ["bus_stop", "platform", "bus_station", "bicycle_rental"]
const TIMEOUT_MS = 8000
const MAX_RESULTADOS = 5

export const MIN_CARACTERES = 3
export const MAX_UBICACION = 150

interface Lugar {
  type?: string
  name?: string
  street?: string
  housenumber?: string
  district?: string
  city?: string
  county?: string
  state?: string
  countrycode?: string
  osm_value?: string
}

interface Consulta {
  texto: string
  /** Placa que escribió la persona: OpenStreetMap casi nunca la conoce. */
  placa: string
}

const PLACA =
  /\s*(?:#|\bn[°º]\.?|\bno\.)\s*(\d+[a-z]?\b(?:\s*(?:sur|norte|este|oeste|bis)\b)?(?:\s*[-–]?\s*\d+[a-z]?\b)?)/i

/** `Carrera 70 # 44-20 Medellín` → busca `Carrera 70 Medellín` y conserva `44-20`. */
export function separarPlaca(entrada: string): Consulta {
  const match = PLACA.exec(entrada)
  if (!match) return { texto: entrada.trim(), placa: "" }
  const texto = entrada
    .replace(match[0], " ")
    .replace(/[\s,]+/g, " ")
    .trim()
  // `78b 63` → `78b-63`, como se escribe una placa.
  const placa = match[1].trim().replace(/(\d[a-z]?)\s*[-–\s]\s*(?=\d)/gi, "$1-")
  return { texto, placa }
}

function direccionDe(lugar: Lugar): string | undefined {
  if (!lugar.street) return undefined
  // Algunas fichas guardan texto libre en el número.
  return /^\d/.test(lugar.housenumber ?? "")
    ? `${lugar.street} # ${lugar.housenumber}`
    : lugar.street
}

/** Texto que se guarda: de lo particular a lo general y sin partes repetidas. */
export function formatUbicacion(lugar: Lugar, placa: string): string {
  const esVia = lugar.type === "street"
  const nombre = esVia && placa ? `${lugar.name} # ${placa}` : lugar.name
  // Una vía cruza varios barrios: nombrar uno sería adivinar.
  const barrio = esVia ? undefined : lugar.district
  const partes = [
    nombre,
    direccionDe(lugar),
    barrio,
    lugar.city ?? lugar.county,
    lugar.state,
    "Colombia",
  ]
  return Array.from(new Set(partes.filter(Boolean)))
    .join(", ")
    .slice(0, MAX_UBICACION)
}

/** Con placa solo sirve la vía escrita: `Carrera 70A` no es `Carrera 70`. */
function preferirVia(lugares: Lugar[], texto: string): Lugar[] {
  const escrito = ` ${texto.toLowerCase()} `
  const vias = lugares.filter(
    (l) => l.type === "street" && escrito.includes(` ${l.name?.toLowerCase()} `),
  )
  return vias.length > 0 ? vias : lugares
}

const recientes = new Map<string, string[]>()

async function consultar(texto: string, signal: AbortSignal): Promise<Lugar[]> {
  const params = new URLSearchParams({
    q: texto,
    limit: "12",
    bbox: COLOMBIA,
    ...EMPRESA.sede,
  })
  for (const tag of EXCLUIDOS) params.append("osm_tag", tag)
  const response = await fetch(`${API_URL}?${params}`, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
    // El servicio externo no necesita saber desde qué pantalla se busca.
    referrerPolicy: "no-referrer",
  })
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`)
  const body = (await response.json()) as { features?: { properties?: Lugar }[] }
  return (body.features ?? []).flatMap((f) => (f.properties ? [f.properties] : []))
}

/** Sugerencias para lo escrito; rechaza si el servicio no responde. */
export async function buscarUbicaciones(
  entrada: string,
  signal: AbortSignal,
): Promise<string[]> {
  const clave = entrada.trim().toLowerCase()
  const guardado = recientes.get(clave)
  if (guardado) return guardado

  const { texto, placa } = separarPlaca(entrada)
  if (texto.length < MIN_CARACTERES) return []
  const lugares = await consultar(texto, signal)
  const utiles = lugares.filter(
    (l) => l.name && l.countrycode === "CO" && !PARADEROS.includes(l.osm_value ?? ""),
  )
  const elegidos = placa ? preferirVia(utiles, texto) : utiles
  const textos = elegidos.map((l) => formatUbicacion(l, placa))
  const resultado = Array.from(new Set(textos)).slice(0, MAX_RESULTADOS)
  recientes.set(clave, resultado)
  return resultado
}

/** Búsqueda en Google Maps: acepta cualquier texto, sea o no una sugerencia. */
export function getMapsUrl(ubicacion: string): string {
  const texto = /colombia/i.test(ubicacion) ? ubicacion : `${ubicacion}, Colombia`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(texto)}`
}
