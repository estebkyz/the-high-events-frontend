import { useEffect, useId, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  MapPin,
  Calendar,
  Clock,
  FilePlus,
  Lock,
  CheckCircle2,
  Users,
  Ticket,
  Check,
} from "lucide-react"
import type { ReactNode, Dispatch, SetStateAction } from "react"
import type { ModalidadEvento, EstadoEvento, EventoFormValues } from "../types"
import { ESTADOS_EVENTO } from "../types"
import { CLIENTES_CATALOGO, COTIZACIONES_CATALOGO } from "../data"
import { CustomSelect, type SelectOption } from "../../../components/CustomSelect"

interface EventoDatosSectionProps {
  form: EventoFormValues
  setForm: Dispatch<SetStateAction<EventoFormValues>>
}

const OPCIONES_MODALIDAD = [
  {
    value: "Cliente",
    icon: Users,
    titulo: "Evento para cliente",
    descripcion: "Lo contrata un cliente. Pide cliente y cotización.",
  },
  {
    value: "Propio",
    icon: Ticket,
    titulo: "Evento propio",
    descripcion: "Lo produce The High Events. No requiere cliente.",
  },
] as const

function ModalidadSelector({
  value,
  onChange,
}: {
  value: ModalidadEvento
  onChange: (modalidad: ModalidadEvento) => void
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#262D3D]">
      <div>
        <h2 className="text-[15px] font-bold text-[#F8FAFC]">
          Datos generales
        </h2>
      </div>

      <div
        role="radiogroup"
        aria-label="Modalidad del evento"
        className="inline-flex items-center gap-1.5 p-1 bg-[#111318] border border-[#262D3D] rounded-xl shrink-0"
      >
        {OPCIONES_MODALIDAD.map(({ value: optValue, icon: Icon, titulo }) => {
          const selected = value === optValue
          return (
            <button
              key={optValue}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(optValue)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                selected
                  ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <Icon size={14} aria-hidden="true" />
              <span>{titulo}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const COTIZACION_EVENTO_PROPIO_ID = "5"

const labelClass = "text-[13px] font-medium text-[#F8FAFC] block mb-1.5"

// `border border-transparent` hace que hover/focus/invalid puedan cambiar el color del borde
// sin alterar el aspecto plano actual (antes esas clases no tenían efecto: no había ancho de borde).
const fieldBase =
  "w-full h-[42px] bg-[#111318] rounded-xl text-xs text-[#F8FAFC] border border-transparent " +
  "placeholder:text-[#94A3B8] hover:border-[#3B4A63] transition-colors " +
  "focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40"

// Campo heredado de la cotización: borde punteado + candado = "no editable aquí"
const readOnlyFieldBase =
  "w-full h-[42px] bg-[#14171F] rounded-xl text-xs text-white border border-dashed border-[#2D3748] " +
  "px-3.5 flex items-center select-none cursor-default"

const dateTimeField =
  `${fieldBase} relative pl-10 pr-3.5 [color-scheme:dark] cursor-pointer ` +
  "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 " +
  "[&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full " +
  "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"

/* ------------------------------- Helpers ------------------------------- */

const splitDT = (v?: string): [string, string] => {
  const [d = "", t = ""] = (v || "").split("T")
  return [d, t.slice(0, 5)]
}
const joinDT = (d: string, t: string) => (d || t ? `${d}T${t}` : "")

const addDays = (isoDate: string, n: number) =>
  new Date(Date.parse(isoDate) + n * 86400000).toISOString().slice(0, 10)

const formatNumber = (n: number) => n.toLocaleString("es-CO")
const formatCOP = (n: number) => `$ ${formatNumber(n)}`

const fmtFecha = (iso?: string) => {
  if (!iso) return ""
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
const fmtHora = (hhmm: string) =>
  new Date(`1970-01-01T${hhmm}:00`).toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
  })

/** "20 nov 2026 · 7:00 p. m. → 21 nov 2026 · 2:00 a. m." (en vez de ISO crudo) */
function formatRango(inicio?: string, fin?: string) {
  const [d1, t1] = splitDT(inicio)
  const [d2, t2] = splitDT(fin)
  if (!d1 || !t1) return "—"
  const ini = `${fmtFecha(d1)} · ${fmtHora(t1)}`
  if (!d2 || !t2) return ini
  return d1 === d2
    ? `${ini} – ${fmtHora(t2)}`
    : `${ini} → ${fmtFecha(d2)} · ${fmtHora(t2)}`
}

function formatDuracion(totalMin: number) {
  if (totalMin >= 1440) {
    const d = Math.floor(totalMin / 1440)
    const h = Math.floor((totalMin % 1440) / 60)
    return `${d} d${h ? ` ${h} h` : ""}`
  }
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${h} h${m ? ` ${m} min` : ""}`
}

/**
 * Convención de eventos nocturnos: si el fin cae el mismo día pero a una hora
 * igual o anterior al inicio (p. ej. 19:00 → 02:00), el fin es al día siguiente.
 */
function normalizarFin(iniD: string, iniT: string, finD: string, finT: string) {
  if (iniD && iniT && finD && finT && finD === iniD && finT <= iniT) {
    return addDays(iniD, 1)
  }
  return finD
}

// Campos que cambian al cambiar de modalidad: se guardan por modalidad para no perder lo digitado.
const CAMPOS_MODALIDAD = [
  "cliente_id",
  "cliente_nombre",
  "cotizacion_id",
  "cotizacion_codigo",
  "nombre",
  "direccion",
  "concepto_espectaculo",
  "hora_inicio",
  "hora_fin",
  "aforo_esperado",
  "presupuesto_estimado",
  "observaciones",
  "servicios",
  "serviciosDetalles",
] as (keyof EventoFormValues)[]

const snapshot = (f: EventoFormValues): Partial<EventoFormValues> =>
  Object.fromEntries(CAMPOS_MODALIDAD.map((k) => [k, f[k]])) as Partial<EventoFormValues>

function CampoHeredado({
  label,
  icon,
  children,
  multiline = false,
  className = "",
}: {
  label: string
  icon?: ReactNode
  children: ReactNode
  multiline?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <span className={labelClass}>{label}</span>
      <div
        title="Heredado de la cotización"
        className={`${readOnlyFieldBase} ${multiline ? "!h-auto min-h-[42px] py-2.5 items-start" : ""}`}
      >
        {icon}
        <span
          className={`flex-1 min-w-0 ${multiline ? "whitespace-pre-wrap break-words" : "truncate"}`}
        >
          {children}
        </span>
        <Lock size={12} aria-hidden="true" className="ml-2 shrink-0 text-[#94A3B8]" />
        <span className="sr-only">Heredado de la cotización, solo lectura</span>
      </div>
    </div>
  )
}

/* ------------------------------ Componente ------------------------------ */

export function EventoDatosSection({ form, setForm }: EventoDatosSectionProps) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const navigate = useNavigate()
  const borradores = useRef<Partial<Record<ModalidadEvento, Partial<EventoFormValues>>>>({})

  // Que lo que se ve sea lo que realmente hay en el estado.
  // El estado por defecto sale del catálogo (antes era el literal "Planificación", que no existe en ESTADOS_EVENTO).
  useEffect(() => {
    setForm((f) =>
      f.modalidad && f.estado
        ? f
        : {
            ...f,
            modalidad: f.modalidad ?? "Cliente",
            estado: f.estado ?? (ESTADOS_EVENTO[0] as EstadoEvento),
          },
    )
  }, [setForm])

  const modalidad: ModalidadEvento = form.modalidad || "Cliente"
  const esPropio = modalidad === "Propio"
  const esCliente = modalidad === "Cliente"

  const cotizacionesDelCliente = useMemo(() => {
    if (!form.cliente_id) return []
    return COTIZACIONES_CATALOGO.filter(
      (c) => c.cliente_id === form.cliente_id && c.id !== COTIZACION_EVENTO_PROPIO_ID,
    )
  }, [form.cliente_id])

  const clienteSeleccionado = useMemo(
    () => CLIENTES_CATALOGO.find((c) => c.id === form.cliente_id),
    [form.cliente_id],
  )

  const cotizacionSeleccionada = useMemo(() => {
    if (esPropio) {
      return COTIZACIONES_CATALOGO.find((c) => c.id === COTIZACION_EVENTO_PROPIO_ID)
    }
    return COTIZACIONES_CATALOGO.find((c) => c.id === form.cotizacion_id)
  }, [esPropio, form.cotizacion_id])

  const clienteOptions: SelectOption[] = useMemo(
    () => CLIENTES_CATALOGO.map((c) => ({ label: c.nombre, value: c.id })),
    [],
  )

  const cotizacionOptions: SelectOption[] = useMemo(
    () =>
      cotizacionesDelCliente.map((c) => ({
        label: `${c.codigo} — ${c.nombre_evento} (${formatCOP(c.total)})`,
        value: c.id,
      })),
    [cotizacionesDelCliente],
  )

  const estadoOptions: SelectOption[] = useMemo(
    () => ESTADOS_EVENTO.map((est) => ({ label: est, value: est })),
    [],
  )

  const estadoValue = form.estado || ESTADOS_EVENTO[0]

  /* ---------------------------- Modalidad ---------------------------- */

  const handleModalidad = (nueva: ModalidadEvento) => {
    if (nueva === modalidad) return

    // Guarda lo digitado en la modalidad actual y restaura lo de la otra, si existe.
    borradores.current[modalidad] = snapshot(form)
    const guardado = borradores.current[nueva]
    if (guardado) {
      setForm((f) => ({ ...f, ...guardado, modalidad: nueva }))
      return
    }

    if (nueva === "Propio") {
      const cotPropia = COTIZACIONES_CATALOGO.find((c) => c.id === COTIZACION_EVENTO_PROPIO_ID)
      setForm((f) => ({
        ...f,
        modalidad: "Propio",
        cliente_id: null,
        cliente_nombre: "The High Events",
        cotizacion_id: COTIZACION_EVENTO_PROPIO_ID,
        cotizacion_codigo: cotPropia?.codigo || "COT-INT-01",
        nombre: "",
        direccion: "",
        concepto_espectaculo: "",
        // Las fechas de la cotización del cliente no deben quedar en un evento propio
        hora_inicio: "",
        hora_fin: "",
        presupuesto_estimado: 0,
        aforo_esperado: "",
        observaciones: "",
        servicios: [],
        serviciosDetalles: [],
      }))
    } else {
      // Vuelve a Cliente: nada preseleccionado, el usuario elige cliente y cotización
      setForm((f) => ({
        ...f,
        modalidad: "Cliente",
        cliente_id: "",
        cliente_nombre: "",
        cotizacion_id: "",
        cotizacion_codigo: "",
        nombre: "",
        direccion: "",
        concepto_espectaculo: "",
        hora_inicio: "",
        hora_fin: "",
        presupuesto_estimado: 0,
        aforo_esperado: "",
        observaciones: "",
        servicios: [],
        serviciosDetalles: [],
      }))
    }
  }

  /* ----------------------- Cliente y cotización ----------------------- */

  const aplicarCotizacion = (
    f: EventoFormValues,
    cot: (typeof COTIZACIONES_CATALOGO)[number],
  ): EventoFormValues => ({
    ...f,
    cotizacion_id: cot.id,
    cotizacion_codigo: cot.codigo,
    nombre: cot.nombre_evento,
    direccion: cot.direccion,
    hora_inicio: joinDT(cot.fecha_evento, cot.hora_inicio),
    hora_fin: joinDT(cot.fecha_evento, cot.hora_fin),
    aforo_esperado: String(cot.aforo_esperado),
    presupuesto_estimado: cot.total,
    observaciones: cot.observaciones || "",
    servicios: cot.servicios,
    serviciosDetalles: [],
  })

  const handleCliente = (clienteId: string) => {
    const cots = COTIZACIONES_CATALOGO.filter(
      (c) => c.cliente_id === clienteId && c.id !== COTIZACION_EVENTO_PROPIO_ID,
    )
    const cli = CLIENTES_CATALOGO.find((c) => c.id === clienteId)
    const primeraCot = cots[0]

    if (primeraCot) {
      setForm((f) => ({
        ...aplicarCotizacion(f, primeraCot),
        cliente_id: clienteId,
        cliente_nombre: cli?.nombre || "",
      }))
    } else {
      setForm((f) => ({
        ...f,
        cliente_id: clienteId,
        cliente_nombre: cli?.nombre || "",
        cotizacion_id: "",
        cotizacion_codigo: "",
        nombre: "",
        direccion: "",
        hora_inicio: "",
        hora_fin: "",
        aforo_esperado: "",
        presupuesto_estimado: 0,
        observaciones: "",
        servicios: [],
        serviciosDetalles: [],
      }))
    }
  }

  const handleCotizacion = (cotId: string) => {
    const cot = COTIZACIONES_CATALOGO.find((c) => c.id === cotId)
    if (cot) setForm((f) => aplicarCotizacion(f, cot))
  }

  /* ------------------------ Fechas (evento propio) ------------------------ */

  const [startD, startT] = splitDT(form.hora_inicio)
  const [endD, endT] = splitDT(form.hora_fin)

  const updateInicio = (d: string, t: string) => {
    setForm((f) => {
      const [prevD] = splitDT(f.hora_inicio)
      const [fd, ft] = splitDT(f.hora_fin)

      let finD = fd
      if (d && !fd) {
        finD = d // propone el mismo día si aún no hay fin
      } else if (d && prevD && fd && d !== prevD) {
        // Al mover el inicio de día, el fin se mueve igual (conserva la duración)
        const delta = Math.round((Date.parse(d) - Date.parse(prevD)) / 86400000)
        finD = addDays(fd, delta)
      }
      finD = normalizarFin(d, t, finD, ft)

      return { ...f, hora_inicio: joinDT(d, t), hora_fin: joinDT(finD, ft) }
    })
  }

  const updateFin = (d: string, t: string, desdeHora = false) => {
    setForm((f) => {
      const [id0, it0] = splitDT(f.hora_inicio)
      // Solo se auto-ajusta al día siguiente cuando el usuario cambia la HORA;
      // si elige la fecha a mano, se respeta y se valida.
      const finD = desdeHora ? normalizarFin(id0, it0, d, t) : d
      return { ...f, hora_fin: joinDT(finD, t) }
    })
  }

  const rangoCompleto = Boolean(startD && startT && endD && endT)
  const inicioMs = rangoCompleto ? Date.parse(`${startD}T${startT}`) : NaN
  const finMs = rangoCompleto ? Date.parse(`${endD}T${endT}`) : NaN
  const rangoInvalido = rangoCompleto && finMs <= inicioMs

  const duracionTexto = useMemo(() => {
    if (!rangoCompleto || rangoInvalido) return ""
    const minutos = Math.round((finMs - inicioMs) / 60000)
    const dias = Math.round((Date.parse(endD) - Date.parse(startD)) / 86400000)
    const cuando =
      dias === 1
        ? " · termina al día siguiente"
        : dias > 1
          ? ` · termina ${dias} días después`
          : ""
    return `Duración: ${formatDuracion(minutos)}${cuando}`
  }, [rangoCompleto, rangoInvalido, inicioMs, finMs, startD, endD])

  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-5">
      {/* Barra superior compacta de modalidad */}
      <ModalidadSelector value={modalidad} onChange={handleModalidad} />

      <div>
        {/* ============================ EVENTO DE CLIENTE ============================ */}
        {esCliente && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={id("cliente-select")} className={labelClass}>
                  Cliente
                </label>
                <CustomSelect
                  id={id("cliente-select")}
                  options={clienteOptions}
                  value={form.cliente_id || ""}
                  searchable={true}
                  onChange={(val) => handleCliente(val)}
                  placeholder="Selecciona un cliente"
                />
              </div>

              <div>
                <label htmlFor={id("cot-select")} className={labelClass}>
                  Cotización vinculada
                </label>
                <CustomSelect
                  id={id("cot-select")}
                  options={cotizacionOptions}
                  value={form.cotizacion_id || ""}
                  searchable={true}
                  disabled={!form.cliente_id || cotizacionesDelCliente.length === 0}
                  onChange={(val) => handleCotizacion(val)}
                  placeholder={
                    !form.cliente_id
                      ? "Selecciona un cliente"
                      : cotizacionesDelCliente.length === 0
                        ? "Sin cotizaciones previas"
                        : "Selecciona una cotización"
                  }
                />
              </div>
            </div>

            {/* Cliente sin cotización: es un paso previo requerido, no un error (ámbar, no rojo) */}
            {form.cliente_id && cotizacionesDelCliente.length === 0 && (
              <div
                role="status"
                className="p-5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#F59E0B]/20 text-[#FBBF24] shrink-0 mt-0.5">
                    <FilePlus size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F1F5F9]">
                      {clienteSeleccionado?.nombre || "El cliente seleccionado"} no tiene una
                      cotización registrada
                    </h4>
                    <p className="text-xs text-[#CBD5E1] mt-1 max-w-xl leading-relaxed">
                      Para crear un evento de cliente es obligatorio contar con una cotización
                      aprobada donde se definan el nombre, fecha, horario, lugar y servicios
                      contratados.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/cotizaciones")}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors shrink-0 flex items-center gap-1.5 shadow-sm shadow-[#7C3AED]/25 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
                >
                  <FilePlus size={14} aria-hidden="true" />
                  <span>Crear cotización previa</span>
                </button>
              </div>
            )}

            {/* Con cotización: datos heredados y bloqueados */}
            {cotizacionSeleccionada && (
              <div className="space-y-4 animate-fade-in pt-4 border-t border-[#262D3D]">
                <div className="p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    aria-hidden="true"
                    className="text-[#34D399] shrink-0 mt-0.5"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-[#D1FAE5]">
                      Datos heredados de la cotización{" "}
                      <span className="font-mono font-bold text-white">
                        {cotizacionSeleccionada.codigo}
                      </span>
                    </p>
                    {(cotizacionSeleccionada.fecha_emision ||
                      cotizacionSeleccionada.fecha_vencimiento) && (
                      <p className="text-[11px] text-[#A7F3D0] mt-1">
                        {cotizacionSeleccionada.fecha_emision &&
                          `Emitida ${fmtFecha(cotizacionSeleccionada.fecha_emision)}`}
                        {cotizacionSeleccionada.fecha_emision &&
                          cotizacionSeleccionada.fecha_vencimiento &&
                          " · "}
                        {cotizacionSeleccionada.fecha_vencimiento &&
                          `Vence ${fmtFecha(cotizacionSeleccionada.fecha_vencimiento)}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CampoHeredado label="Nombre del evento">{form.nombre}</CampoHeredado>

                  <CampoHeredado
                    label="Ubicación"
                    icon={<MapPin size={13} aria-hidden="true" className="text-[#94A3B8] mr-2 shrink-0" />}
                  >
                    {form.direccion}
                  </CampoHeredado>

                  <CampoHeredado
                    label="Fecha y horario"
                    icon={<Calendar size={13} aria-hidden="true" className="text-[#94A3B8] mr-2 shrink-0" />}
                  >
                    {formatRango(form.hora_inicio, form.hora_fin)}
                  </CampoHeredado>

                  <CampoHeredado label="Presupuesto estimado">
                    <span className="font-semibold">
                      {formatCOP(form.presupuesto_estimado || 0)}
                    </span>
                  </CampoHeredado>

                  <CampoHeredado label="Aforo esperado">
                    {formatNumber(Number(form.aforo_esperado || 0))} personas
                  </CampoHeredado>

                  <div>
                    <label htmlFor={id("cliente-estado")} className={labelClass}>
                      Estado del evento
                    </label>
                    <CustomSelect
                      id={id("cliente-estado")}
                      options={estadoOptions}
                      value={estadoValue}
                      onChange={(val) =>
                        setForm((f) => ({ ...f, estado: val as EstadoEvento }))
                      }
                    />
                  </div>

                  <CampoHeredado label="Observaciones" multiline className="sm:col-span-3">
                    {form.observaciones ||
                      cotizacionSeleccionada.observaciones ||
                      "Sin observaciones registradas en la cotización"}
                  </CampoHeredado>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================= EVENTO PROPIO (THE HIGH EVENTS) ======================= */}
        {esPropio && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={id("propio-nombre")} className={labelClass}>
                  Nombre del evento
                </label>
                <input
                  id={id("propio-nombre")}
                  type="text"
                  maxLength={150}
                  placeholder="Ej. Festival Electrónico 360 Open Air"
                  value={form.nombre || ""}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className={`${fieldBase} px-3.5`}
                  required
                />
              </div>

              <div>
                <label htmlFor={id("propio-venue")} className={labelClass}>
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                  />
                  <input
                    id={id("propio-venue")}
                    type="text"
                    maxLength={150}
                    placeholder="Discoteca 360 Club, Medellín"
                    value={form.direccion || ""}
                    onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                    className={`${fieldBase} pl-10 pr-4`}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor={id("concepto")} className={labelClass}>
                Concepto del evento
              </label>
              <textarea
                id={id("concepto")}
                rows={2}
                placeholder="Describe el concepto: show de visuales 360, láseres y música en vivo..."
                value={form.concepto_espectaculo || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, concepto_espectaculo: e.target.value }))
                }
                className={`${fieldBase} h-auto p-3.5 resize-none`}
                required
              />
            </div>

            {/* Fechas y horarios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label htmlFor={id("inicio-fecha")} className={labelClass}>
                  Inicio del evento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar
                      size={14}
                      aria-hidden="true"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none z-10"
                    />
                    <input
                      id={id("inicio-fecha")}
                      type="date"
                      aria-label="Fecha de inicio"
                      value={startD}
                      onChange={(e) => updateInicio(e.target.value, startT)}
                      className={dateTimeField}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Clock
                      size={14}
                      aria-hidden="true"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none z-10"
                    />
                    <input
                      type="time"
                      aria-label="Hora de inicio"
                      value={startT}
                      onChange={(e) => updateInicio(startD, e.target.value)}
                      className={dateTimeField}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor={id("fin-fecha")} className={labelClass}>
                  Fin del evento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar
                      size={14}
                      aria-hidden="true"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none z-10"
                    />
                    <input
                      id={id("fin-fecha")}
                      type="date"
                      aria-label="Fecha de fin"
                      aria-invalid={rangoInvalido}
                      aria-describedby={id("rango")}
                      min={startD || undefined}
                      value={endD}
                      onChange={(e) => updateFin(e.target.value, endT)}
                      // Bloquea el envío nativo si el fin no es posterior al inicio
                      ref={(el) =>
                        el?.setCustomValidity(
                          rangoInvalido ? "El fin debe ser posterior al inicio." : "",
                        )
                      }
                      className={`${dateTimeField} ${rangoInvalido ? "!border-[#EF4444]" : ""}`}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Clock
                      size={14}
                      aria-hidden="true"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none z-10"
                    />
                    <input
                      type="time"
                      aria-label="Hora de fin"
                      aria-invalid={rangoInvalido}
                      value={endT}
                      onChange={(e) => updateFin(endD, e.target.value, true)}
                      className={`${dateTimeField} ${rangoInvalido ? "!border-[#EF4444]" : ""}`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Siempre ocupa su línea: no mueve el formulario al aparecer */}
              <p
                id={id("rango")}
                role={rangoInvalido ? "alert" : undefined}
                className={`lg:col-span-2 text-[11px] -mt-2 min-h-[16px] ${
                  rangoInvalido ? "text-[#F87171]" : "text-[#A78BFA]"
                }`}
              >
                {rangoInvalido ? "El fin debe ser posterior al inicio." : duracionTexto}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor={id("propio-presupuesto")} className={labelClass}>
                  Presupuesto estimado
                </label>
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8]"
                  >
                    $
                  </span>
                  <input
                    id={id("propio-presupuesto")}
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={
                      form.presupuesto_estimado ? formatNumber(form.presupuesto_estimado) : ""
                    }
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        presupuesto_estimado: Number(e.target.value.replace(/\D/g, "")) || 0,
                      }))
                    }
                    className={`${fieldBase} pl-7 pr-3.5`}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor={id("propio-aforo")} className={labelClass}>
                  Aforo estimado (personas)
                </label>
                <input
                  id={id("propio-aforo")}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="800"
                  value={form.aforo_esperado || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      aforo_esperado: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className={`${fieldBase} px-3.5`}
                />
              </div>

              <div>
                <label htmlFor={id("propio-estado")} className={labelClass}>
                  Estado del evento
                </label>
                <CustomSelect
                  id={id("propio-estado")}
                  options={estadoOptions}
                  value={estadoValue}
                  onChange={(val) =>
                    setForm((f) => ({ ...f, estado: val as EstadoEvento }))
                  }
                />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor={id("propio-observaciones")} className={labelClass}>
                  Observaciones (opcional)
                </label>
                <span className="text-[11px] text-[#94A3B8]">
                  {(form.observaciones || "").length}/500
                </span>
              </div>
              <textarea
                id={id("propio-observaciones")}
                rows={3}
                maxLength={500}
                placeholder="Notas logísticas, requerimientos técnicos o detalles de producción"
                value={form.observaciones || ""}
                onChange={(e) => setForm((f) => ({ ...f, observaciones: e.target.value }))}
                className={`${fieldBase} h-auto p-3.5 resize-none`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}