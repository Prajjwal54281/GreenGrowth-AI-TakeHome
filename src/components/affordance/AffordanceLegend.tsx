import { AFFORDANCES, AFFORDANCE_ORDER } from '../../design/affordances'
import { Icon } from '../ui/Icon'

/* The legend / key component (required by Challenge 08). Two layouts: a compact
   inline row for headers, and a full stacked key with explanations. */

export function AffordanceLegend({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {AFFORDANCE_ORDER.map((s) => {
          const a = AFFORDANCES[s]
          return (
            <span key={s} className="inline-flex items-center gap-1 text-2xs font-medium text-ink-600">
              <span className={`inline-block h-2 w-2 rounded-full ${a.dot}`} />
              {a.label}
            </span>
          )
        })}
      </div>
    )
  }
  return (
    <div className="space-y-2.5">
      {AFFORDANCE_ORDER.map((s) => {
        const a = AFFORDANCES[s]
        return (
          <div key={s} className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${a.bg} ${a.border} ${a.text}`}
            >
              <Icon path={a.icon} size={13} />
            </span>
            <div>
              <div className={`text-sm font-semibold ${a.text}`}>{a.label}</div>
              <p className="text-xs leading-snug text-ink-500">{a.why}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
