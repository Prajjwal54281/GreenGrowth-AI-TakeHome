import { Link } from 'react-router-dom'
import { useApp } from '../state/AppState'
import {
  docsFor,
  threadsFor,
  requestsFor,
  fieldsFor,
  warningsFor,
} from '../data/selectors'
import { Icon, ICONS } from './ui/Icon'
import { Card } from './ui/primitives'
import { ChallengeTag } from './ChallengeTag'

/* ============================================================================
   RELATED OBJECTS: Challenge 04
   A panel present on every entity that shows what THIS thing connects to, so a
   user can move between a field, its document, its thread, a task, and the
   questionnaire without ever leaving the return's context. Every link is a real
   deep route.
   ========================================================================== */

interface RelatedLink {
  to: string
  label: string
  icon: string
  meta?: string
}

export function RelatedObjects({
  returnId,
  focus,
}: {
  returnId: string
  focus?: { kind: 'field' | 'document'; id: string }
}) {
  const { world } = useApp()
  const docs = docsFor(world, returnId)
  const threads = threadsFor(world, returnId)
  const requests = requestsFor(world, returnId).filter((r) => r.status === 'open')
  const fields = fieldsFor(world, returnId)
  const warnings = warningsFor(world, returnId)

  const groups: { heading: string; links: RelatedLink[] }[] = []

  // Focus-specific connections first
  if (focus?.kind === 'field') {
    const field = fields.find((f) => f.id === focus.id)
    if (field) {
      const srcDocs = docs.filter((d) =>
        d.regions.some((r) => field.sourceRegionIds.includes(r.id)),
      )
      const relThreads = threads.filter((t) => t.ref.kind === 'field' && t.ref.id === field.id)
      groups.push({
        heading: 'Connected to this field',
        links: [
          ...srcDocs.map((d) => ({
            to: `/returns/${returnId}/review/${field.id}`,
            label: d.title,
            icon: ICONS.items,
            meta: 'source document',
          })),
          ...relThreads.map((t) => ({
            to: `/returns/${returnId}/threads/${t.id}`,
            label: t.subject,
            icon: ICONS.messages,
            meta: t.status,
          })),
        ],
      })
    }
  }

  groups.push({
    heading: 'This return',
    links: [
      { to: `/returns/${returnId}/review`, label: 'Return review', icon: ICONS.review, meta: `${fields.length} fields` },
      { to: `/returns/${returnId}/items`, label: 'All items', icon: ICONS.items, meta: `docs · questions · warnings` },
      { to: `/returns/${returnId}/status`, label: 'Status & progress', icon: ICONS.status },
    ],
  })

  if (threads.length) {
    groups.push({
      heading: `Threads (${threads.length})`,
      links: threads.map((t) => ({
        to: `/returns/${returnId}/threads/${t.id}`,
        label: t.subject,
        icon: ICONS.messages,
        meta: t.nextOwner === 'client' ? 'client owes reply' : `${t.nextOwner} to act`,
      })),
    })
  }

  if (requests.length) {
    groups.push({
      heading: `Open requests (${requests.length})`,
      links: requests.map((r) => ({
        to: `/tasks`,
        label: r.title,
        icon: ICONS.tasks,
        meta: `waiting ${r.daysWaiting}d`,
      })),
    })
  }

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon path={ICONS.link} size={16} className="text-ink-400" />
          <h3 className="text-sm font-semibold text-ink-800">Related objects</h3>
        </div>
        <ChallengeTag ids={['04']} />
      </div>
      <div className="max-h-[70vh] space-y-3 overflow-y-auto p-3">
        {groups.map((g, i) => (
          <div key={i}>
            <div className="mb-1 px-1 text-2xs font-semibold uppercase tracking-wide text-ink-400">
              {g.heading}
            </div>
            <div className="space-y-0.5">
              {g.links.map((l, j) => (
                <Link
                  key={j}
                  to={l.to}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-50"
                >
                  <Icon path={l.icon} size={15} className="shrink-0 text-ink-400" />
                  <span className="min-w-0 flex-1 truncate text-sm text-ink-700">{l.label}</span>
                  {l.meta && <span className="shrink-0 text-2xs text-ink-400">{l.meta}</span>}
                  <Icon path={ICONS.chevronRight} size={13} className="text-ink-300 group-hover:text-ink-500" />
                </Link>
              ))}
            </div>
          </div>
        ))}
        {warnings.length > 0 && (
          <div className="rounded-lg bg-amber-50 px-2.5 py-2 text-2xs text-amber-700">
            <Icon path={ICONS.warning} size={12} className="mr-1 inline" />
            {warnings.length} warnings on this return. See All items.
          </div>
        )}
      </div>
    </Card>
  )
}
