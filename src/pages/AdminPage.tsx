import { useMemo } from 'react'
import { useApp } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import { TEAM } from '../data/generate'
import { rankReturns } from '../logic/priority'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card, CardHeader } from '../components/ui/primitives'
import { Icon, ICONS } from '../components/ui/Icon'
import type { Role } from '../data/types'

/* ============================================================================
   FIRM ADMINISTRATION — Challenge 05
   The admin experience, and the place where permissions are COMMUNICATED
   rather than merely enforced. The matrix below is the same role model the
   shell uses to build navigation, so what an admin reads here matches what
   each role actually gets.
   ========================================================================== */

const ROLE_LABEL: Record<Role, string> = {
  client: 'Individual taxpayer',
  preparer: 'Tax preparer',
  reviewer: 'Reviewer',
  manager: 'Review manager',
  admin: 'Firm administrator',
  seasonal: 'Seasonal staff',
}

const ROLE_NOTE: Record<Role, string> = {
  client: 'Sees only their own return, in plain language. Never sees internal notes.',
  preparer: 'Owns a queue of returns end-to-end. Cannot approve their own work.',
  reviewer: 'Signs off on returns in review; can approve changed values.',
  manager: 'Everything a reviewer can do, plus the team workload lens.',
  admin: 'Firm-wide visibility, team roster, and role administration.',
  seasonal: 'A preparer with a narrower scope — temporary, capacity-only access.',
}

const CAPS = [
  'View own return',
  'View all firm returns',
  'Edit return fields',
  'Approve changed values',
  'See internal notes',
  'Manage team & roles',
] as const

const MATRIX: Record<Role, boolean[]> = {
  //                own   all    edit   approve internal  admin
  client: [true, false, false, false, false, false],
  preparer: [true, false, true, false, true, false],
  seasonal: [true, false, true, false, true, false],
  reviewer: [true, true, true, true, true, false],
  manager: [true, true, true, true, true, false],
  admin: [true, true, false, false, true, true],
}

const ROLE_ORDER: Role[] = ['client', 'preparer', 'seasonal', 'reviewer', 'manager', 'admin']

export function AdminPage() {
  const { world } = useApp()
  useTrackTrail('Firm administration', 'admin')

  const stats = useMemo(() => {
    const active = world.returns.filter((r) => r.stage !== 'filed')
    const urgent = rankReturns(active).filter((r) => r.score >= 60).length
    return {
      returns: world.returns.length,
      active: active.length,
      urgent,
      clients: world.clients.length,
      staff: TEAM.length,
    }
  }, [world])

  return (
    <PageContainer wide>
      <PageHeader
        title="Firm administration"
        subtitle="Team capacity and the role model that drives what every person can see and do."
        challenges={['05']}
      />

      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {[
          { label: 'Returns', value: stats.returns, tone: 'text-ink-800' },
          { label: 'Active', value: stats.active, tone: 'text-ink-800' },
          { label: 'Urgent (score 60+)', value: stats.urgent, tone: 'text-red-600' },
          { label: 'Clients', value: stats.clients, tone: 'text-ink-800' },
          { label: 'Staff', value: stats.staff, tone: 'text-ink-800' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-ink-200 bg-white px-3.5 py-2.5">
            <div className={`text-2xl font-bold tabular-nums ${s.tone}`}>{s.value}</div>
            <div className="text-2xs font-medium text-ink-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* permission matrix */}
        <Card className="overflow-hidden">
          <CardHeader
            title="Roles & permissions"
            subtitle="One product, six roles — this matrix is what the shell actually enforces"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-2xs uppercase text-ink-400">
                  <th className="px-4 py-2 font-semibold">Role</th>
                  {CAPS.map((c) => (
                    <th key={c} className="px-2 py-2 text-center font-semibold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROLE_ORDER.map((role) => (
                  <tr key={role} className="border-b border-ink-50 last:border-0 align-top">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-ink-800">{ROLE_LABEL[role]}</div>
                      <div className="max-w-[16rem] text-2xs leading-snug text-ink-400">{ROLE_NOTE[role]}</div>
                    </td>
                    {MATRIX[role].map((allowed, i) => (
                      <td key={i} className="px-2 py-2.5 text-center">
                        {allowed ? (
                          <Icon path={ICONS.check} size={15} className="inline text-aff-verified" />
                        ) : (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-ink-100 px-4 py-2.5 text-2xs text-ink-400">
            Presentation-layer only — there is no real auth behind this prototype. A production
            build would enforce the same matrix server-side.
          </div>
        </Card>

        {/* team roster */}
        <Card>
          <CardHeader title="Team" subtitle="Roster and current load" />
          <div className="p-2">
            {TEAM.map((m) => {
              const mine = world.returns.filter((r) => r.preparerId === m.id && r.stage !== 'filed')
              const urgent = rankReturns(mine).filter((r) => r.score >= 60).length
              const load = Math.min(100, (mine.length / 200) * 100)
              return (
                <div key={m.id} className="flex items-center gap-2.5 rounded-lg px-2 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-700 text-2xs font-bold text-white">
                    {m.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-ink-800">
                      {m.name}
                      {m.seasonal && (
                        <span className="rounded bg-ink-100 px-1 text-[9px] font-semibold text-ink-400">seasonal</span>
                      )}
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                      <div
                        className={`h-full rounded-full ${load > 70 ? 'bg-red-400' : 'bg-brand-400'}`}
                        style={{ width: `${load}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold tabular-nums text-ink-800">{mine.length}</div>
                    <div className="text-[9px] text-red-500">{urgent} urgent</div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
