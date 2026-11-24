import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
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
        <p className="text-[13px] text-[#CBD5E1] leading-relaxed">{pending?.message}</p>
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2D3748]">
          <button
            type="button"
            autoFocus
            onClick={() => answer(false)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#F1F5F9] border border-[#2D3748] hover:bg-[#242830] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => answer(true)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer"
          >
            {pending?.confirmLabel ?? "Confirmar"}
          </button>
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
