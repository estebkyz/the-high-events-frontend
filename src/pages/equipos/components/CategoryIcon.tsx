import React from "react"
import { Music2, Boxes, Monitor, Package } from "lucide-react"
import type { Categoria } from "../types"

export function getCategoryIcon(categoria: Categoria, size = 20) {
  switch (categoria) {
    case "Audio":
      return <Music2 size={size} className="text-[#A78BFA]" />
    case "Iluminación":
      return <Boxes size={size} className="text-[#F59E0B]" />
    case "Video":
      return <Monitor size={size} className="text-[#3B82F6]" />
    case "Estructuras":
      return <Package size={size} className="text-[#10B981]" />
  }
}
