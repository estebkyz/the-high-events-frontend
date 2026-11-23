export interface PrintableDocumentPayload {
  tipoDocumento: "Cotización Comercial" | "Factura de Venta" | "Comprobante de Abono / Pago"
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

/**
 * Abre una ventana de impresión/descarga PDF limpia y con formato corporativo
 * para Cotizaciones, Facturas de Venta y Recibos de Abonos.
 */
export function printDocumentPdf(doc: PrintableDocumentPayload): void {
  const win = window.open("", "_blank", "width=860,height=720")
  if (!win) {
    window.print()
    return
  }

  const rowsHtml =
    doc.items && doc.items.length > 0
      ? doc.items
          .map(
            (it) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${it.descripcion}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;">${it.valor}</td>
          </tr>`,
          )
          .join("")
      : `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${doc.evento || doc.tipoDocumento}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-family:monospace;">${doc.total}</td>
        </tr>`

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${doc.tipoDocumento} - ${doc.codigo}</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; color: #0f172a; margin: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #7c3aed; padding-bottom: 18px; margin-bottom: 24px; }
    .brand { font-size: 22px; font-weight: 800; color: #7c3aed; }
    .doc-title { font-size: 18px; font-weight: 700; margin: 0; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 24px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; }
    th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-weight: 700; border-bottom: 2px solid #cbd5e1; }
    .total-box { text-align: right; font-size: 16px; font-weight: 800; margin-top: 12px; }
    .notes { margin-top: 24px; font-size: 12px; color: #475569; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">THE HIGH EVENTS</div>
      <div style="font-size:12px;color:#64748b;margin-top:4px;">Producción Técnica & Logística de Eventos</div>
    </div>
    <div style="text-align:right;">
      <p class="doc-title">${doc.tipoDocumento}</p>
      <div style="font-family:monospace;font-size:14px;color:#7c3aed;font-weight:700;margin-top:4px;">${doc.codigo}</div>
    </div>
  </div>

  <div class="meta">
    <div><strong>${doc.terceroLabel}:</strong> ${doc.terceroNombre}</div>
    <div><strong>Fecha:</strong> ${doc.fecha}</div>
    ${doc.evento ? `<div><strong>Evento:</strong> ${doc.evento}</div>` : ""}
    <div><strong>Estado:</strong> ${doc.estado}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Concepto / Servicio</th>
        <th style="text-align:right;">Valor</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="total-box">Total: ${doc.total}</div>

  ${doc.notas ? `<div class="notes"><strong>Observaciones:</strong> ${doc.notas}</div>` : ""}

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`

  win.document.open()
  win.document.write(html)
  win.document.close()
}
