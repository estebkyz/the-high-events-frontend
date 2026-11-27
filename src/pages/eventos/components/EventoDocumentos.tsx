import { FileCheck, TriangleAlert } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { DetailEmptyNote, DetailList, DetailSection } from "@/components/detail"
import type { EventoDocumento, EventoItem } from "../types"

interface EventoDocumentosProps {
  evento: EventoItem
  onOpen: (documento: EventoDocumento) => void
}

/** Préstamos y recepciones del evento, con su estado y lo que requiere atención. */
export function EventoDocumentos({ evento, onOpen }: EventoDocumentosProps) {
  const documentos = evento.documentos ?? []

  return (
    <DetailSection
      title="Préstamos y recepciones"
      icon={FileCheck}
      count={documentos.length}
    >
      {(evento.avisos ?? []).map((aviso) => (
        <p key={aviso} className="flex items-start gap-2 text-xs text-warn-ink pb-1">
          <TriangleAlert size={13} className="shrink-0 mt-px" aria-hidden="true" />
          {aviso}
        </p>
      ))}
      {documentos.length === 0 ? (
        <DetailEmptyNote text="Se preparan al asignar equipos al evento." />
      ) : (
        <DetailList>
          {documentos.map((doc) => (
            <button
              key={`${doc.tipo}-${doc.id}`}
              type="button"
              onClick={() => onOpen(doc)}
              className="w-full py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
            >
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-ink group-hover:text-brand-ink">
                  {doc.titulo}
                </span>
                <span className="block text-xs text-ink-muted">
                  <span className="font-medium text-ink-soft">{doc.codigo}</span>
                  {" · "}
                  {doc.equipos} {doc.equipos === 1 ? "equipo" : "equipos"}
                </span>
              </span>
              <StatusBadge status={doc.estado} />
            </button>
          ))}
        </DetailList>
      )}
    </DetailSection>
  )
}
