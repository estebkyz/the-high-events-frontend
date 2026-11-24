import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
import { AuthProvider } from "./context/AuthContext"
import { ConfirmProvider } from "./components/ConfirmDialog"
import { ToastProvider } from "./components/Toast"

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
