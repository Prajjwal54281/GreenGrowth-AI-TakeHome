import type { Stage, OwnerRole } from '../data/types'
import { STAGE_BY_ID, OWNER_LABEL } from '../data/stages'

const STAGE_TONE: Record<Stage, string> = {
  intake: 'bg-ink-100 text-ink-600',
  documents: 'bg-blue-100 text-blue-700',
  preparation: 'bg-violet-100 text-violet-700',
  review: 'bg-amber-100 text-amber-700',
  signoff: 'bg-teal-100 text-teal-700',
  filed: 'bg-green-100 text-green-700',
}

export function StageBadge({ stage, audience = 'staff' }: { stage: Stage; audience?: 'staff' | 'client' }) {
  const def = STAGE_BY_ID[stage]
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-semibold ${STAGE_TONE[stage]}`}>
      {audience === 'client' ? def.clientLabel : def.staffLabel}
    </span>
  )
}

const OWNER_TONE: Record<OwnerRole, string> = {
  client: 'bg-amber-50 text-amber-700 border-amber-200',
  preparer: 'bg-blue-50 text-blue-700 border-blue-200',
  reviewer: 'bg-violet-50 text-violet-700 border-violet-200',
  firm: 'bg-ink-50 text-ink-600 border-ink-200',
}

export function OwnerPill({ owner }: { owner: OwnerRole }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-2xs font-semibold ${OWNER_TONE[owner]}`}>
      {OWNER_LABEL[owner]} owns next
    </span>
  )
}
