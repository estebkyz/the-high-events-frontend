import { useCallback, useLayoutEffect, useState, type RefObject } from "react"

const GAP = 6
const MARGIN = 8

interface AnchoredPosition {
  top: number
  left: number
  minWidth: number
}

/**
 * Coordenadas `fixed` de un menú respecto a su botón: debajo, o encima si no
 * cabe. `null` hasta que se mide.
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  menuRef: RefObject<HTMLElement | null>,
): AnchoredPosition | null {
  const [position, setPosition] = useState<AnchoredPosition | null>(null)

  const update = useCallback(() => {
    if (!anchorRef.current || !menuRef.current) return
    const anchor = anchorRef.current.getBoundingClientRect()
    const { offsetHeight: height, offsetWidth: width } = menuRef.current

    const below = anchor.bottom + GAP
    const above = anchor.top - GAP - height
    const fitsBelow = below + height <= window.innerHeight - MARGIN
    setPosition({
      top: fitsBelow || above <= MARGIN ? below : above,
      left: Math.max(MARGIN, Math.min(anchor.left, window.innerWidth - MARGIN - width)),
      minWidth: anchor.width,
    })
  }, [anchorRef, menuRef])

  useLayoutEffect(() => {
    update()
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [update])

  return position
}
