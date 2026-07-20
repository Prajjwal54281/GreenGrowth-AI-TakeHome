import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, usePersona } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import { useSimulatedLoad } from '../hooks/useSimulatedLoad'
import { clientName } from '../data/selectors'
import { rankReturns, type RankedReturn, type PriorityReason } from '../logic/priority'
import { TEAM, TEAM_BY_ID } from '../data/generate'
import type { TaxReturn } from '../data/types'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card, Skeleton } from '../components/ui/primitives'
import { StageBadge, OwnerPill } from '../components/StageBadge'
import { Icon, ICONS } from '../components/ui/Icon'
import { Tooltip } from '../components/ui/Tooltip'
import { relativeToNow } from '../lib/format'

/* The queue deliberately renders a bounded slice: with 200+ returns on one
   preparer, an unbounded list is exactly the spreadsheet we're replacing. The
   ranking runs over ALL of them; only the render is capped. */
const QUEUE_LIMIT = 40

type Lens = 'preparer' | 'manager'
type QuickFilter = 'all' | 'overdue' | 'blocked' | 'waiting' | 'flags'

const REASON_TONE: Record<PriorityReason['tone'], string> = {
  danger: 'bg-red-50 text-red-700 border-red-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-ink-50 text-ink-500 border-ink-200',
}

function StatTile({
  label, value, tone, active, onClick,
}: {
  label: string; value: number; tone: string; active?: boolean; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start rounded-xl border px-3.5 py-2.5 text-left transition ${
        active ? 'border-brand-400 ring-2 ring-brand-100' : 'border-ink-200 hover:border-ink-300'
      } bg-white`}
    >
      <span className={`text-2xl font-bold tabular-nums ${tone}`}>{value}</span>
      <span className="text-2xs font-medium text-ink-500">{label}</span>
    </button>
  )
}

function QueueRow({ ranked, rank, onOpen }: { ranked: RankedReturn; rank: number; onOpen: () => void }) {
  const { world } = useApp()
  const { ret, reasons, score, headline } = ranked
  return (
    <button
      onClick={onOpen}
      className="group flex w-full items-center gap-3 border-b border-ink-100 px-4 py-3 text-left last:border-0 hover:bg-brand-50/40"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-800 text-2xs font-bold text-white">
        {rank}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-ink-800">
            {clientName(world, ret.clientId)}
          </span>
          <span className="text-2xs text-ink-400">{ret.formType}</span>
          <StageBadge stage={ret.stage} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {reasons.slice(0, 3).map((r, i) => (
            <span key={i} className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${REASON_TONE[r.tone]}`}>
              {r.label}
            </span>
          ))}
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        <span className="rounded bg-ink-100 px-1.5 py-0.5 text-2xs font-semibold text-ink-500">
          {TEAM_BY_ID[ret.preparerId]?.initials ?? '·'}
        </span>
        <OwnerPill owner={ret.nextActionOwner} />
      </div>
      <Tooltip
        width={200}
        align="right"
        content={<span>Urgency score {score}. Top factor: {headline}. Ranked by deadline, client-wait, review flags, and AI trust signals.</span>}
      >
        <div className="flex w-12 shrink-0 flex-col items-end">
          <span className="text-sm font-bold tabular-nums text-ink-800">{score}</span>
          <span className="text-[9px] uppercase text-ink-400">score</span>
        </div>
      </Tooltip>
      <Icon path={ICONS.chevronRight} size={16} className="shrink-0 text-ink-300 group-hover:text-brand-500" />
    </button>
  )
}

