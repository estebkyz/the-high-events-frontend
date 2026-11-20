import React, { useId, useMemo } from "react"
import { Lock, MapPin, CheckCircle2 } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import {
  CustomSelect,
  type SelectOption,
} from "../../../components/CustomSelect"
import {
  TIPOS_CITA_OPTIONS,
  MODALIDADES_CITA_OPTIONS,
  ESTADOS_CITA_OPTIONS,
  TIPOS_EVENTO_OPTIONS,
  ESTADOS_EVENTO_OPTIONS,
} from "../data"
import { EVENTOS_MOCK, CLIENTES_CATALOGO, COTIZACIONES_CATALOGO } from "../../eventos/data"
import type { AgendaFormData, AgendaKind } from "../types"

interface AgendamientoFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  formData: AgendaFormData
  setFormData: React.Dispatch<React.SetStateAction<AgendaFormData>>
  clientOptions: SelectOption[]
  venueOptions: SelectOption[]
  onAddClient: (clientName: string) => void
  onAddVenue: (venueName: string) => void
  onSwitchKind: (kind: AgendaKind) => void
  onSubmit: (e: React.FormEvent) => void
}

const LABEL_CLASS = "text-[12.5px] font-medium text-[#F8FAFC] block mb-1"
const INPUT_BASE =
  "w-full h-[38px] bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] " +
  "placeholder-[#64748B] hover:border-[#333C50] transition-colors " +
  "focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40"

const READONLY_BASE =
  "w-full h-[38px] bg-[#14171F] border border-dashed border-[#2D3748] rounded-xl text-xs text-[#F1F5F9] " +
  "px-3 flex items-center justify-between select-none"

