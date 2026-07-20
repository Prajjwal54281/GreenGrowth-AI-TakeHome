import type { TaxReturn } from '../data/types'
import { STAGES, stageOrder, OWNER_LABEL, CLIENT_NEXT } from '../data/stages'
import { Icon, ICONS } from './ui/Icon'
import { relativeToNow } from '../lib/format'

/* ============================================================================
   STATUS TIMELINE: Challenge 06
   ONE stage model, rendered for two audiences. Client sees plain-language
   labels and only what matters to them; staff sees operational labels plus
   owner, next action, and blockers. Both are driven by the SAME data, so they
   can never tell two different stories.
   ========================================================================== */

export function StatusTimeline({
  ret,
  audience,
}: {
  ret: TaxReturn
  audience: 'client' | 'staff'
}) {
  const current = stageOrder(ret.stage)

  return (
    <div className="space-y-1">
      {STAGES.map((s) => {
        const idx = s.order
        const done = idx < current
        const active = idx === current
        const label = audience === 'client' ? s.clientLabel : s.staffLabel
        return (
          <div key={s.stage} className="flex gap-3">
            {/* rail */}
            <div className="flex flex-col items-center">
              <div
                className={[
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-white',
                  done ? 'border-brand-600 bg-brand-600' : active ? 'border-brand-600 bg-white' : 'border-ink-200 bg-white',
                ].join(' ')}
              >
                {done ? (
                  <Icon path={ICONS.check} size={14} />
                ) : (
                  <span className={`text-2xs font-bold ${active ? 'text-brand-600' : 'text-ink-300'}`}>{idx + 1}</span>
                )}
              </div>
              {idx < STAGES.length - 1 && (
                <div className={`w-0.5 flex-1 ${done ? 'bg-brand-500' : 'bg-ink-200'}`} style={{ minHeight: 28 }} />
              )}
            </div>
            {/* content */}
            <div className={`pb-4 ${active ? '' : 'opacity-80'}`}>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${active ? 'text-ink-900' : done ? 'text-ink-600' : 'text-ink-400'}`}>
                  {label}
                </span>
                {active && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-2xs font-bold text-brand-700">
                    You are here
                  </span>
                )}
              </div>

              {active && (
                <div className="mt-1.5 space-y-1.5">
                  {audience === 'client' ? (
                    <p className="text-sm text-ink-600">{CLIENT_NEXT[ret.stage]}</p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 font-medium text-ink-600">
                        Owner: {OWNER_LABEL[ret.nextActionOwner]}
                      </span>
                      <span className="rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 font-medium text-ink-600">
                        Next: {ret.nextAction}
                      </span>
                      <span className="rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 font-medium text-ink-600">
                        Due {relativeToNow(ret.dueDate)}
                      </span>
                    </div>
                  )}

                  {ret.flags.blocked && ret.blockingReason && (
                    <div className="flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
                      <Icon path={ICONS.warning} size={13} className="mt-0.5 shrink-0" />
                      <span>
                        <span className="font-semibold">Blocked:</span>{' '}
                        {audience === 'client'
                          ? 'We’re waiting on one item from you. See your open requests.'
                          : ret.blockingReason}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
