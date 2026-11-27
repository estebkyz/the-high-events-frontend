import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { Button } from "@/components/Button"
import { Drawer } from "@/components/Drawer"

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

interface PendingConfirm extends ConfirmOptions {
  resolve: (accepted: boolean) => void
}

const ConfirmContext = createContext<ConfirmFn | null>(null)

/** Reemplaza al `confirm()` nativo: `if (await confirm({ ... })) { ... }` */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null)

  const confirm = useCallback<ConfirmFn>(
    (options) => new Promise((resolve) => setPending({ ...options, resolve })),
    [],
  )

  const answer = (accepted: boolean) => {
    pending?.resolve(accepted)
    setPending(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Drawer
        isOpen={pending !== null}
        onClose={() => answer(false)}
        position="center"
        title={pending?.title ?? ""}
      >
        <p className="text-[13px] text-ink-soft leading-relaxed">{pending?.message}</p>
        <div className="flex items-center justify-end gap-2">
          <Button autoFocus onClick={() => answer(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => answer(true)}>
            {pending?.confirmLabel ?? "Confirmar"}
          </Button>
        </div>
      </Drawer>
    </ConfirmContext.Provider>
  )
}

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext)
  if (!confirm) throw new Error("useConfirm debe usarse dentro de <ConfirmProvider>")
  return confirm
}
