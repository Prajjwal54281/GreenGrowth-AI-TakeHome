import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import {
  getReturn, clientName, fieldsFor, docsFor,
  questionnaireFor, warningsFor, threadsFor, requestsFor,
} from '../data/selectors'
import type { AffordanceState } from '../design/affordances'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/primitives'
import { AffordanceValue } from '../components/affordance/AffordanceValue'
import { NoSeededDetail } from '../components/NoSeededDetail'
import { Icon, ICONS } from '../components/ui/Icon'
import { money } from '../lib/format'

type Kind = 'document' | 'field' | 'question' | 'warning' | 'thread' | 'request'
const KIND_META: Record<Kind, { label: string; icon: string; tone: string }> = {
  document: { label: 'Documents', icon: ICONS.items, tone: 'text-blue-600' },
  field: { label: 'Fields', icon: ICONS.review, tone: 'text-brand-600' },
  question: { label: 'Questions', icon: ICONS.tasks, tone: 'text-violet-600' },
  warning: { label: 'Warnings', icon: ICONS.warning, tone: 'text-amber-600' },
  thread: { label: 'Messages', icon: ICONS.messages, tone: 'text-teal-600' },
  request: { label: 'Requests', icon: ICONS.flag, tone: 'text-red-600' },
}

interface Item {
  id: string
  kind: Kind
  section: string
  title: string
  subtitle?: string
  state?: AffordanceState
  severity?: 'info' | 'warning' | 'critical'
  value?: string
  to?: string
  search: string
}

type GroupBy = 'kind' | 'section' | 'state' | 'none'

