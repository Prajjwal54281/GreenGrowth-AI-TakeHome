import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp, useEffectiveRole } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import { getReturn, clientName, requestsFor } from '../data/selectors'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/primitives'
import { StatusTimeline } from '../components/StatusTimeline'
import { RelatedObjects } from '../components/RelatedObjects'
import { Icon, ICONS } from '../components/ui/Icon'
import { OWNER_LABEL } from '../data/stages'

export function StatusPage() {
  const { returnId = '' } = useParams()
  const { world } = useApp()
  const role = useEffectiveRole()
  const ret = getReturn(world, returnId)
  useTrackTrail(ret ? `Status · ${clientName(world, ret.clientId)}` : '', 'status')

  // client personas default to the client rendering; staff can toggle to preview it
  const [audience, setAudience] = useState<'client' | 'staff'>(role === 'client' ? 'client' : 'staff')

  if (!ret) return <PageContainer><p className="text-sm text-ink-500">Return not found.</p></PageContainer>

  const openReqs = requestsFor(world, returnId).filter((r) => r.status === 'open')

  return (
    <PageContainer>
      <PageHeader
        title="Status & progress"
        subtitle={`${clientName(world, ret.clientId)} · ${ret.formType} · TY${ret.taxYear}`}
        challenges={['06']}
        right={
          role !== 'client' && (
            <div className="flex items-center rounded-lg border border-ink-200 p-0.5 text-xs font-semibold">
              <button onClick={() => setAudience('client')} className={`rounded-md px-2.5 py-1.5 ${audience === 'client' ? 'bg-brand-700 text-white' : 'text-ink-500'}`}>
                Client view
              </button>
              <button onClick={() => setAudience('staff')} className={`rounded-md px-2.5 py-1.5 ${audience === 'staff' ? 'bg-brand-700 text-white' : 'text-ink-500'}`}>
                Staff view
              </button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {/* the "answers everyone needs" banner */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <div className="text-2xs uppercase tracking-wide text-ink-400">Where it is</div>
                <div className="text-sm font-semibold text-ink-800">
                  {audience === 'client' ? 'Being prepared' : 'In preparation'}
                </div>
              </div>
              <div>
                <div className="text-2xs uppercase tracking-wide text-ink-400">Who owns next</div>
                <div className="text-sm font-semibold text-ink-800">{OWNER_LABEL[ret.nextActionOwner]}</div>
              </div>
              <div>
                <div className="text-2xs uppercase tracking-wide text-ink-400">What’s next</div>
                <div className="text-sm font-semibold text-ink-800">{ret.nextAction}</div>
              </div>
              <div>
                <div className="text-2xs uppercase tracking-wide text-ink-400">Blocking?</div>
                <div className={`text-sm font-semibold ${ret.flags.blocked ? 'text-amber-600' : 'text-green-600'}`}>
                  {ret.flags.blocked ? 'Yes — 1 item' : 'No'}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-800">Progress</h2>
              <span className="text-2xs text-ink-400">
                Same underlying model — {audience === 'client' ? 'plain-language' : 'operational'} rendering
              </span>
            </div>
            <StatusTimeline ret={ret} audience={audience} />
          </Card>

          {audience === 'client' && openReqs.length > 0 && (
            <Card className="border-amber-200 p-4">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                <Icon path={ICONS.warning} size={15} /> We need {openReqs.length} thing{openReqs.length > 1 ? 's' : ''} from you
              </div>
              <ul className="mt-2 space-y-1 text-sm text-ink-600">
                {openReqs.map((r) => (
                  <li key={r.id} className="flex items-center gap-1.5">
                    <Icon path={ICONS.chevronRight} size={13} className="text-amber-400" />
                    {r.title}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <RelatedObjects returnId={returnId} />
      </div>
    </PageContainer>
  )
}
