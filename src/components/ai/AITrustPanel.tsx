import { useState } from 'react'
import type { ReturnField, DocRegion, TaxDocument } from '../../data/types'
import { useApp } from '../../state/AppState'
import { regionById } from '../../data/selectors'
import { ConfidenceMeter } from '../affordance/ConfidenceMeter'
import { AffordanceBadge } from '../affordance/AffordanceValue'
import { Button } from '../ui/primitives'
import { Icon, ICONS } from '../ui/Icon'
import { ChallengeTag } from '../ChallengeTag'
import { money } from '../../lib/format'

/* ============================================================================
   AI TRUST PANEL — Challenge 10
   Everywhere the AI produced a value, this panel explains it consistently:
   what it did · why · the evidence (linked) · a designed confidence indicator ·
   the suggested action · and an inline Accept / Edit / Reject flow that changes
   state without leaving the screen. Deliberately NOT a raw technical dump.
   ========================================================================== */

export function AITrustPanel({
  field,
  onJumpToEvidence,
}: {
  field: ReturnField
  onJumpToEvidence?: (regionIds: string[]) => void
}) {
  const { world, dispatch } = useApp()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(field.value)

  const ai = field.ai
  if (!ai) return null

  const resolved = field.affordance === 'verified'
  const handedBack = field.affordance === 'editable'

  const evidence = ai.evidenceRegionIds
    .map((id) => regionById(world, id))
    .filter((e): e is { region: DocRegion; doc: TaxDocument } => e !== undefined)

  return (
    <div className="rounded-xl border border-aff-ai-border bg-aff-ai-bg p-4">
      {/* header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-aff-ai text-white">
            <Icon path={ICONS.review} size={15} />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-aff-ai">AI assist</span>
              <ChallengeTag ids={['10']} />
            </div>
            <div className="text-2xs text-ink-500">How this value was produced</div>
          </div>
        </div>
        <ConfidenceMeter score={ai.confidence} />
      </div>

      {/* what + why */}
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-2xs font-semibold uppercase tracking-wide text-ink-400">What it did</dt>
          <dd className="text-ink-700">{ai.did}</dd>
        </div>
        <div>
          <dt className="text-2xs font-semibold uppercase tracking-wide text-ink-400">Why</dt>
          <dd className="text-ink-700">{ai.rationale}</dd>
        </div>
        <div>
          <dt className="text-2xs font-semibold uppercase tracking-wide text-ink-400">Evidence</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {evidence.map(({ region, doc }) => (
              <button
                key={region.id}
                onClick={() => onJumpToEvidence?.([region.id])}
                className="inline-flex items-center gap-1 rounded-md border border-brand-300 bg-white px-2 py-1 text-2xs font-medium text-brand-700 hover:bg-brand-50"
              >
                <Icon path={ICONS.link} size={11} />
                {doc.title.split(' — ')[0]} · {region.label.split(' — ')[0]}
              </button>
            ))}
          </dd>
        </div>
      </dl>

      {/* conflict / wrong callouts */}
      {ai.conflict && !resolved && (
        <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-800">
          <div className="flex items-center gap-1.5 font-semibold">
            <Icon path={ICONS.warning} size={13} /> Conflicting sources
          </div>
          <p className="mt-0.5">
            Another source disagrees: <span className="font-semibold">{money(ai.conflict.otherValue)}</span> — {ai.conflict.otherSourceLabel}.
          </p>
        </div>
      )}
      {ai.isWrong && !resolved && (
        <div className="mt-2 rounded-lg border border-red-300 bg-red-50 p-2.5 text-xs text-red-800">
          <div className="flex items-center gap-1.5 font-semibold">
            <Icon path={ICONS.warning} size={13} /> This suggestion looks wrong
          </div>
          <p className="mt-0.5">
            The AI’s value ({money(ai.suggestedValue)}) doesn’t reconcile with its own evidence. Don’t accept as-is — edit or reject.
          </p>
        </div>
      )}

      {/* suggested action + correction flow */}
      <div className="mt-3 border-t border-aff-ai-border pt-3">
        {resolved ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-aff-verified">
              <Icon path={ICONS.check} size={16} /> Verified — value is now {money(field.value)}
            </div>
            <AffordanceBadge state="verified" />
          </div>
        ) : handedBack ? (
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-ink-600">
              AI rejected. Enter the correct value directly.
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xs text-ink-400">$</span>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-28 rounded-md border border-ink-300 px-2 py-1 text-sm tabular-nums"
                placeholder="0.00"
              />
              <Button
                size="sm"
                onClick={() => dispatch({ type: 'EDIT_FIELD', fieldId: field.id, value: draft })}
              >
                Save
              </Button>
            </div>
          </div>
        ) : editing ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-2xs text-ink-400">$</span>
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-32 rounded-md border border-ink-300 px-2 py-1 text-sm tabular-nums"
              />
            </div>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setDraft(field.value) }}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => dispatch({ type: 'EDIT_FIELD', fieldId: field.id, value: draft })}>
                Save as verified
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-xs text-ink-600">
              <span className="font-semibold text-ink-700">Suggested:</span> set to {money(ai.suggestedValue)}
            </div>
            <div className="flex gap-1.5">
              <Button variant="secondary" size="sm" onClick={() => dispatch({ type: 'REJECT_AI', fieldId: field.id })}>
                Reject
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { setEditing(true); setDraft(field.value) }}>
                Edit
              </Button>
              <Button
                size="sm"
                disabled={ai.isWrong}
                onClick={() => dispatch({ type: 'ACCEPT_AI', fieldId: field.id })}
              >
                Accept
              </Button>
            </div>
          </div>
        )}
        {ai.isWrong && !resolved && !editing && !handedBack && (
          <p className="mt-1.5 text-right text-2xs text-ink-400">
            Accept is disabled here — the value needs a human correction.
          </p>
        )}
      </div>
    </div>
  )
}
