import { Link } from 'react-router-dom'
import { useApp, usePersona } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import { clientName } from '../data/selectors'
import { OWNER_LABEL } from '../data/stages'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/primitives'
import { Icon, ICONS } from '../components/ui/Icon'

export function MessagesPage() {
  const { world } = useApp()
  const persona = usePersona()
  useTrackTrail('Messages', 'messages')
  const isClient = persona.primaryRole === 'client'

  const threads = world.threads

  return (
    <PageContainer>
      <PageHeader
        title="Messages"
        subtitle="Every conversation is attached to a document or issue — never a generic inbox."
        challenges={['02']}
      />
      <Card className="overflow-hidden">
        {threads.map((t) => {
          const lastVisible = [...t.messages].reverse().find((m) => !(isClient && m.visibility === 'internal'))
          const hasInternal = t.messages.some((m) => m.visibility === 'internal')
          return (
            <Link
              key={t.id}
              to={`/returns/${t.returnId}/threads/${t.id}`}
              className="flex items-center gap-3 border-b border-ink-50 px-4 py-3 last:border-0 hover:bg-brand-50/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                <Icon path={ICONS.messages} size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-ink-800">{t.subject}</span>
                  {!isClient && hasInternal && (
                    <span className="rounded bg-ink-800 px-1 text-[9px] font-bold text-amber-300">HAS INTERNAL</span>
                  )}
                </div>
                <div className="truncate text-2xs text-ink-500">
                  {clientName(world, t.returnId === 'RET-1001' ? 'c-chen' : t.returnId)} · {t.ref.label}
                  {lastVisible && <> — “{lastVisible.body.slice(0, 60)}…”</>}
                </div>
              </div>
              <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-2xs font-semibold ${t.nextOwner === 'client' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                {OWNER_LABEL[t.nextOwner]} to act
              </span>
              <Icon path={ICONS.chevronRight} size={16} className="shrink-0 text-ink-300" />
            </Link>
          )
        })}
      </Card>
    </PageContainer>
  )
}
