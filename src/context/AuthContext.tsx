import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { apiClient, SESSION_EXPIRED_EVENT } from "@/services/apiClient"
import {
  clearSession,
  loadSession,
  saveSession,
  updateSession,
  updateSessionUser,
  type Session,
  type UserProfile,
} from "@/services/session"

interface AuthContextValue {
  isAuthenticated: boolean
  user: UserProfile | null
  /** Tiene al menos uno de esos privilegios. */
  can: (codes: readonly string[]) => boolean
  login: (email: string, password: string, remember: boolean) => Promise<void>
  logout: () => void
  /** Tras editar el perfil: datos nuevos y, si cambió la contraseña, el token nuevo. */
  refreshSession: (user: UserProfile, token?: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession)

  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      const next = await apiClient.post<Session>("/auth/login", { email, password })
      saveSession(next, remember)
      setSession(next)
    },
    [],
  )

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const refreshSession = useCallback((user: UserProfile, token?: string) => {
    updateSession(token ? { user, token } : { user })
    setSession((current) => current && { ...current, user, ...(token && { token }) })
  }, [])

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout)
  }, [logout])

  // Los permisos pueden haber cambiado desde el último ingreso.
  const token = session?.token
  useEffect(() => {
    if (!token) return
    let cancelled = false
    apiClient
      .get<UserProfile>("/sesion")
      .then((user) => {
        if (cancelled) return
        updateSessionUser(user)
        setSession((current) => current && { ...current, user })
      })
      // Sin conexión se conserva lo guardado; si la sesión venció, la API la cierra.
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [token])

  const permissions = session?.user.permissions
  const can = useCallback(
    (codes: readonly string[]) =>
      codes.some((code) => permissions?.includes(code) ?? false),
    [permissions],
  )

  const value = useMemo(
    () => ({
      isAuthenticated: session !== null,
      user: session?.user ?? null,
      can,
      login,
      logout,
      refreshSession,
    }),
    [session, can, login, logout, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return ctx
}
