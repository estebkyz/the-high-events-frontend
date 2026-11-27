import { EMPRESA } from "@/constants/empresa"

export interface PrintableDocument {
  tipoDocumento: string
  codigo: string
  fecha: string
  terceroLabel: string
  terceroNombre: string
  evento?: string
  estado: string
  total: string
  items?: { descripcion: string; valor: string }[]
  notas?: string
}

const STYLES = `
  body { font-family: Inter, system-ui, sans-serif; color: #0f172a; margin: 40px; }
  header { display: flex; justify-content: space-between; border-bottom: 2px solid #7c3aed; padding-bottom: 18px; margin-bottom: 24px; }
  .brand { font-size: 22px; font-weight: 800; color: #7c3aed; }
  .muted { font-size: 12px; color: #64748b; margin-top: 4px; }
  .doc { text-align: right; }
  .doc h1 { font-size: 18px; margin: 0; }
  .code { font-family: monospace; font-size: 14px; font-weight: 700; color: #7c3aed; margin-top: 4px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 24px; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; }
  th { background: #f1f5f9; text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; }
  td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
  .right { text-align: right; }
  .total { text-align: right; font-size: 16px; font-weight: 800; }
  .notes { margin-top: 24px; font-size: 12px; color: #475569; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
`

/** Los datos los escribe el usuario: sin escapar permitirían inyectar HTML. */
function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function buildHtml(doc: PrintableDocument): string {
  const e = (value: string | undefined) => escapeHtml(String(value ?? ""))
  const items = doc.items?.length
    ? doc.items
    : [{ descripcion: doc.evento || doc.tipoDocumento, valor: doc.total }]
  const rows = items
    .map(
      (it) =>
        `<tr><td>${e(it.descripcion)}</td><td class="right">${e(it.valor)}</td></tr>`,
    )
    .join("")

  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8" /><title>${e(doc.tipoDocumento)} - ${e(doc.codigo)}</title><style>${STYLES}</style></head>
<body>
  <header>
    <div><div class="brand">${e(EMPRESA.nombre.toUpperCase())}</div><div class="muted">${e(EMPRESA.lema)}</div></div>
    <div class="doc"><h1>${e(doc.tipoDocumento)}</h1><div class="code">${e(doc.codigo)}</div></div>
  </header>
  <div class="meta">
    <div><strong>${e(doc.terceroLabel)}:</strong> ${e(doc.terceroNombre)}</div>
    <div><strong>Fecha:</strong> ${e(doc.fecha)}</div>
    ${doc.evento ? `<div><strong>Evento:</strong> ${e(doc.evento)}</div>` : ""}
    <div><strong>Estado:</strong> ${e(doc.estado)}</div>
  </div>
  <table>
    <thead><tr><th>Concepto / Servicio</th><th class="right">Valor</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="total">Total: ${e(doc.total)}</div>
  ${doc.notas ? `<div class="notes"><strong>Observaciones:</strong> ${e(doc.notas)}</div>` : ""}
</body>
</html>`
}

/** Imprime (o guarda como PDF) un documento en un iframe aislado. */
export function printDocumentPdf(doc: PrintableDocument): void {
  const frame = document.createElement("iframe")
  frame.hidden = true
  frame.srcdoc = buildHtml(doc)
  frame.onload = () => {
    const target = frame.contentWindow
    if (!target) return
    target.onafterprint = () => frame.remove()
    target.print()
  }
  document.body.append(frame)
}
