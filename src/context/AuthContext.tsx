import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export interface UserProfile {
  name: string
  email: string
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: UserProfile
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEFAULT_USER: UserProfile = {
  name: "Esteban D",
  email: "juanestebancasta2007@gmail.com",
}

/**
 * Autenticación simulada (mockup). Cuando exista backend, reemplazar el
 * contenido de `login`/`logout` por las llamadas reales sin tocar a los consumidores.
 */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [user] = useState<UserProfile>(DEFAULT_USER)

  const login = useCallback(() => setIsAuthenticated(true), [])
  const logout = useCallback(() => setIsAuthenticated(false), [])

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout }),
    [isAuthenticated, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return ctx
}
