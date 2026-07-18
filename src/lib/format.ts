import { NOW, daysBetween } from '../data/rng'

/** "82,450.00" -> "$82,450" ; keeps cents only when non-zero */
export function money(raw: string | number): string {
  const n = typeof raw === 'number' ? raw : Number(raw.replace(/[^0-9.-]/g, ''))
  if (Number.isNaN(n)) return String(raw)
  const abs = Math.abs(n)
  const s = abs.toLocaleString('en-US', {
    minimumFractionDigits: abs % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  return `${n < 0 ? '-' : ''}$${s}`
}

export function shortDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : ''))
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export function longDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : ''))
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

/** "in 3 days", "4 days ago", "today" relative to the frozen NOW */
export function relativeToNow(iso: string): string {
  const d = daysBetween(NOW, iso)
  if (d === 0) return 'today'
  if (d > 0) return `in ${d} day${d === 1 ? '' : 's'}`
  return `${-d} day${d === -1 ? '' : 's'} ago`
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
