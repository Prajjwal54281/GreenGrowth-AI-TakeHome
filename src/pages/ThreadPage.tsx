import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp, usePersona } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import { threadById } from '../data/selectors'
import { OWNER_LABEL } from '../data/stages'
import type { Visibility } from '../data/types'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card, Button } from '../components/ui/primitives'
import { RelatedObjects } from '../components/RelatedObjects'
import { Icon, ICONS } from '../components/ui/Icon'

function VisibilityBadge({ v }: { v: Visibility }) {
  return v === 'internal' ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-ink-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
      <Icon path={ICONS.person} size={10} /> Internal only
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
      <Icon path={ICONS.messages} size={10} /> Client-visible
    </span>
  )
}

export function ThreadPage() {
  const { returnId = '', threadId = '' } = useParams()
  const { world, dispatch } = useApp()
  const persona = usePersona()
  const thread = threadById(world, threadId)
  useTrackTrail(thread ? thread.subject : '', 'thread')

  const [body, setBody] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('client-visible')

  if (!thread) return <PageContainer><p className="text-sm text-ink-500">Thread not found.</p></PageContainer>

  const send = () => {
    if (!body.trim()) return
    dispatch({ type: 'ADD_MESSAGE', threadId, body: body.trim(), visibility })
    setBody('')
  }

  const isClient = persona.primaryRole === 'client'

  return (
    <PageContainer>
      <PageHeader
        title={thread.subject}
        subtitle={<>Attached to <span className="font-medium text-ink-600">{thread.ref.label}</span></>}
        challenges={['02']}
        right={
          <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${thread.nextOwner === 'client' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
            <Icon path={ICONS.flag} size={13} />
            {OWNER_LABEL[thread.nextOwner]} owns the next action
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {/* context link to the attached object */}
          <Link
            to={thread.ref.kind === 'field' ? `/returns/${returnId}/review/${thread.ref.id}` : `/returns/${returnId}/review`}
            className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm hover:border-brand-300"
          >
            <Icon path={ICONS.link} size={14} className="text-ink-400" />
            <span className="text-ink-500">This conversation is about:</span>
            <span className="font-semibold text-brand-700">{thread.ref.label}</span>
            <Icon path={ICONS.chevronRight} size={14} className="ml-auto text-ink-300" />
          </Link>

          <Card className="overflow-hidden">
            <div className="space-y-0 divide-y divide-ink-50">
              {thread.messages
                .filter((m) => !(isClient && m.visibility === 'internal'))
                .map((m) => {
                  const internal = m.visibility === 'internal'
                  return (
                    <div key={m.id} className={`px-4 py-3 ${internal ? 'border-l-4 border-amber-400 bg-amber-50/50' : ''}`}>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink-800">{m.authorName}</span>
                        <span className="text-2xs capitalize text-ink-400">{m.authorRole}</span>
                        <VisibilityBadge v={m.visibility} />
                        <span className="ml-auto text-2xs text-ink-400">{m.createdAt}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-700">{m.body}</p>
                    </div>
                  )
                })}
            </div>

            {/* composer */}
            <div className="border-t border-ink-100 bg-ink-50/50 p-3">
              {!isClient && (
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-2xs font-semibold text-ink-400">Post as:</span>
                  <button onClick={() => setVisibility('client-visible')} className={`rounded-md px-2 py-0.5 text-2xs font-semibold ${visibility === 'client-visible' ? 'bg-brand-100 text-brand-700' : 'text-ink-500'}`}>Client-visible</button>
                  <button onClick={() => setVisibility('internal')} className={`rounded-md px-2 py-0.5 text-2xs font-semibold ${visibility === 'internal' ? 'bg-ink-800 text-amber-300' : 'text-ink-500'}`}>Internal note</button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={isClient ? 'Reply to your CPA…' : visibility === 'internal' ? 'Add an internal note (client will NOT see this)…' : 'Message the client…'}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm ${visibility === 'internal' && !isClient ? 'border-amber-300 bg-amber-50/40' : 'border-ink-200'}`}
                />
                <Button onClick={send}>Send</Button>
              </div>
              {visibility === 'internal' && !isClient && (
                <p className="mt-1 text-2xs text-amber-600">This note stays inside the firm — the client can’t see internal notes.</p>
              )}
            </div>
          </Card>
        </div>

        <RelatedObjects returnId={returnId} focus={thread.ref.kind === 'field' ? { kind: 'field', id: thread.ref.id } : undefined} />
      </div>
    </PageContainer>
  )
}