export function AgendamientoFormDrawer({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  clientOptions,
  onAddClient,
  onSwitchKind,
  onSubmit,
}: AgendamientoFormDrawerProps) {
  const uid = useId()
  const isCita = formData.kind === "cita"

  // Catálogo unificado de eventos y cotizaciones aprobadas vinculadas a su cliente
  const registrosEventos = useMemo(() => {
    const fromEventos = EVENTOS_MOCK.map((ev) => ({
      id: ev.id,
      codigo: ev.cotizacion_codigo || `EV-${ev.id}`,
      nombre: ev.nombre,
      cliente_id: ev.cliente_id || "propio",
      cliente_nombre: ev.cliente_nombre,
      fecha: ev.hora_inicio.split("T")[0] || formData.dateISO,
      hora: (ev.hora_inicio.split("T")[1] || "18:00").slice(0, 5),
      direccion: ev.direccion,
    }))

    const existingNames = new Set(fromEventos.map((e) => e.nombre))
    const fromCotizaciones = COTIZACIONES_CATALOGO.filter(
      (c) => !existingNames.has(c.nombre_evento),
    ).map((c) => {
      const cli = CLIENTES_CATALOGO.find((cl) => cl.id === c.cliente_id)
      return {
        id: `cot-${c.id}`,
        codigo: c.codigo,
        nombre: c.nombre_evento,
        cliente_id: c.cliente_id,
        cliente_nombre: cli?.nombre || "The High Events",
        fecha: c.fecha_evento,
        hora: c.hora_inicio,
        direccion: c.direccion,
      }
    })

    return [...fromEventos, ...fromCotizaciones]
  }, [formData.dateISO])

  // Si hay un cliente seleccionado, filtra solo los eventos/cotizaciones de dicho cliente
  const eventosFiltradosPorCliente = useMemo(() => {
    if (!formData.client) return registrosEventos
    const byClient = registrosEventos.filter(
      (r) =>
        r.cliente_nombre.toLowerCase() === formData.client.toLowerCase() ||
        (formData.cliente_id && r.cliente_id === formData.cliente_id),
    )
    return byClient.length > 0 ? byClient : registrosEventos
  }, [registrosEventos, formData.client, formData.cliente_id])

  const eventoOptions = useMemo<SelectOption[]>(
    () =>
      eventosFiltradosPorCliente.map((r) => ({
        label: `${r.nombre} (${r.codigo})`,
        value: r.id,
        sublabel: `${r.cliente_nombre} · ${r.fecha} ${r.hora} · ${r.direccion}`,
      })),
    [eventosFiltradosPorCliente],
  )

  const handleSelectClienteEvento = (clientName: string) => {
    const cli = CLIENTES_CATALOGO.find((c) => c.nombre === clientName)
    const eventosDelCliente = registrosEventos.filter(
      (r) =>
        r.cliente_nombre.toLowerCase() === clientName.toLowerCase() ||
        (cli && r.cliente_id === cli.id),
    )
    const primero = eventosDelCliente[0]

    if (primero) {
      setFormData((f) => ({
        ...f,
        client: primero.cliente_nombre,
        cliente_id: primero.cliente_id,
        evento_id: primero.id,
        title: primero.nombre,
        dateISO: primero.fecha || f.dateISO,
        time: primero.hora || f.time,
        venue: primero.direccion,
      }))
    } else {
      setFormData((f) => ({
        ...f,
        client: clientName,
        cliente_id: cli?.id || "",
        evento_id: "",
      }))
    }
  }

  const handleSelectEventoVinculado = (eventoId: string) => {
    const found = registrosEventos.find((r) => r.id === eventoId)
    if (!found) return
    setFormData((f) => ({
      ...f,
      evento_id: found.id,
      title: found.nombre,
      client: found.cliente_nombre,
      cliente_id: found.cliente_id,
      dateISO: found.fecha || f.dateISO,
      time: found.hora || f.time,
      venue: found.direccion,
    }))
  }

  const eventoVinculado = useMemo(
    () =>
      registrosEventos.find(
        (r) => r.id === formData.evento_id || r.nombre === formData.title,
      ),
    [registrosEventos, formData.evento_id, formData.title],
  )

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-3xl"
      title={isEditing ? "Editar agendamiento" : "Crear agendamiento"}
    >
      <form onSubmit={onSubmit} className="space-y-3.5">
        {/* Fila superior: Tipo (Cita vs Evento) + Actividad/Motivo + Estado en 3 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <span className={LABEL_CLASS}>Tipo de agendamiento</span>
            <div className="grid grid-cols-2 gap-1 p-1 h-[38px] bg-[#111318] border border-[#262D3D] rounded-xl">
              <button
                type="button"
                onClick={() => onSwitchKind("evento")}
                className={`rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  !isCita
                    ? "bg-[#7C3AED] text-white shadow-xs"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                Evento
              </button>
              <button
                type="button"
                onClick={() => onSwitchKind("cita")}
                className={`rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  isCita
                    ? "bg-[#7C3AED] text-white shadow-xs"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                Cita / Reunión
              </button>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>
              {isCita ? "Motivo de la cita" : "Actividad programada"}
            </label>
            <CustomSelect
              options={isCita ? TIPOS_CITA_OPTIONS : TIPOS_EVENTO_OPTIONS}
              value={formData.type}
              onChange={(val) => setFormData((f) => ({ ...f, type: val }))}
              placeholder="Seleccionar..."
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Estado del agendamiento</label>
            <CustomSelect
              options={isCita ? ESTADOS_CITA_OPTIONS : ESTADOS_EVENTO_OPTIONS}
              value={formData.estado}
              onChange={(val) => setFormData((f) => ({ ...f, estado: val }))}
              placeholder="Seleccionar estado..."
            />
          </div>
        </div>

        {/* ── MODO EVENTO: Conectado a Cliente + Evento/Cotización (Hereda Nombre, Fecha, Hora y Dirección) ── */}
        {!isCita ? (
          <div className="space-y-3.5 pt-2 border-t border-[#262D3D]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLASS}>
                  1. Filtrar por Cliente{" "}
                  <span className="text-[#94A3B8] font-normal">(o elige el evento directo)</span>
                </label>
                <CustomSelect
                  options={clientOptions}
                  value={formData.client}
                  onChange={handleSelectClienteEvento}
                  searchable={true}
                  placeholder="Seleccionar cliente..."
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>
                  2. Evento / Cotización aprobada del cliente{" "}
                  <span className="text-[#7C3AED]">*</span>
                </label>
                <CustomSelect
                  options={eventoOptions}
                  value={eventoVinculado?.id || formData.evento_id || ""}
                  onChange={handleSelectEventoVinculado}
                  searchable={true}
                  placeholder="Seleccionar evento cotizado..."
                />
              </div>
            </div>

            {/* Datos heredados automáticamente del evento seleccionado (Sin pedir nombre, dirección ni fecha dos veces) */}
            <div className="p-3.5 rounded-xl bg-[#111318] border border-[#262D3D] space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#34D399]">
                  <CheckCircle2 size={14} />
                  {eventoVinculado
                    ? `Datos traídos automáticamente del evento (${eventoVinculado.codigo})`
                    : "Selecciona un evento para cargar automáticamente su nombre, cliente, fecha, hora y dirección"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className={LABEL_CLASS}>Nombre del evento (Heredado)</span>
                  <div className={READONLY_BASE} title="Traído automáticamente del evento">
                    <span className="truncate">
                      {formData.title || "Selecciona un evento arriba"}
                    </span>
                    <Lock size={12} className="text-[#94A3B8] shrink-0 ml-1.5" />
                  </div>
                </div>

                <div>
                  <span className={LABEL_CLASS}>Cliente titular (Heredado)</span>
                  <div className={READONLY_BASE} title="Traído automáticamente del evento">
                    <span className="truncate">
                      {formData.client || "Selecciona un evento arriba"}
                    </span>
                    <Lock size={12} className="text-[#94A3B8] shrink-0 ml-1.5" />
                  </div>
                </div>

                <div>
                  <span className={LABEL_CLASS}>Ubicación (Heredada)</span>
                  <div className={READONLY_BASE} title="Dirección registrada en el evento">
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin size={12} className="text-[#A78BFA] shrink-0" />
                      <span className="truncate">
                        {formData.venue || "Sin dirección asignada"}
                      </span>
                    </span>
                    <Lock size={12} className="text-[#94A3B8] shrink-0 ml-1.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor={`${uid}-fecha`} className={LABEL_CLASS}>
                    Fecha programada <span className="text-[#94A3B8] font-normal">(Por defecto del evento)</span>
                  </label>
                  <input
                    id={`${uid}-fecha`}
                    type="date"
                    required
                    value={formData.dateISO}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, dateISO: e.target.value }))
                    }
                    className={`${INPUT_BASE} px-3 [color-scheme:dark]`}
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-hora`} className={LABEL_CLASS}>
                    Hora de inicio <span className="text-[#94A3B8] font-normal">(Por defecto del evento)</span>
                  </label>
                  <input
                    id={`${uid}-hora`}
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, time: e.target.value }))
                    }
                    className={`${INPUT_BASE} px-3 [color-scheme:dark]`}
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-notas-ev`} className={LABEL_CLASS}>
                    Observaciones de agenda <span className="text-[#64748B] font-normal">(Opcional)</span>
                  </label>
                  <input
                    id={`${uid}-notas-ev`}
                    type="text"
                    placeholder="Ej. Confirmar ingreso de camión de sonido..."
                    value={formData.notas}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, notas: e.target.value }))
                    }
                    className={`${INPUT_BASE} px-3`}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── MODO CITA / REUNIÓN COMERCIAL: Distribuido en 2 y 3 columnas sin scroll ── */
          <div className="space-y-3.5 pt-2 border-t border-[#262D3D]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={LABEL_CLASS}>
                  Cliente <span className="text-[#7C3AED]">*</span>
                </label>
                <CustomSelect
                  options={clientOptions}
                  value={formData.client}
                  onChange={(val) => setFormData((f) => ({ ...f, client: val }))}
                  searchable={true}
                  allowCreate={true}
                  createLabel="Crear nuevo cliente"
                  onCreate={onAddClient}
                  placeholder="Seleccionar cliente"
                />
              </div>

              <div>
                <label htmlFor={`${uid}-titulo`} className={LABEL_CLASS}>
                  Asunto de la cita <span className="text-[#7C3AED]">*</span>
                </label>
                <input
                  id={`${uid}-titulo`}
                  type="text"
                  required
                  placeholder="Ej. Presentación propuesta técnica"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, title: e.target.value }))
                  }
                  className={`${INPUT_BASE} px-3`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Canal / Modalidad</label>
                <CustomSelect
                  options={MODALIDADES_CITA_OPTIONS}
                  value={formData.modalidadCita}
                  onChange={(val) =>
                    setFormData((f) => ({ ...f, modalidadCita: val }))
                  }
                  placeholder="Seleccionar canal..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor={`${uid}-fecha-cita`} className={LABEL_CLASS}>
                  Fecha de la cita <span className="text-[#7C3AED]">*</span>
                </label>
                <input
                  id={`${uid}-fecha-cita`}
                  type="date"
                  required
                  value={formData.dateISO}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, dateISO: e.target.value }))
                  }
                  className={`${INPUT_BASE} px-3 [color-scheme:dark]`}
                />
              </div>

              <div>
                <label htmlFor={`${uid}-hora-cita`} className={LABEL_CLASS}>
                  Hora de la cita <span className="text-[#7C3AED]">*</span>
                </label>
                <input
                  id={`${uid}-hora-cita`}
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, time: e.target.value }))
                  }
                  className={`${INPUT_BASE} px-3 [color-scheme:dark]`}
                />
              </div>

              <div>
                <label htmlFor={`${uid}-lugar-tentativo`} className={LABEL_CLASS}>
                  Lugar o dirección tentativa <span className="text-[#64748B] font-normal">(Opcional)</span>
                </label>
                <input
                  id={`${uid}-lugar-tentativo`}
                  type="text"
                  placeholder="Ej. Hacienda Fizebad / Por definir"
                  value={formData.lugarTentativo || ""}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      lugarTentativo: e.target.value,
                    }))
                  }
                  className={`${INPUT_BASE} px-3`}
                />
              </div>
            </div>

            <div>
              <label htmlFor={`${uid}-notas`} className={LABEL_CLASS}>
                Notas o requerimientos de la reunión{" "}
                <span className="text-[#64748B] font-normal">(Opcional)</span>
              </label>
              <input
                id={`${uid}-notas`}
                type="text"
                placeholder="Ej. Enlace de Google Meet o puntos clave a cotizar..."
                value={formData.notas}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, notas: e.target.value }))
                }
                className={`${INPUT_BASE} px-3`}
              />
            </div>
          </div>
        )}

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/25 cursor-pointer"
          >
            {isEditing
              ? "Guardar cambios"
              : isCita
                ? "Agendar cita"
                : "Agendar evento"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
