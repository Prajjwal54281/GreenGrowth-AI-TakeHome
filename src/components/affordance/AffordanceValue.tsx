import { AFFORDANCES, type AffordanceState } from '../../design/affordances'
import { Icon } from '../ui/Icon'
import { Tooltip } from '../ui/Tooltip'

/* ============================================================================
   AffordanceValue: Challenge 08
   The single component that renders "a value in a state". Same treatment
   everywhere: color, dot, icon, and a hover tooltip explaining WHY it's in that
   state and what you can do about it. If the state is `editable` and an onEdit
   is passed, the whole thing becomes a real click-to-edit affordance.
   ========================================================================== */

export function AffordanceValue({
  state,
  children,
  onEdit,
  onActivate,
  size = 'md',
  selected = false,
}: {
  state: AffordanceState
  children: React.ReactNode
  onEdit?: () => void
  onActivate?: () => void
  size?: 'sm' | 'md'
  selected?: boolean
}) {
  const a = AFFORDANCES[state]
  const clickable = (state === 'editable' && onEdit) || onActivate
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'

  const handleClick = () => {
    if (state === 'editable' && onEdit) onEdit()
    else if (onActivate) onActivate()
  }

  return (
    <Tooltip
      width={230}
      content={
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-semibold">
            <span className={`inline-block h-2 w-2 rounded-full ${a.dot}`} />
            {a.label}
          </div>
          <p className="text-ink-200">{a.why}</p>
          <p className="font-medium text-white/90">↳ {a.action}</p>
        </div>
      }
    >
      <span
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={clickable ? handleClick : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleClick()
                }
              }
            : undefined
        }
        className={[
          'inline-flex items-center gap-1.5 rounded-md border font-medium tabular-nums transition',
          pad,
          a.bg,
          a.border,
          a.text,
          clickable ? 'cursor-pointer hover:brightness-95' : 'cursor-default',
          state === 'editable' ? 'border-dashed' : '',
          selected ? 'ring-2 ring-brand-400 ring-offset-1' : '',
        ].join(' ')}
      >
        <Icon path={a.icon} size={size === 'sm' ? 12 : 13} />
        <span>{children}</span>
      </span>
    </Tooltip>
  )
}

/** compact state chip without a value, e.g. in legends / tables */
export function AffordanceBadge({ state }: { state: AffordanceState }) {
  const a = AFFORDANCES[state]
  return (
    <Tooltip width={230} content={<p>{a.why}</p>}>
      <span
        className={`inline-flex items-center gap-1 rounded border ${a.bg} ${a.border} ${a.text} px-1.5 py-0.5 text-2xs font-semibold`}
      >
        <Icon path={a.icon} size={11} />
        {a.label}
      </span>
    </Tooltip>
  )
}