export function DashboardPage() {
  const { world } = useApp()
  const persona = usePersona()
  const navigate = useNavigate()
  const loading = useSimulatedLoad(400, [persona.id])
  useTrackTrail('Dashboard', 'dashboard')

  const canManage = persona.primaryRole === 'manager'
  const [lens, setLens] = useState<Lens>(canManage ? 'manager' : 'preparer')
  const [filter, setFilter] = useState<QuickFilter>('all')

  const scopeReturns = useMemo<TaxReturn[]>(() => {
    if (lens === 'preparer') return world.returns.filter((r) => r.preparerId === persona.id)
    return world.returns
  }, [world.returns, lens, persona.id])

  const ranked = useMemo(() => rankReturns(scopeReturns), [scopeReturns])

  const stats = useMemo(() => {
    const active = scopeReturns.filter((r) => r.stage !== 'filed')
    return {
      total: active.length,
      overdue: active.filter((r) => r.flags.overdue).length,
      blocked: active.filter((r) => r.flags.blocked).length,
      waiting: active.filter((r) => r.daysWaitingOnClient > 0).length,
      flags: active.filter((r) => r.openReviewFlags > 0 || r.flags.aiError).length,
    }
  }, [scopeReturns])

  const filtered = useMemo(() => {
    return ranked.filter(({ ret }) => {
      if (ret.stage === 'filed') return false
      if (filter === 'overdue') return ret.flags.overdue
      if (filter === 'blocked') return ret.flags.blocked
      if (filter === 'waiting') return ret.daysWaitingOnClient > 0
      if (filter === 'flags') return ret.openReviewFlags > 0 || ret.flags.aiError
      return true
    })
  }, [ranked, filter])

  const openReturn = (r: TaxReturn) =>
    navigate(r.id === 'RET-1001' ? `/returns/${r.id}/review` : `/returns/${r.id}`)

  return (
    <PageContainer wide>
      <PageHeader
        title={`What should ${lens === 'manager' ? 'the team' : 'I'} work on right now?`}
        subtitle={`${scopeReturns.length} returns in scope · ranked by a real prioritization function`}
        challenges={['07']}
        right={
          <div className="flex items-center rounded-lg border border-ink-200 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLens('preparer')}
              className={`rounded-md px-2.5 py-1.5 ${lens === 'preparer' ? 'bg-brand-700 text-white' : 'text-ink-500'}`}
            >
              My queue
            </button>
            <button
              onClick={() => setLens('manager')}
              className={`rounded-md px-2.5 py-1.5 ${lens === 'manager' ? 'bg-brand-700 text-white' : 'text-ink-500'}`}
            >
              Team (manager)
            </button>
          </div>
        }
      />

      {/* stat tiles double as quick filters */}
      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        <StatTile label="Active returns" value={stats.total} tone="text-ink-800" active={filter === 'all'} onClick={() => setFilter('all')} />
        <StatTile label="Overdue" value={stats.overdue} tone="text-red-600" active={filter === 'overdue'} onClick={() => setFilter('overdue')} />
        <StatTile label="Blocked" value={stats.blocked} tone="text-red-600" active={filter === 'blocked'} onClick={() => setFilter('blocked')} />
        <StatTile label="Waiting on client" value={stats.waiting} tone="text-amber-600" active={filter === 'waiting'} onClick={() => setFilter('waiting')} />
        <StatTile label="Review / AI flags" value={stats.flags} tone="text-violet-600" active={filter === 'flags'} onClick={() => setFilter('flags')} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Do this next queue */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Icon path={ICONS.flag} size={16} className="text-brand-600" />
              <h2 className="text-sm font-semibold text-ink-800">Do this next</h2>
              <span className="rounded-full bg-ink-100 px-1.5 text-2xs font-semibold text-ink-500">
                {filter === 'all' ? 'top priority' : filter}
              </span>
            </div>
            <span className="text-2xs text-ink-400">
              {filtered.length > QUEUE_LIMIT
                ? `top ${QUEUE_LIMIT} of ${filtered.length}, filter to narrow`
                : `${filtered.length} shown`}
            </span>
          </div>
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
              {filtered.slice(0, QUEUE_LIMIT).map((r, i) => (
                <QueueRow key={r.ret.id} ranked={r} rank={i + 1} onOpen={() => openReturn(r.ret)} />
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-sm text-ink-400">Nothing in this filter. Nice.</div>
              )}
            </div>
          )}
        </Card>

        {/* Side rail: manager workload OR my focus */}
        <div className="space-y-4">
          {lens === 'manager' ? (
            <Card>
              <div className="border-b border-ink-100 px-4 py-2.5">
                <h2 className="text-sm font-semibold text-ink-800">Team workload</h2>
                <p className="text-2xs text-ink-500">Active returns + urgent load per preparer</p>
              </div>
              <div className="p-2">
                {TEAM.map((m) => {
                  const mine = world.returns.filter((r) => r.preparerId === m.id && r.stage !== 'filed')
                  const urgent = rankReturns(mine).filter((r) => r.score >= 40).length
                  const load = Math.min(100, mine.length * 5)
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setLens('preparer'); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-ink-50"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-700 text-2xs font-bold text-white">
                        {m.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-ink-800">
                          {m.name}
                          {m.seasonal && <span className="rounded bg-ink-100 px-1 text-[9px] font-semibold text-ink-400">seasonal</span>}
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                          <div className={`h-full rounded-full ${urgent > 3 ? 'bg-red-400' : 'bg-brand-400'}`} style={{ width: `${load}%` }} />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold tabular-nums text-ink-800">{mine.length}</div>
                        <div className="text-[9px] text-red-500">{urgent} urgent</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="border-b border-ink-100 px-4 py-2.5">
                <h2 className="text-sm font-semibold text-ink-800">Your next 3 hours</h2>
                <p className="text-2xs text-ink-500">The very top of your queue</p>
              </div>
              <div className="p-2">
                {ranked.filter((r) => r.ret.stage !== 'filed').slice(0, 4).map((r) => (
                  <button
                    key={r.ret.id}
                    onClick={() => openReturn(r.ret)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-ink-50"
                  >
                    <Icon path={ICONS.clock} size={15} className="text-ink-400" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-800">{clientName(world, r.ret.clientId)}</div>
                      <div className="text-2xs text-ink-500">{r.headline} · due {relativeToNow(r.ret.dueDate)}</div>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-ink-700">{r.score}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-ink-800">How ranking works</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              Each return gets an urgency score from deadline proximity, days waiting on the client,
              blocked status, open review flags, and AI trust signals (a wrong or conflicting value
              scores higher). Hover any score to see the factors. It’s real code, not a static sort,
              see <code className="rounded bg-ink-100 px-1 text-ink-600">src/logic/priority.ts</code>.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
