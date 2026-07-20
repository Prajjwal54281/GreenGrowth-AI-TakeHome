import { useParams, Link } from 'react-router-dom'
import { useApp } from '../state/AppState'
import { HERO_RETURN_ID } from '../data/hero'
import { useTrackTrail } from '../hooks/useTrackTrail'
import {
  getReturn, getClient, clientName, fieldsFor, docsFor,
  questionnaireFor, warningsFor, threadsFor,
} from '../data/selectors'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/primitives'
import { StageBadge, OwnerPill } from '../components/StageBadge'
import { RelatedObjects } from '../components/RelatedObjects'
import { Icon, ICONS } from '../components/ui/Icon'
import { money, relativeToNow } from '../lib/format'

export function ReturnOverviewPage() {
  const { returnId = '' } = useParams()
  const { world } = useApp()
  const ret = getReturn(world, returnId)
  useTrackTrail(ret ? `${clientName(world, ret.clientId)} · ${ret.id}` : '', 'return')

  if (!ret) return <PageContainer><p className="text-sm text-ink-500">Return not found.</p></PageContainer>
  const client = getClient(world, ret.clientId)

  const counts = {
    fields: fieldsFor(world, returnId).length,
    docs: docsFor(world, returnId).length,
    questions: questionnaireFor(world, returnId).length,
    warnings: warningsFor(world, returnId).length,
    threads: threadsFor(world, returnId).length,
  }

  const quick = [
    { to: `/returns/${returnId}/review`, icon: ICONS.review, title: 'Review return', desc: 'Trace every field to its source', tag: '01·08·10' },
    { to: `/returns/${returnId}/items`, icon: ICONS.items, title: 'All items', desc: `${counts.docs} docs · ${counts.questions} questions · ${counts.warnings} warnings`, tag: '09' },
    { to: `/returns/${returnId}/status`, icon: ICONS.status, title: 'Status & progress', desc: 'Where it is and who owns next', tag: '06' },
  ]

  return (
    <PageContainer>
      <PageHeader
        title={clientName(world, ret.clientId)}
        subtitle={`${ret.formType} · TY${ret.taxYear} · ${ret.id}`}
        challenges={['04']}
        right={<StageBadge stage={ret.stage} />}
      />

      {counts.fields === 0 && (
        <div className="mb-4 flex items-start gap-2 rounded-card border border-ink-200 bg-white px-4 py-3 text-xs text-ink-500">
          <Icon path={ICONS.warning} size={14} className="mt-0.5 shrink-0 text-ink-400" />
          <span>
            This is one of 121 returns generated to exercise the dashboard’s prioritization at
            realistic volume, so it has no seeded field-level detail.{' '}
            <Link to={`/returns/${HERO_RETURN_ID}/review`} className="font-semibold text-brand-700 hover:underline">
              Open Sarah Chen’s return
            </Link>{' '}
            to see traceability, AI output, and the correction flow.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {/* snapshot */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <div className="text-2xs uppercase text-ink-400">Client</div>
                <div className="flex items-center gap-1 text-sm font-semibold text-ink-800">
                  <Icon path={client?.entityType === 'business' ? ICONS.building : ICONS.person} size={14} className="text-ink-400" />
                  {client?.entityType}
                </div>
              </div>
              <div>
                <div className="text-2xs uppercase text-ink-400">Due</div>
                <div className="text-sm font-semibold text-ink-800">{relativeToNow(ret.dueDate)}</div>
              </div>
              <div>
                <div className="text-2xs uppercase text-ink-400">Est. refund</div>
                <div className="text-sm font-semibold text-ink-800">{money(ret.estimatedRefund)}</div>
              </div>
              <div>
                <div className="text-2xs uppercase text-ink-400">Next action</div>
                <OwnerPill owner={ret.nextActionOwner} />
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-2xs text-ink-500">
                <span>Progress</span><span>{Math.round(ret.progress * 100)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${ret.progress * 100}%` }} />
              </div>
            </div>
            {ret.flags.blocked && ret.blockingReason && (
              <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
                <Icon path={ICONS.warning} size={13} className="mt-0.5 shrink-0" />
                <span><span className="font-semibold">Blocked:</span> {ret.blockingReason}</span>
              </div>
            )}
          </Card>

          {/* quick actions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {quick.map((q) => (
              <Link key={q.to} to={q.to} className="group rounded-card border border-ink-200 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-pop">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon path={q.icon} size={18} />
                  </span>
                  <span className="rounded bg-ink-100 px-1 text-[9px] font-bold text-ink-400">{q.tag}</span>
                </div>
                <div className="mt-2.5 text-sm font-semibold text-ink-800">{q.title}</div>
                <div className="text-2xs text-ink-500">{q.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <RelatedObjects returnId={returnId} />
      </div>
    </PageContainer>
  )
}
