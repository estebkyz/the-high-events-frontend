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
  type Session,
  type UserProfile,
} from "@/services/session"

interface AuthContextValue {
  isAuthenticated: boolean
  user: UserProfile | null
  login: (email: string, password: string, remember: boolean) => Promise<void>
  logout: () => void
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

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout)
  }, [logout])

  const value = useMemo(
    () => ({
      isAuthenticated: session !== null,
      user: session?.user ?? null,
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return ctx
}
