import { useApp, usePersona } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import { HERO_RETURN_ID } from '../data/hero'
import { requestsFor } from '../data/selectors'
import { OWNER_LABEL } from '../data/stages'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card, Button } from '../components/ui/primitives'
import { Icon, ICONS } from '../components/ui/Icon'
import { relativeToNow } from '../lib/format'
import { NOW, daysBetween } from '../data/rng'
import { Link } from 'react-router-dom'

export function TasksPage() {
  const { world, dispatch } = useApp()
  const persona = usePersona()
  useTrackTrail('Tasks', 'tasks')
  const isClient = persona.primaryRole === 'client'

  const requests = requestsFor(world, HERO_RETURN_ID)
  const open = requests.filter((r) => r.status === 'open')
  const done = requests.filter((r) => r.status === 'done')

  return (
    <PageContainer>
      <PageHeader
        title={isClient ? 'Things we need from you' : 'Outstanding requests'}
        subtitle="Every request tracks who owns it and how long it has been waiting."
        challenges={['02']}
      />

      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="border-b border-ink-100 bg-ink-50/60 px-4 py-2 text-sm font-semibold text-ink-800">
            Open ({open.length})
          </div>
          {open.map((r) => {
            const overdue = daysBetween(NOW, r.dueDate) < 0
            return (
              <div key={r.id} className="flex items-start gap-3 border-b border-ink-50 px-4 py-3 last:border-0">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${overdue ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  <Icon path={overdue ? ICONS.warning : ICONS.clock} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink-800">{r.title}</span>
                    {overdue && <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">OVERDUE</span>}
                  </div>
                  <p className="text-2xs text-ink-500">{r.detail}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-2xs text-ink-400">
                    <span>{OWNER_LABEL[r.owner]} owns this</span>
                    <span>·</span>
                    <span className={overdue ? 'font-semibold text-red-500' : ''}>Due {relativeToNow(r.dueDate)}</span>
                    <span>·</span>
                    <span>Waiting {r.daysWaiting}d</span>
                    {r.relatedThreadId && (
                      <>
                        <span>·</span>
                        <Link to={`/returns/${HERO_RETURN_ID}/threads/${r.relatedThreadId}`} className="font-medium text-brand-600 hover:underline">
                          View thread
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => dispatch({ type: 'RESOLVE_REQUEST', requestId: r.id })}>
                  {isClient ? 'Mark uploaded' : 'Mark done'}
                </Button>
              </div>
            )
          })}
          {open.length === 0 && <div className="px-4 py-6 text-center text-sm text-ink-400">All caught up.</div>}
        </Card>

        {done.length > 0 && (
          <Card className="overflow-hidden">
            <div className="border-b border-ink-100 bg-ink-50/60 px-4 py-2 text-sm font-semibold text-ink-800">Done ({done.length})</div>
            {done.map((r) => (
              <div key={r.id} className="flex items-center gap-3 border-b border-ink-50 px-4 py-2.5 last:border-0 opacity-70">
                <Icon path={ICONS.check} size={16} className="text-green-600" />
                <span className="text-sm text-ink-600 line-through">{r.title}</span>
              </div>
            ))}
          </Card>
        )}
      </div>
    </PageContainer>
  )
}
