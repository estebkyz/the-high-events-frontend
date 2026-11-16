import type { EstadoIncidente, IncidenteItem, HistoryEntry, TipoIncidente, Criticidad } from "./types"

export const TIPO_INCIDENTE_OPTIONS: { label: string; value: TipoIncidente }[] = [
  { label: "Falla Eléctrica", value: "falla_electrica" },
  { label: "Corte de Agua", value: "corte_agua" },
  { label: "Daño en Equipo", value: "dano_equipo" },
  { label: "Inconveniente con Proveedor", value: "inconveniente_proveedor" },
  { label: "Retraso en Montaje", value: "retraso_montaje" },
  { label: "Seguridad u Orden Público", value: "seguridad_orden_publico" },
  { label: "Emergencia Médica", value: "emergencia_medica" },
  { label: "Otro", value: "otro" },
]

export const CRITICIDAD_OPTIONS: { label: string; value: Criticidad }[] = [
  { label: "Baja", value: "Baja" },
  { label: "Media", value: "Media" },
  { label: "Alta", value: "Alta" },
  { label: "Crítica", value: "Crítica" },
]

export const ESTADO_INCIDENTE_OPTIONS: { label: string; value: EstadoIncidente }[] = [
  { label: "Reportado", value: "Reportado" },
  { label: "En Atención", value: "En Atención" },
  { label: "Solucionado", value: "Solucionado" },
  { label: "Escalado", value: "Escalado" },
]

export const ESTADO_FILTER_OPTIONS = [
  { label: "Todos los Estados", value: "Todos" },
  ...ESTADO_INCIDENTE_OPTIONS,
]

export const INITIAL_INCIDENTS: IncidenteItem[] = [
  {
    id: "1",
    codigo: "INC-201",
    titulo: "Fallo de señal en Pantalla LED",
    evento: "Festival 360",
    evento_id: 1,
    reporta: "Carlos Ruiz",
    reportado_por_id: 1,
    tipo_incidente: "dano_equipo",
    criticidad: "Alta",
    fecha: "2026-10-10",
    estado: "Reportado",
    descripcion: "Módulo LED central parpadeando durante la prueba de video.",
    areaAfectada: "Pantalla Central",
    accionCorrectiva: "Reemplazo de módulo y cable HDMI principal.",
    acciones_tomadas: "Reemplazo de módulo y cable HDMI principal.",
    costo_adicional: 150000,
  },
  {
    id: "2",
    codigo: "INC-200",
    titulo: "Acople de audio en micrófono 2",
    evento: "Gala Corporativa",
    evento_id: 2,
    reporta: "Andrés Vera",
    reportado_por_id: 2,
    tipo_incidente: "falla_electrica",
    criticidad: "Media",
    fecha: "2026-10-02",
    estado: "En Atención",
    descripcion:
      "Frecuencia de micro inalámbrico interferida por router local.",
    areaAfectada: "Sistema de Audio",
    accionCorrectiva: "Cambio de canal UHF.",
    acciones_tomadas: "Cambio de canal UHF.",
    costo_adicional: 0,
  },
  {
    id: "3",
    codigo: "INC-199",
    titulo: "Retraso en entrega de mantelería",
    evento: "Boda Prom",
    evento_id: 3,
    reporta: "Sofía M.",
    reportado_por_id: 3,
    tipo_incidente: "retraso_montaje",
    criticidad: "Baja",
    fecha: "2026-09-28",
    estado: "Solucionado",
    descripcion: "Proveedor entregó 1 hora tarde.",
    areaAfectada: "Logística",
    accionCorrectiva: "Aviso formal al proveedor.",
    acciones_tomadas: "Aviso formal al proveedor.",
    costo_adicional: 0,
    resuelto_en: "2026-09-28 11:00",
  },
  {
    id: "4",
    codigo: "INC-198",
    titulo: "Cortocircuito en tablero eléctrico",
    evento: "Lanzamiento TechCorp",
    evento_id: 4,
    reporta: "Diego P.",
    reportado_por_id: 4,
    tipo_incidente: "falla_electrica",
    criticidad: "Crítica",
    fecha: "2026-09-15",
    estado: "Escalado",
    descripcion: "Sobrecarga en circuito C3 durante instalación de equipos.",
    areaAfectada: "Infraestructura Eléctrica",
    accionCorrectiva:
      "Reemplazo de breaker y revisión de carga máxima permitida con electricista certificado.",
    acciones_tomadas:
      "Reemplazo de breaker y revisión de carga máxima permitida.",
    costo_adicional: 450000,
  },
  {
    id: "5",
    codigo: "INC-197",
    titulo: "Micrófono inalámbrico sin señal",
    evento: "Congreso Médico 2026",
    evento_id: 5,
    reporta: "Valeria S.",
    reportado_por_id: 5,
    tipo_incidente: "dano_equipo",
    criticidad: "Media",
    fecha: "2026-09-12",
    estado: "Solucionado",
    descripcion: "Pila agotada durante presentación en vivo del Dr. Mora.",
    areaAfectada: "Audio Escenario",
    accionCorrectiva:
      "Cambio de pilas y protocolo de revisión previa a cada evento.",
    acciones_tomadas:
      "Cambio de pilas y protocolo de revisión previa a cada evento.",
    costo_adicional: 20000,
    resuelto_en: "2026-09-12 11:35",
  },
]