export function ItemsPage() {
  const { returnId = '' } = useParams()
  const { world } = useApp()
  const navigate = useNavigate()
  const ret = getReturn(world, returnId)
  useTrackTrail(ret ? `Items · ${clientName(world, ret.clientId)}` : '', 'items')

  const [q, setQ] = useState('')
  const [activeKinds, setActiveKinds] = useState<Set<Kind>>(new Set())
  const [groupBy, setGroupBy] = useState<GroupBy>('kind')
  const [stateFilter, setStateFilter] = useState<AffordanceState | 'all'>('all')

  const items = useMemo<Item[]>(() => {
    if (!ret) return []
    const out: Item[] = []
    for (const d of docsFor(world, returnId))
      out.push({ id: d.id, kind: 'document', section: 'Documents', title: d.title, subtitle: `${d.regions.length} tracked regions`, to: `/returns/${returnId}/review`, search: d.title })
    for (const f of fieldsFor(world, returnId))
      out.push({ id: f.id, kind: 'field', section: f.section, title: f.label, subtitle: f.line, state: f.affordance, value: f.value, to: `/returns/${returnId}/review/${f.id}`, search: f.label + f.line })
    for (const item of questionnaireFor(world, returnId))
      out.push({ id: item.id, kind: 'question', section: item.section, title: item.question, subtitle: item.answer ? `Answer: ${item.answer}` : 'Unanswered', state: item.affordance, search: item.question + (item.answer ?? '') })
    for (const w of warningsFor(world, returnId))
      out.push({ id: w.id, kind: 'warning', section: 'Warnings', title: w.message, severity: w.severity, to: w.relatedFieldId ? `/returns/${returnId}/review/${w.relatedFieldId}` : undefined, search: w.message })
    for (const t of threadsFor(world, returnId))
      out.push({ id: t.id, kind: 'thread', section: 'Messages', title: t.subject, subtitle: `${t.messages.length} messages`, to: `/returns/${returnId}/threads/${t.id}`, search: t.subject })
    for (const r of requestsFor(world, returnId))
      out.push({ id: r.id, kind: 'request', section: 'Requests', title: r.title, subtitle: r.status === 'open' ? `Waiting ${r.daysWaiting}d` : 'Done', to: '/tasks', search: r.title })
    return out
  }, [world, returnId, ret])

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (activeKinds.size && !activeKinds.has(it.kind)) return false
      if (stateFilter !== 'all' && it.state !== stateFilter) return false
      if (q && !it.search.toLowerCase().includes(q.toLowerCase())) return false
      return true
    })
  }, [items, activeKinds, stateFilter, q])

  const groups = useMemo(() => {
    if (groupBy === 'none') return [{ key: 'All items', items: filtered }]
    const map = new Map<string, Item[]>()
    for (const it of filtered) {
      const key = groupBy === 'kind' ? KIND_META[it.kind].label : groupBy === 'section' ? it.section : (it.state ?? 'no state')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(it)
    }
    return [...map.entries()].map(([key, items]) => ({ key, items })).sort((a, b) => b.items.length - a.items.length)
  }, [filtered, groupBy])

  const toggleKind = (k: Kind) => setActiveKinds((prev) => {
    const next = new Set(prev)
    next.has(k) ? next.delete(k) : next.add(k)
    return next
  })

  if (!ret) return <PageContainer><p className="text-sm text-ink-500">Return not found.</p></PageContainer>

  if (items.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Everything on this return"
          subtitle={`${clientName(world, ret.clientId)} · ${ret.formType} · TY${ret.taxYear}`}
          challenges={['09']}
        />
        <NoSeededDetail what="items" returnLabel={clientName(world, ret.clientId)} />
      </PageContainer>
    )
  }

  return (
    <PageContainer wide>
      {/* persistent context header */}
      <div className="mb-3 flex items-center gap-2 text-xs text-ink-500">
        <span className="rounded-md bg-ink-100 px-2 py-0.5 font-semibold text-ink-600">{clientName(world, ret.clientId)}</span>
        <Icon path={ICONS.chevronRight} size={12} />
        <span>{ret.formType} · TY{ret.taxYear}</span>
        <Icon path={ICONS.chevronRight} size={12} />
        <span className="font-semibold text-ink-700">All items ({items.length})</span>
      </div>

      <PageHeader
        title="Everything on this return"
        subtitle="Hundreds of documents, fields, questions, warnings and messages — searchable, filterable, groupable."
        challenges={['09']}
      />

      {/* controls */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-ink-100 px-4 py-2.5">
          <div className="relative">
            <Icon path={ICONS.search} size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all items…" className="w-72 rounded-lg border border-ink-200 py-1.5 pl-8 pr-3 text-sm" />
          </div>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value as AffordanceState | 'all')}
            className="rounded-lg border border-ink-200 px-2 py-1.5 text-xs font-medium text-ink-600"
          >
            <option value="all">Any state</option>
            <option value="ai-unverified">AI · Unverified</option>
            <option value="verified">Verified</option>
            <option value="editable">Editable</option>
            <option value="requires-approval">Needs approval</option>
            <option value="locked">Locked</option>
          </select>
          <div className="ml-auto flex items-center gap-1.5 text-xs">
            <span className="text-ink-400">Group by</span>
            {(['kind', 'section', 'state', 'none'] as GroupBy[]).map((g) => (
              <button key={g} onClick={() => setGroupBy(g)} className={`rounded-lg px-2 py-1 font-medium capitalize ${groupBy === g ? 'bg-ink-800 text-white' : 'text-ink-500 hover:bg-ink-100'}`}>{g}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5">
          {(Object.keys(KIND_META) as Kind[]).map((k) => {
            const m = KIND_META[k]
            const on = activeKinds.has(k)
            const count = items.filter((i) => i.kind === k).length
            return (
              <button key={k} onClick={() => toggleKind(k)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium ${on ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-ink-200 text-ink-600 hover:bg-ink-50'}`}>
                <Icon path={m.icon} size={13} className={m.tone} />
                {m.label}
                <span className="rounded bg-ink-100 px-1 text-[10px] text-ink-500">{count}</span>
              </button>
            )
          })}
          {activeKinds.size > 0 && (
            <button onClick={() => setActiveKinds(new Set())} className="text-2xs text-ink-400 hover:text-ink-600">clear</button>
          )}
        </div>
      </Card>

      {/* grouped results */}
      <div className="space-y-4">
        {groups.map((g) => (
          <Card key={g.key} className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-4 py-2">
              <h3 className="text-sm font-semibold capitalize text-ink-800">{g.key}</h3>
              <span className="text-2xs text-ink-400">{g.items.length}</span>
            </div>
            <div className="divide-y divide-ink-50">
              {g.items.slice(0, 60).map((it) => {
                const m = KIND_META[it.kind]
                const clickable = !!it.to
                return (
                  <div
                    key={it.id}
                    onClick={() => it.to && navigate(it.to)}
                    className={`flex items-center gap-3 px-4 py-2 ${clickable ? 'cursor-pointer hover:bg-brand-50/40' : ''}`}
                  >
                    <Icon path={m.icon} size={15} className={`shrink-0 ${m.tone}`} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-ink-800">{it.title}</div>
                      {it.subtitle && <div className="truncate text-2xs text-ink-400">{it.subtitle}</div>}
                    </div>
                    {it.severity && (
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${it.severity === 'critical' ? 'bg-red-100 text-red-700' : it.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-ink-100 text-ink-500'}`}>{it.severity}</span>
                    )}
                    {it.state && <AffordanceValue state={it.state} size="sm">{it.value ? money(it.value) : it.state}</AffordanceValue>}
                    {clickable && <Icon path={ICONS.chevronRight} size={14} className="shrink-0 text-ink-300" />}
                  </div>
                )
              })}
              {g.items.length > 60 && (
                <div className="px-4 py-2 text-center text-2xs text-ink-400">+ {g.items.length - 60} more — narrow with search or filters</div>
              )}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <Card className="p-8 text-center text-sm text-ink-400">No items match.</Card>}
      </div>
    </PageContainer>
  )
}
