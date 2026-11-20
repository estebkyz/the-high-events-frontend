import type {
  EquipoItem,
  Categoria,
  EstadoOperativo,
  MantenimientoEntry,
} from "./types"

export const CATEGORIA_OPTIONS: Categoria[] = [
  "Audio",
  "Iluminación",
  "Video",
  "Estructuras",
]

export const PROPIEDAD_OPTIONS = [
  "Propio",
  "Alquilado",
] as const

export const ESTADO_OPERATIVO_OPTIONS: EstadoOperativo[] = [
  "Disponible",
  "En Evento",
  "Prestado",
  "En Mantenimiento",
  "De Baja",
]

export const MAINTENANCE_HISTORY: Record<string, MantenimientoEntry[]> = {
  "1": [
    {
      fecha: "2026-08-15",
      descripcion: "Limpieza de conectores XLR y revisión de faders",
      tecnico: "Carlos Ruiz",
    },
    {
      fecha: "2026-06-02",
      descripcion: "Actualización de firmware v4.2",
      tecnico: "Andrés Vera",
    },
  ],
  "2": [
    {
      fecha: "2026-07-20",
      descripcion: "Reemplazo de lámpara 350W agotada",
      tecnico: "Carlos Ruiz",
    },
  ],
  "3": [
    {
      fecha: "2026-09-01",
      descripcion: "Sustitución de módulo LED defectuoso en cuadrante 3",
      tecnico: "Diego P.",
    },
    {
      fecha: "2026-07-14",
      descripcion: "Calibración de color y brillo",
      tecnico: "Andrés Vera",
    },
  ],
  "6": [
    {
      fecha: "2026-07-20",
      descripcion: "Reemplazo de lámpara 350W",
      tecnico: "Carlos Ruiz",
    },
    {
      fecha: "2026-05-10",
      descripcion: "Calibración de motores tilt/pan",
      tecnico: "Sofía M.",
    },
  ],
  "8": [
    {
      fecha: "2026-09-10",
      descripcion: "Revisión de soldadura en juntas de truss",
      tecnico: "Andrés Vera",
    },
    {
      fecha: "2026-08-01",
      descripcion: "Reemplazo de tornillos de seguridad",
      tecnico: "Diego P.",
    },
    {
      fecha: "2026-06-15",
      descripcion: "Inspección preventiva general",
      tecnico: "Carlos Ruiz",
    },
  ],
}

export const INITIAL_EQUIPMENT: EquipoItem[] = [
  {
    id: "1",
    codigo: "EQ-001",
    nombre: "Consola Digital Behringer X32",
    categoria: "Audio",
    serie: "SN-320491",
    estadoOperativo: "Disponible",
    propiedad: "Propio",
    proveedor_id: null,
    costo_adquisicion: 12000000,
    mantenimiento_proximo: "2026-11-15",
  },
  {
    id: "2",
    codigo: "EQ-002",
    nombre: "Robótica Moving Head 350W",
    categoria: "Iluminación",
    serie: "MH-992011",
    estadoOperativo: "Prestado",
    propiedad: "Alquilado",
    proveedor_id: 2,
    proveedor_nombre: "LuminaTech S.A.S.",
    costo_alquiler_dia: 180000,
  },
  {
    id: "3",
    codigo: "EQ-003",
    nombre: "Pantalla LED P3.9 Outdoor 3×2m",
    categoria: "Video",
    serie: "LED-00412",
    estadoOperativo: "En Mantenimiento",
    propiedad: "Propio",
    proveedor_id: null,
    costo_adquisicion: 28000000,
    mantenimiento_proximo: "2026-11-05",
  },
  {
    id: "4",
    codigo: "EQ-004",
    nombre: "Micrófono Shure QLXD24/SM58",
    categoria: "Audio",
    serie: "SH-884102",
    estadoOperativo: "Disponible",
    propiedad: "Propio",
    proveedor_id: null,
    costo_adquisicion: 4500000,
  },
  {
    id: "5",
    codigo: "EQ-005",
    nombre: "Truss Cuadrado 3×3m Global Truss",
    categoria: "Estructuras",
    serie: "GT-443921",
    estadoOperativo: "Disponible",
    propiedad: "Alquilado",
    proveedor_id: 5,
    proveedor_nombre: "Estructuras & Escenarios del Valle",
    costo_alquiler_dia: 120000,
  },
  {
    id: "6",
    codigo: "EQ-006",
    nombre: "Par LED RGBWA Cameo Flat 1",
    categoria: "Iluminación",
    serie: "CF-119023",
    estadoOperativo: "En Evento",
    propiedad: "Propio",
    proveedor_id: null,
    costo_adquisicion: 850000,
  },
  {
    id: "7",
    codigo: "EQ-007",
    nombre: "Proyector Epson EB-L615U 6000 Lúm",
    categoria: "Video",
    serie: "EP-615002",
    estadoOperativo: "Disponible",
    propiedad: "Alquilado",
    proveedor_id: 4,
    proveedor_nombre: "Visuales y Pantallas Pro",
    costo_alquiler_dia: 350000,
  },
  {
    id: "8",
    codigo: "EQ-008",
    nombre: "Torre de aluminio 4m con base pesada",
    categoria: "Estructuras",
    serie: "TA-220891",
    estadoOperativo: "En Mantenimiento",
    propiedad: "Propio",
    proveedor_id: null,
    costo_adquisicion: 3200000,
    mantenimiento_proximo: "2026-12-01",
  },
]

export const INITIAL_EQUIPOS = INITIAL_EQUIPMENT


