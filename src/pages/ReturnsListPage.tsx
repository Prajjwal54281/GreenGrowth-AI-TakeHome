import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import { clientName } from '../data/selectors'
import { rankReturns } from '../logic/priority'
import { TEAM_BY_ID } from '../data/generate'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/primitives'
import { StageBadge, OwnerPill } from '../components/StageBadge'
import { Icon, ICONS } from '../components/ui/Icon'
import { money, relativeToNow } from '../lib/format'
import type { Stage } from '../data/types'

const STAGE_FILTERS: (Stage | 'all')[] = ['all', 'intake', 'documents', 'preparation', 'review', 'signoff', 'filed']

export function ReturnsListPage() {
  const { world } = useApp()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [stage, setStage] = useState<Stage | 'all'>('all')
  useTrackTrail('Returns', 'list')

  const rows = useMemo(() => {
    const ranked = rankReturns(world.returns)
    return ranked.filter(({ ret }) => {
      if (stage !== 'all' && ret.stage !== stage) return false
      if (q && !clientName(world, ret.clientId).toLowerCase().includes(q.toLowerCase()) && !ret.id.toLowerCase().includes(q.toLowerCase())) return false
      return true
    })
  }, [world, q, stage])

  return (
    <PageContainer wide>
      <PageHeader title="Returns" subtitle={`${world.returns.length} returns across the firm`} />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-ink-100 bg-ink-50/60 px-4 py-2.5">
          <div className="relative">
            <Icon path={ICONS.search} size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search client or return id…"
              className="w-64 rounded-lg border border-ink-200 py-1.5 pl-8 pr-3 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {STAGE_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize ${stage === s ? 'bg-ink-800 text-white' : 'text-ink-500 hover:bg-ink-100'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="ml-auto text-2xs text-ink-400">{rows.length} shown · ranked by urgency</span>
        </div>

        <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-ink-100 text-left text-2xs uppercase text-ink-400">
                <th className="px-4 py-2 font-semibold">Client</th>
                <th className="px-4 py-2 font-semibold">Form</th>
                <th className="px-4 py-2 font-semibold">Stage</th>
                <th className="px-4 py-2 font-semibold">Preparer</th>
                <th className="px-4 py-2 font-semibold">Next action</th>
                <th className="px-4 py-2 font-semibold">Due</th>
                <th className="px-4 py-2 text-right font-semibold">Refund</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ ret }) => (
                <tr
                  key={ret.id}
                  onClick={() => navigate(`/returns/${ret.id}`)}
                  className="cursor-pointer border-b border-ink-50 last:border-0 hover:bg-brand-50/40"
                >
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-ink-800">{clientName(world, ret.clientId)}</div>
                    <div className="text-2xs text-ink-400">{ret.id}</div>
                  </td>
                  <td className="px-4 py-2.5 text-ink-500">{ret.formType}</td>
                  <td className="px-4 py-2.5"><StageBadge stage={ret.stage} /></td>
                  <td className="px-4 py-2.5 text-ink-500">{TEAM_BY_ID[ret.preparerId]?.name ?? '—'}</td>
                  <td className="px-4 py-2.5"><OwnerPill owner={ret.nextActionOwner} /></td>
                  <td className={`px-4 py-2.5 ${ret.flags.overdue ? 'font-semibold text-red-600' : 'text-ink-500'}`}>{relativeToNow(ret.dueDate)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink-700">{money(ret.estimatedRefund)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  )
}
