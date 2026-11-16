import React, { useMemo, useState } from "react"
import { Trash2, Plus, Tag, User, Building2, Briefcase, Calendar, DollarSign, Sparkles } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect, type SelectOption } from "../../../components/CustomSelect"
import type {
  CotizacionItem,
  CotizacionFormData,
  EstadoCotizacion,
} from "../types"
import { ESTADO_COTIZACION_OPTIONS } from "../data"
import { INITIAL_CLIENTS } from "../../clientes/data"
import {
  getEmpleadosCatalogo,
  getServiciosCatalogo,
  type ServicioCatalogoItem,
} from "../../eventos/catalogStore"

interface CotizacionFormDrawerProps {
  isOpen: boolean
  quote: CotizacionItem | null
  formState: CotizacionFormData
  setFormState: React.Dispatch<React.SetStateAction<CotizacionFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

function parseCurrency(str?: string): number {
  if (!str) return 0
  const clean = str.replace(/[^0-9]/g, "")
  return Number(clean) || 0
}

function formatCurrency(num: number): string {
  return `$ ${num.toLocaleString("es-CO")}`
}

export const CotizacionFormDrawer: React.FC<CotizacionFormDrawerProps> = ({
  isOpen,
  quote,
  formState,
  setFormState,
  onClose,
  onSubmit,
}) => {
  const [selectedServiceToAdd, setSelectedServiceToAdd] = useState("")

  // Catálogos maestros existentes
  const empleadosCatalogo = useMemo(() => getEmpleadosCatalogo(), [isOpen])
  const serviciosCatalogo = useMemo(() => getServiciosCatalogo(), [isOpen])

  // Opciones de Clientes (previamente creados)
  const clienteOptions = useMemo<SelectOption[]>(() => {
    return INITIAL_CLIENTS.map((c) => {
      const nombre =
        c.tipo_cliente === "Empresa"
          ? c.razon_social || "Empresa"
          : `${c.primer_nombre || ""} ${c.primer_apellido || ""}`.trim()
      return {
        label: nombre,
        value: nombre,
        badge: c.tipo_cliente,
        sublabel: `${c.tipo_documento}: ${c.numero_documento || ""} · ${
          c.ciudad || "Colombia"
        }`,
      }
    })
  }, [])

  // Opciones de Empleados / Asesores (previamente creados)
  const asesorOptions = useMemo<SelectOption[]>(() => {
    return empleadosCatalogo.map((emp) => ({
      label: emp.nombre,
      value: emp.nombre,
      badge: emp.cargo,
      sublabel: emp.correo || emp.telefono || "Asesor Comercial",
    }))
  }, [empleadosCatalogo])

  // Opciones de Servicios del Catálogo (previamente creados)
  const servicioOptions = useMemo<SelectOption[]>(() => {
    return serviciosCatalogo.map((s) => ({
      label: s.nombre,
      value: s.id,
      badge: s.categoria,
      sublabel: `${s.precioBase} · ${s.descripcion || ""}`,
    }))
  }, [serviciosCatalogo])

  const handleSelectCliente = (clientName: string) => {
    const client = INITIAL_CLIENTS.find((c) => {
      const n =
        c.tipo_cliente === "Empresa"
          ? c.razon_social
          : `${c.primer_nombre || ""} ${c.primer_apellido || ""}`.trim()
      return n === clientName
    })

    setFormState((f) => ({
      ...f,
      cliente: clientName,
      cliente_id: client?.id,
      direccion: f.direccion || client?.direccion || "",
      nombre_evento: f.nombre_evento
        ? f.nombre_evento
        : `Evento - ${clientName}`,
    }))
  }

  const handleSelectAsesor = (asesorName: string) => {
    const emp = empleadosCatalogo.find((e) => e.nombre === asesorName)
    setFormState((f) => ({
      ...f,
      asesor: asesorName,
      empleado_id: emp?.id,
    }))
  }

  const handleAddService = (serviceId: string) => {
    const service = serviciosCatalogo.find((s) => s.id === serviceId)
    if (!service) return

    const currentServicios = formState.servicios ? [...formState.servicios] : []
    const currentMontos = formState.montos ? [...formState.montos] : []

    // Si ya fue agregado, no duplicar exactamente igual
    if (currentServicios.includes(service.nombre)) {
      setSelectedServiceToAdd("")
      return
    }

    const nextServicios = [...currentServicios, service.nombre]
    const nextMontos = [...currentMontos, service.precioBase]

    // Recalcular total automáticamente
    const subtotal = nextMontos.reduce(
      (sum, m) => sum + parseCurrency(m),
      0,
    )

    setFormState((f) => ({
      ...f,
      servicios: nextServicios,
      montos: nextMontos,
      total: formatCurrency(subtotal),
      totalNum: subtotal,
    }))

    setSelectedServiceToAdd("")
  }

  const handleRemoveService = (index: number) => {
    const nextServicios = formState.servicios ? [...formState.servicios] : []
    const nextMontos = formState.montos ? [...formState.montos] : []

    nextServicios.splice(index, 1)
    nextMontos.splice(index, 1)

    const subtotal = nextMontos.reduce(
      (sum, m) => sum + parseCurrency(m),
      0,
    )

    setFormState((f) => ({
      ...f,
      servicios: nextServicios,
      montos: nextMontos,
      total: formatCurrency(subtotal),
      totalNum: subtotal,
    }))
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={quote ? `Editar cotización` : "Crear cotización"}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* ── Bloque 1: Responsables y Estado Comercial ── */}
        <div className="space-y-3 pb-4 border-b border-[#262D3D]">
          

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                Cliente <span className="text-[#EF4444]">*</span>
              </label>
              <CustomSelect
                value={formState.cliente || ""}
                onChange={handleSelectCliente}
                options={clienteOptions}
                searchable={true}
                placeholder="Seleccionar cliente"
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                Empleado <span className="text-[#EF4444]">*</span>
              </label>
              <CustomSelect
                value={formState.asesor || "Tomás Gómez"}
                onChange={handleSelectAsesor}
                options={asesorOptions}
                searchable={true}
                placeholder="Seleccionar empleado"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <FormInput
              label="Nombre del evento"
              value={formState.nombre_evento || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, nombre_evento: e.target.value }))
              }
              required
            />

            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                Estado de la cotización 
              </label>
              <CustomSelect
                value={formState.estado || "Borrador"}
                onChange={(val) =>
                  setFormState((f) => ({
                    ...f,
                    estado: val as EstadoCotizacion,
                  }))
                }
                options={ESTADO_COTIZACION_OPTIONS}
                
              />
            </div>
          </div>
        </div>

        {/* ── Bloque 2: Datos Proyectados del Evento ── */}
        <div className="space-y-3 pb-4 border-b border-[#262D3D]">

          <FormInput
            label="Dirección del venue"
            value={formState.direccion || ""}
            onChange={(e) =>
              setFormState((f) => ({ ...f, direccion: e.target.value }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Fecha tentativa del evento"
              type="date"
              value={formState.fecha_evento || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, fecha_evento: e.target.value }))
              }
            />
            <FormInput
              label="Aforo esperado del evento"
              type="number"
              placeholder="0"
              value={
                formState.aforo_esperado ? String(formState.aforo_esperado) : ""
              }
              onChange={(e) =>
                setFormState((f) => ({
                  ...f,
                  aforo_esperado: Number(e.target.value) || undefined,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Hora inicio estimada"
              type="time"
              value={formState.hora_inicio || "18:00"}
              onChange={(e) =>
                setFormState((f) => ({ ...f, hora_inicio: e.target.value }))
              }
            />
            <FormInput
              label="Hora fin estimada"
              type="time"
              value={formState.hora_fin || "02:00"}
              onChange={(e) =>
                setFormState((f) => ({ ...f, hora_fin: e.target.value }))
              }
            />
          </div>
        </div>

        {/* ── Bloque 3: Servicios Cotizados del Catálogo Maestro ── */}
        <div className="space-y-3 pb-4 border-b border-[#262D3D]">
          <div className="flex items-center justify-between">
            {formState.servicios && formState.servicios.length > 0 && (
              <span className="text-[13px] text-[#A78BFA] font-medium">
                {formState.servicios.length} servicio(s) cotizado(s)
              </span>
            )}
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Servicios contratados <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              value={selectedServiceToAdd}
              options={servicioOptions}
              searchable={true}
              clearOnSelect={true}
              placeholder="+ Seleccionar servicio para añadir a la cotización..."
              onChange={handleAddService}
            />
          </div>

          {/* Lista de servicios seleccionados con precio y botón de eliminar */}
          {formState.servicios && formState.servicios.length > 0 ? (
            <div className="space-y-2 mt-2">
              {formState.servicios.map((srv, idx) => {
                const monto = formState.montos?.[idx] || "$ 0"
                const catInfo = serviciosCatalogo.find((s) => s.nombre === srv)
                return (
                  <div
                    key={`${srv}-${idx}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#111318] border border-[#262D3D] hover:border-[#3B4254] transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-[#F1F5F9]">
                          {srv}
                        </span>
                        {catInfo?.categoria && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#222734] text-[#A78BFA] border border-[#2D3748]">
                            {catInfo.categoria}
                          </span>
                        )}
                      </div>
                      {catInfo?.descripcion && (
                        <p className="text-[13px] text-[#64748B] truncate mt-0.5">
                          {catInfo.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold font-mono text-[#F8FAFC]">
                        {monto}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        aria-label={`Quitar servicio ${srv}`}
                        className="p-1 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors cursor-pointer"
                        title="Quitar de la cotización"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-[13px] text-[#64748B] italic bg-[#111318]/50 border border-[#262D3D] border-dashed rounded-xl p-3 text-center">
              Aún no hay servicios contratados en esta cotización
            </p>
          )}
        </div>

        {/* ── Bloque 4: Vigencia, Total y Observaciones ── */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Fecha de emisión"
              type="date"
              value={formState.fecha || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, fecha: e.target.value }))
              }
              required
            />
            <FormInput
              label="Fecha de vencimiento"
              type="date"
              value={formState.fechaVence || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, fechaVence: e.target.value }))
              }
              required
              hint="Límite legal para confirmación del cliente"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Total cotizado"
              placeholder="$ 0"
              value={formState.total || ""}
              onChange={(e) =>
                setFormState((f) => ({
                  ...f,
                  total: e.target.value,
                  totalNum: parseCurrency(e.target.value),
                }))
              }
              required
            />
            <FormInput
              label="Observaciones"
              value={formState.notas || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, notas: e.target.value }))
              }
            />
          </div>
        </div>

        {/* ── Footer: Botones de Acción Coherentes ── */}
        <div className="pt-4 flex items-center justify-between border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-medium bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer flex items-center gap-1.5"
            >
              <span>{quote ? "Guardar cambios" : "Guardar cotización"}</span>
            </button>
          </div>
        </div>
      </form>
    </Drawer>
  )
}
