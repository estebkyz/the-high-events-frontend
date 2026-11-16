export function formatDateTimeRange(
  inicio: string,
  fin: string,
): { dateStr: string; timeStr: string } {
  if (!inicio) return { dateStr: "Sin fecha", timeStr: "" }
  const [datePart, timePart] = inicio.split("T")
  const [, endTimePart] = (fin || "").split("T")
  return {
    dateStr: datePart,
    timeStr: `${timePart || "00:00"} – ${endTimePart || "00:00"}`,
  }
}

export function parseEventDate(inicio: string): { day: string; month: string } {
  if (!inicio) return { day: "--", month: "---" }
  try {
    const [datePart] = inicio.split("T")
    const parts = (datePart || "").split("-")
    const monthIndex = parseInt(parts[1], 10) - 1
    const day = parts[2] || "--"
    const months = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ]
    return {
      day,
      month: months[monthIndex] || "---",
    }
  } catch {
    return { day: "--", month: "---" }
  }
}

export function formatCOP(value: number): string {
  return `$ ${Number(value || 0).toLocaleString("es-CO")}`
}
