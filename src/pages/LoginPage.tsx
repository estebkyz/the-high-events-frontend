import React, { useState } from "react"
import { Eye, EyeOff, Check } from "lucide-react"

interface Props {
  onLoginSuccess?: () => void
}

export default function LoginPage({ onLoginSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("admin@thehighevents.com")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onLoginSuccess) {
      onLoginSuccess()
    } else {
      alert("Sesión iniciada correctamente")
    }
  }

  const features = [
    "Gestión completa de eventos y producción",
    "Control financiero y abonos en tiempo real",
    "Inventario y logística centralizada",
    "Trazabilidad operativa con RBAC y auditoría",
  ]

  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left identity panel ── */}
      <div className="hidden md:flex md:w-1/2 bg-[#111318] flex-col relative overflow-hidden">
        <div
          className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(124,58,237,0.10) 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#A78BFA 1px, transparent 1px), linear-gradient(90deg, #A78BFA 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col flex-1 px-14 py-16">
          {/* Logo mark */}
          <div className="flex items-center gap-4 mb-16">
            <div
              className="w-16 h-16 rounded-2xl bg-[#7C3AED] flex items-center justify-center font-black text-white select-none"
              style={{
                fontSize: "28px",
                boxShadow: "0 0 40px rgba(124,58,237,0.45), 0 0 80px rgba(124,58,237,0.15)",
              }}
            >
              TH
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7C3AED]">
                Platform
              </p>
              <p className="text-[13px] font-medium text-[#94A3B8]">v2.4.1</p>
            </div>
          </div>

          {/* Main headline */}
          <div className="space-y-4 mb-14">
            <h1
              className="font-black text-[#F1F5F9] leading-none tracking-tight"
              style={{ fontSize: "clamp(52px, 5vw, 80px)" }}
            >
              The High
              <br />
              <span style={{ color: "#7C3AED", textShadow: "0 0 40px rgba(124,58,237,0.6)" }}>
                Events
              </span>
            </h1>
            <p className="text-[15px] text-[#64748B] leading-relaxed max-w-xs">
              Sistema de Gestión de Eventos &amp; Producción
            </p>
          </div>
        </div>
      </div>

      {/* ── Right login panel (Limpio y centrado) ── */}
      <div className="flex-1 md:w-1/2 bg-[#1A1D23] flex flex-col items-center justify-center px-6 py-12">
        <div className="md:hidden flex flex-col items-center gap-2 mb-10">
          <div
            className="w-12 h-12 rounded-xl bg-[#7C3AED] flex items-center justify-center font-black text-white text-lg"
            style={{ boxShadow: "0 0 24px rgba(124,58,237,0.4)" }}
          >
            TH
          </div>
          <p className="text-[12px] text-[#64748B]">The High Events</p>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-1">
            <h2 className="text-[26px] font-bold text-[#F1F5F9] tracking-tight">
              Panel de Administración
            </h2>
            <p className="text-[13px] text-[#64748B]">
              Ingresa tus datos para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#F1F5F9] block">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@thehighevents.com"
                required
                className="w-full h-[44px] px-4 bg-[#242830] border border-[#2D3748] rounded-xl text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/40 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#F1F5F9] block">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-[44px] pl-4 pr-11 bg-[#242830] border border-[#2D3748] rounded-xl text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[#94A3B8] text-[12px]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-[#2D3748] bg-[#242830] text-[#7C3AED] focus:ring-0 cursor-pointer"
                />
                Recordarme
              </label>
              <button
                type="button"
                onClick={() => alert("Instrucciones de recuperación enviadas a tu correo")}
                className="text-[12px] text-[#A78BFA] hover:text-[#7C3AED] hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-[46px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-xl text-[13px] tracking-wide transition-all shadow-lg hover:shadow-violet-900/40"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}