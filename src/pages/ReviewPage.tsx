import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../state/AppState'
import { useTrackTrail } from '../hooks/useTrackTrail'
import {
  getReturn,
  clientName,
  fieldsFor,
  docsFor,
  fieldsFedByRegion,
} from '../data/selectors'
import type { ReturnField, DocRegion } from '../data/types'
import { PageContainer, PageHeader } from '../components/PageHeader'
import { Card, Button } from '../components/ui/primitives'
import { AffordanceValue } from '../components/affordance/AffordanceValue'
import { AffordanceLegend } from '../components/affordance/AffordanceLegend'
import { ConfidenceMeter } from '../components/affordance/ConfidenceMeter'
import { AITrustPanel } from '../components/ai/AITrustPanel'
import { Facsimile } from '../components/documents/Facsimile'
import { NoSeededDetail } from '../components/NoSeededDetail'
import { Icon, ICONS } from '../components/ui/Icon'
import { money } from '../lib/format'

function CalcBreakdown({ field }: { field: ReturnField }) {
  if (!field.calcOperands) return null
  return (
    <div className="rounded-lg border border-ink-200 bg-ink-50 p-3">
      <div className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-ink-400">
        Calculation
      </div>
      <div className="space-y-1">
        {field.calcOperands.map((op, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-ink-600">
              {i > 0 && <span className="text-ink-400">+</span>}
              {op.label}
            </span>
            <span className="font-mono text-ink-800">{money(op.value)}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center justify-between border-t border-ink-300 pt-1 text-sm font-bold">
          <span className="text-ink-700">= {field.label}</span>
          <span className="font-mono text-ink-900">{money(field.value)}</span>
        </div>
      </div>
    </div>
  )
}

export function ReviewPage() {
  const { returnId = '', fieldId } = useParams()
  const navigate = useNavigate()
  const { world, recentlyChanged, dispatch } = useApp()

  const ret = getReturn(world, returnId)
  const fields = useMemo(() => fieldsFor(world, returnId), [world, returnId])
  const docs = useMemo(() => docsFor(world, returnId), [world, returnId])

  const [selectedId, setSelectedId] = useState<string | undefined>(fieldId)
  const [activeDocId, setActiveDocId] = useState(docs[0]?.id)
  const [activePage, setActivePage] = useState(1)
  const [highlightRegions, setHighlightRegions] = useState<string[]>([])
  const [pulseFieldIds, setPulseFieldIds] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | undefined>()
  const [draft, setDraft] = useState('')
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const commitEdit = (fieldId: string) => {
    dispatch({ type: 'EDIT_FIELD', fieldId, value: draft })
    setEditingId(undefined)
  }

  useTrackTrail(ret ? `Review · ${clientName(world, ret.clientId)}` : '', 'review')

  /** jump the viewer to the exact document AND page holding a region */
  const revealRegion = (regionId: string) => {
    const doc = docs.find((d) => d.regions.some((r) => r.id === regionId))
    if (!doc) return
    setActiveDocId(doc.id)
    const region = doc.regions.find((r) => r.id === regionId)
    if (region) setActivePage(region.page)
  }

  const selectField = (f: ReturnField, updateUrl = true) => {
    setSelectedId(f.id)
    setHighlightRegions(f.sourceRegionIds)
    setPulseFieldIds([])
    // switch the viewer to the doc + page that holds the first source region
    if (f.sourceRegionIds[0]) revealRegion(f.sourceRegionIds[0])
    if (updateUrl) navigate(`/returns/${returnId}/review/${f.id}`, { replace: true })
  }

  // deep-link: if arriving with a :fieldId, select it once data is ready
  useEffect(() => {
    if (fieldId) {
      const f = fields.find((x) => x.id === fieldId)
      if (f) selectField(f, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId, returnId])

  const onRegionClick = (region: DocRegion) => {
    const fed = fieldsFedByRegion(world, region.id)
    setHighlightRegions([region.id])
    setPulseFieldIds(fed.map((f) => f.id))
    setActivePage(region.page)
    if (fed[0]) {
      setSelectedId(fed[0].id)
      navigate(`/returns/${returnId}/review/${fed[0].id}`, { replace: true })
      fieldRefs.current[fed[0].id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (!ret) {
    return (
      <PageContainer>
        <p className="text-sm text-ink-500">Return not found.</p>
      </PageContainer>
    )
  }

  // Only the hero return is seeded with field-level detail — say so plainly
  // instead of rendering an empty review shell.
  if (fields.length === 0 || docs.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Return review"
          subtitle={`${clientName(world, ret.clientId)} · ${ret.formType} · TY${ret.taxYear}`}
          challenges={['01', '08', '10']}
        />
        <NoSeededDetail what="field-level detail" returnLabel={clientName(world, ret.clientId)} />
      </PageContainer>
    )
  }

  const sections = [...new Set(fields.map((f) => f.section))]
  const activeDoc = docs.find((d) => d.id === activeDocId) ?? docs[0]
  const selected = fields.find((f) => f.id === selectedId)

  return (
    <PageContainer wide>
      <PageHeader
        title="Return review"
        subtitle={
          <>
            {clientName(world, ret.clientId)} · {ret.formType} · TY{ret.taxYear} —{' '}
            <span className="text-ink-400">click a field to trace it to its source, or click a document box to see what it feeds</span>
          </>
        }
        challenges={['01', '08', '10']}
        right={
          <Link
            to={`/returns/${returnId}`}
            className="rounded-lg border border-ink-300 px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            Return overview
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* LEFT — return fields */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-4 py-2.5">
            <h2 className="text-sm font-semibold text-ink-800">Form 1040 fields</h2>
            <AffordanceLegend variant="compact" />
          </div>
          <div className="max-h-[calc(100vh-230px)] overflow-y-auto p-3">
            {sections.map((section) => (
              <div key={section} className="mb-4 last:mb-0">
                <div className="mb-1.5 px-1 text-2xs font-semibold uppercase tracking-wide text-ink-400">
                  {section}
                </div>
                <div className="space-y-1.5">
                  {fields
                    .filter((f) => f.section === section)
                    .map((f) => {
                      const isSel = f.id === selectedId
                      const pulsing = pulseFieldIds.includes(f.id)
                      const changed = recentlyChanged.includes(f.id)
                      return (
                        <div
                          key={f.id}
                          ref={(el) => { fieldRefs.current[f.id] = el }}
                          className={[
                            'rounded-xl border transition',
                            isSel ? 'border-brand-300 bg-brand-50/40 shadow-card' : 'border-ink-200 bg-white hover:border-ink-300',
                            pulsing ? 'trace-pulse' : '',
                          ].join(' ')}
                        >
                          <div className="flex w-full items-center gap-3 px-3 py-2.5">
                            <button onClick={() => selectField(f)} className="min-w-0 flex-1 text-left">
                              <div className="flex items-center gap-1.5">
                                <span className="text-2xs font-semibold text-brand-700">{f.line}</span>
                                {f.calculation && (
                                  <span className="rounded bg-ink-100 px-1 text-[9px] font-semibold text-ink-500">
                                    Σ calc
                                  </span>
                                )}
                                {changed && (
                                  <span className="rounded bg-green-100 px-1 text-[9px] font-bold text-green-700">
                                    updated
                                  </span>
                                )}
                              </div>
                              <div className="truncate text-sm font-medium text-ink-800">{f.label}</div>
                            </button>
                            {f.ai && f.affordance === 'ai-unverified' && (
                              <ConfidenceMeter score={f.ai.confidence} showLabel={false} size="sm" />
                            )}
                            {/* an `editable` value is genuinely click-to-edit — the
                                affordance tooltip promises it, so it has to be true */}
                            {editingId === f.id ? (
                              <div className="flex shrink-0 items-center gap-1.5">
                                <span className="text-2xs text-ink-400">$</span>
                                <input
                                  autoFocus
                                  value={draft}
                                  onChange={(e) => setDraft(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitEdit(f.id)
                                    if (e.key === 'Escape') setEditingId(undefined)
                                  }}
                                  className="w-24 rounded-md border border-ink-300 px-2 py-1 text-sm tabular-nums"
                                />
                                <Button size="sm" onClick={() => commitEdit(f.id)}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingId(undefined)}>
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <AffordanceValue
                                state={f.affordance}
                                onEdit={() => { setEditingId(f.id); setDraft(f.value) }}
                              >
                                {money(f.value)}
                              </AffordanceValue>
                            )}
                            <button onClick={() => selectField(f)} className="shrink-0">
                              <Icon
                                path={ICONS.chevronRight}
                                size={16}
                                className={`text-ink-300 transition ${isSel ? 'rotate-90 text-brand-500' : ''}`}
                              />
                            </button>
                          </div>

                          {/* inline detail for the selected field */}
                          {isSel && (
                            <div className="space-y-3 border-t border-ink-100 px-3 py-3">
                              {f.calcOperands && <CalcBreakdown field={f} />}
                              {f.sourceRegionIds.length > 0 && (
                                <button
                                  onClick={() => {
                                    setHighlightRegions(f.sourceRegionIds)
                                    if (f.sourceRegionIds[0]) revealRegion(f.sourceRegionIds[0])
                                  }}
                                  className="flex items-center gap-1.5 text-xs font-medium text-brand-700 hover:underline"
                                >
                                  <Icon path={ICONS.link} size={13} />
                                  Highlight {f.sourceRegionIds.length} source region
                                  {f.sourceRegionIds.length > 1 ? 's' : ''} on the document →
                                </button>
                              )}
                              {f.ai ? (
                                <AITrustPanel field={f} onJumpToEvidence={(ids) => {
                                  setHighlightRegions(ids)
                                  if (ids[0]) revealRegion(ids[0])
                                }} />
                              ) : (
                                <div className="rounded-lg border border-ink-200 bg-ink-50 p-2.5 text-xs text-ink-500">
                                  <Icon path={ICONS.person} size={12} className="mr-1 inline" />
                                  {f.affordance === 'locked'
                                    ? 'System-derived value — not editable by hand.'
                                    : 'Human-entered value.'}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* RIGHT — document viewer */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-ink-100 bg-ink-50/60 px-3 py-2">
            {docs.map((d) => {
              const hasHl = d.regions.some((r) => highlightRegions.includes(r.id))
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDocId(d.id)}
                  className={[
                    'shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
                    d.id === activeDocId ? 'bg-white text-ink-800 shadow-card ring-1 ring-ink-200' : 'text-ink-500 hover:bg-white/60',
                    hasHl && d.id !== activeDocId ? 'ring-1 ring-brand-300' : '',
                  ].join(' ')}
                >
                  {d.title.replace(' — ', ' · ')}
                </button>
              )
            })}
          </div>
          <div className="bg-ink-100/50 p-5">
            {activeDoc && (
              <>
                {/* page navigation — traceability resolves to an exact page */}
                {activeDoc.pageCount > 1 && (
                  <div className="mx-auto mb-3 flex max-w-[560px] items-center justify-center gap-1.5">
                    {Array.from({ length: activeDoc.pageCount }, (_, i) => i + 1).map((p) => {
                      const hasHl = activeDoc.regions.some(
                        (r) => r.page === p && highlightRegions.includes(r.id),
                      )
                      return (
                        <button
                          key={p}
                          onClick={() => setActivePage(p)}
                          className={[
                            'rounded-lg border px-2.5 py-1 text-xs font-semibold transition',
                            p === activePage
                              ? 'border-brand-400 bg-white text-brand-700'
                              : 'border-ink-200 text-ink-500 hover:bg-white',
                            hasHl && p !== activePage ? 'ring-2 ring-brand-300' : '',
                          ].join(' ')}
                        >
                          Page {p}
                          {hasHl && <span className="ml-1 text-brand-500">•</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
                <Facsimile
                  doc={activeDoc}
                  page={activePage}
                  highlightedRegionIds={highlightRegions}
                  onRegionClick={onRegionClick}
                />
                <p className="mx-auto mt-3 max-w-[560px] text-center text-2xs text-ink-400">
                  Click a highlighted box to see which return field it feeds. Uploaded{' '}
                  {activeDoc.uploadedAt}. This is a styled mockup — no real OCR.
                </p>
              </>
            )}
          </div>
        </Card>
      </div>

      {selected && (
        <p className="mt-3 text-center text-xs text-ink-400">
          Deep link to this exact field:{' '}
          <code className="rounded bg-ink-100 px-1.5 py-0.5 text-ink-600">
            /returns/{returnId}/review/{selected.id}
          </code>
        </p>
      )}
    </PageContainer>
  )
}
