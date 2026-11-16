import type { SelectOption } from "../../components/CustomSelect"
import type { Recepcion } from "./types"

export const INITIAL_RECEPCIONES: Recepcion[] = [
  {
    id: "1",
    codigo: "RCP-501",
    evento: "Festival 360",
    evento_id: 1,
    subcontrato: "Subcontrato Pantalla LED",
    subcontrato_id: 1,
    proveedor: "TechLight S.A.",
    tipo: "Recepción Montaje",
    fecha: "2026-10-01",
    estado: "Conforme",
    descripcion:
      "Recepción y verificación técnica de pantallas LED en montaje del Festival 360.",
    observaciones: "Acta firmada digitalmente conforme.",
    firma_digital: "DIGISIGN-TECHLIGHT-001",
    items: [
      { nombre: "Pantalla LED 3×2m", cantidad: 2, estado: "Excelente" },
      { nombre: "Controlador de video", cantidad: 1, estado: "Bueno" },
      { nombre: "Cableado HDMI 10m", cantidad: 4, estado: "Bueno" },
    ],
  },
  {
    id: "2",
    codigo: "RCP-502",
    evento: "Boda Prom San José",
    evento_id: 2,
    subcontrato: "Subcontrato Sonido",
    subcontrato_id: 2,
    proveedor: "AudioPro Events",
    tipo: "Recepción Montaje",
    fecha: "2026-10-05",
    estado: "Pendiente",
    descripcion:
      "Recepción de montaje de equipo de sonido profesional para ceremonia.",
    observaciones:
      "Pendiente verificación de calibración sonora con el ingeniero de sala.",
    items: [
      { nombre: 'Parlante JBL 15"', cantidad: 4, estado: "Bueno" },
      { nombre: "Mezcladora 16 canales", cantidad: 1, estado: "Bueno" },
      { nombre: "Micrófono inalámbrico", cantidad: 2, estado: "Bueno" },
      { nombre: "Amplificador Crown", cantidad: 2, estado: "Bueno" },
    ],
  },
  {
    id: "3",
    codigo: "RCP-503",
    evento: "Gala Corporativa Tech",
    evento_id: 3,
    subcontrato: "Subcontrato Iluminación",
    subcontrato_id: 3,
    proveedor: "LumiEvent Colombia",
    tipo: "Recepción Desmontaje",
    fecha: "2026-10-08",
    estado: "Cerrada",
    descripcion:
      "Recepción en desmontaje de equipos de iluminación post-evento.",
    observaciones:
      "Una cabeza móvil presentó daño en cuello giratorio. Se reportó incidente #INC-200.",
    items: [
      { nombre: "Cabeza móvil LED 200W", cantidad: 6, estado: "Dañado" },
      { nombre: "Luz de efectos láser", cantidad: 2, estado: "Bueno" },
      { nombre: "Dimmer rack 12 ch", cantidad: 1, estado: "Bueno" },
    ],
  },
  {
    id: "4",
    codigo: "RCP-504",
    evento: "Festival 360",
    evento_id: 1,
    subcontrato: "Devolución Pantalla LED",
    subcontrato_id: 1,
    proveedor: "TechLight S.A.",
    tipo: "Recepción Desmontaje",
    fecha: "2026-10-15",
    estado: "Cerrada",
    descripcion:
      "Recepción final de desmontaje y devolución a bodega de proveedor TechLight.",
    observaciones: "Todos los equipos recibidos en excelente estado.",
    parentCodigo: "RCP-501",
    items: [
      { nombre: "Pantalla LED 3×2m", cantidad: 2, estado: "Excelente" },
      { nombre: "Controlador de video", cantidad: 1, estado: "Excelente" },
      { nombre: "Cableado HDMI 10m", cantidad: 4, estado: "Bueno" },
    ],
  },
  {
    id: "5",
    codigo: "RCP-505",
    evento: "Quinceañera Rodríguez",
    evento_id: 4,
    subcontrato: "Subcontrato Catering",
    subcontrato_id: 4,
    proveedor: "Gourmet Events SAS",
    tipo: "Recepción Montaje",
    fecha: "2026-10-10",
    estado: "Pendiente",
    descripcion:
      "Recepción inicial de menaje y vitrinas refrigeradas para el evento.",
    observaciones:
      "Verificar temperatura de vitrinas refrigeradas al momento de la entrega.",
    items: [
      { nombre: "Vitrina refrigerada portátil", cantidad: 2, estado: "Bueno" },
      { nombre: "Juego de vajilla 100 puestos", cantidad: 1, estado: "Bueno" },
      { nombre: "Calentador de bandejas", cantidad: 3, estado: "Bueno" },
    ],
  },
]

export const EVENTOS_DISPONIBLES: SelectOption[] = [
  { label: "Festival 360", value: "Festival 360" },
  { label: "Boda Prom San José", value: "Boda Prom San José" },
  { label: "Gala Corporativa Tech", value: "Gala Corporativa Tech" },
  { label: "Quinceañera Rodríguez", value: "Quinceañera Rodríguez" },
  { label: "Lanzamiento TechCorp", value: "Lanzamiento TechCorp" },
]

export const TIPOS_OPTIONS: SelectOption[] = [
  { label: "Recepción Montaje", value: "Recepción Montaje" },
  { label: "Recepción Desmontaje", value: "Recepción Desmontaje" },
]

export const ESTADOS_OPTIONS: SelectOption[] = [
  { label: "Pendiente", value: "Pendiente" },
  { label: "Conforme", value: "Conforme" },
  { label: "Cerrada", value: "Cerrada" },
  { label: "Anulada", value: "Anulada" },
]

export const ESTADO_ITEM_COLORS: Record<string, string> = {
  Excelente: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30",
  Bueno: "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30",
  Regular: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30",
  Dañado: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30",
}
