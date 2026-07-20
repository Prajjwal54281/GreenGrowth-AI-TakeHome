import { Link } from 'react-router-dom'
import { HERO_RETURN_ID } from '../data/hero'
import { Card, Button } from './ui/primitives'
import { Icon, ICONS } from './ui/Icon'

/* ============================================================================
   Honest empty state.
   Only ONE return (Sarah Chen, RET-1001) is seeded with full field-level detail:
   documents, traceability regions, AI output, threads, and questionnaire items.
   The other 121 returns exist so the dashboard's prioritization logic is tested
   against realistic volume, so they intentionally have no field-level detail.
   Rather than showing a blank screen, we say so and point at the real one.
   ========================================================================== */

export function NoSeededDetail({
  what,
  returnLabel,
}: {
  /** e.g. "field-level detail" or "items" */
  what: string
  returnLabel?: string
}) {
  return (
    <Card className="p-8">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-100 text-ink-400">
          <Icon path={ICONS.items} size={22} />
        </span>
        <h2 className="text-sm font-semibold text-ink-800">
          This return has no seeded {what}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
          {returnLabel ? <><span className="font-medium text-ink-600">{returnLabel}</span> is </> : 'This is '}
          one of 121 returns generated so the dashboard’s prioritization logic gets
          tested against realistic volume. To keep the prototype honest I seeded{' '}
          <span className="font-medium text-ink-600">one</span> return with full
          field-level detail: documents, traceability regions, AI output, and threads.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Link to={`/returns/${HERO_RETURN_ID}/review`}>
            <Button>
              <Icon path={ICONS.review} size={15} />
              Open the fully-seeded return
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