export const INITIAL_HISTORY: Record<string, HistoryEntry[]> = {
  "1": [
    {
      id: "h1",
      accion: "Incidente reportado durante prueba técnica de video.",
      responsable: "Carlos Ruiz",
      estado: "Reportado",
      timestamp: "2026-10-10 10:30",
      tipo: "initial",
    },
    {
      id: "h2",
      accion: "Asignado al equipo de soporte técnico de pantallas LED.",
      responsable: "Diego P.",
      estado: "Reportado",
      timestamp: "2026-10-10 11:15",
      tipo: "action",
    },
  ],
  "2": [
    {
      id: "h3",
      accion: "Acople detectado durante ensayo de micrófonos.",
      responsable: "Andrés Vera",
      estado: "Reportado",
      timestamp: "2026-10-02 09:00",
      tipo: "initial",
    },
    {
      id: "h4",
      accion:
        "Se identifica interferencia de router WiFi en frecuencia 672 MHz.",
      responsable: "Carlos Ruiz",
      estado: "En Atención",
      timestamp: "2026-10-02 10:45",
      tipo: "action",
    },
    {
      id: "h5",
      accion: "Cambio de canal UHF aplicado. Pendiente prueba de verificación.",
      responsable: "Andrés Vera",
      estado: "En Atención",
      timestamp: "2026-10-02 12:00",
      tipo: "action",
    },
  ],
  "3": [
    {
      id: "h6",
      accion: "Proveedor notificó retraso de 60 min en entrega de mantelería.",
      responsable: "Sofía M.",
      estado: "Reportado",
      timestamp: "2026-09-28 08:00",
      tipo: "initial",
    },
    {
      id: "h7",
      accion:
        "Entrega recibida. Aviso formal enviado al proveedor con copia a gerencia.",
      responsable: "Sofía M.",
      estado: "Solucionado",
      timestamp: "2026-09-28 09:10",
      tipo: "action",
    },
  ],
  "4": [
    {
      id: "h8",
      accion:
        "Cortocircuito detectado durante conexión de equipos de iluminación.",
      responsable: "Diego P.",
      estado: "Reportado",
      timestamp: "2026-09-15 14:00",
      tipo: "initial",
    },
    {
      id: "h9",
      accion:
        "Electricista revisó tablero. Breaker C3 quemado, sobrecarga confirmada. Se escala por riesgo eléctrico.",
      responsable: "Técnico Externo",
      estado: "Escalado",
      timestamp: "2026-09-15 16:30",
      tipo: "action",
    },
  ],
  "5": [
    {
      id: "h11",
      accion:
        "Presentador reportó pérdida de señal en micrófono durante ponencia.",
      responsable: "Valeria S.",
      estado: "Reportado",
      timestamp: "2026-09-12 11:20",
      tipo: "initial",
    },
    {
      id: "h12",
      accion: "Pilas reemplazadas durante pausa de 5 min. Micrófono operativo.",
      responsable: "Carlos Ruiz",
      estado: "Solucionado",
      timestamp: "2026-09-12 11:32",
      tipo: "action",
    },
  ],
}
