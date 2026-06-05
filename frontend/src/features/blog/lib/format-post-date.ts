import { format } from "date-fns"

export function parsePostDate(value: string | undefined): Date | null {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatPostDate(value: string | undefined) {
  const date = parsePostDate(value)
  if (!date) return null

  return {
    iso: date.toISOString(),
    display: format(date, "dd.MM.yyyy"),
  }
}

export function getPostTimestamp(value: string | undefined) {
  return parsePostDate(value)?.getTime() ?? 0
}
