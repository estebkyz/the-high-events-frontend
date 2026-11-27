import { EMPRESA } from "@/constants/empresa"

/** Logotipo; en pantallas angostas solo se ve el monograma. */
export function BrandMark() {
  return (
    <p className="flex items-center gap-2 text-[14px] font-semibold text-topbar-ink whitespace-nowrap">
      <span
        aria-hidden="true"
        className="size-7 rounded-lg bg-brand text-white text-[11px] font-bold inline-flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]"
      >
        {EMPRESA.siglas}
      </span>
      <span className="max-md:sr-only">{EMPRESA.nombre}</span>
    </p>
  )
}
