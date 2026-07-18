import { confidenceBand, CONFIDENCE_META } from '../../design/affordances'
import { Tooltip } from '../ui/Tooltip'

/* ============================================================================
   ConfidenceMeter — Challenge 10
   A *designed* confidence indicator, not a bare percentage. Three signal bars
   (like cell reception) plus a plain-language band. The raw score is available
   on hover for the curious, but the primary read is "high / medium / low" +
   color — appropriate transparency, not a technical dump.
   ========================================================================== */

export function ConfidenceMeter({
  score,
  showLabel = true,
  size = 'md',
}: {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md'
}) {
  const band = confidenceBand(score)
  const meta = CONFIDENCE_META[band]
  const barH = size === 'sm' ? ['h-2', 'h-2.5', 'h-3'] : ['h-2.5', 'h-3.5', 'h-4']
  return (
    <Tooltip
      width={220}
      content={
        <div className="space-y-1">
          <div className="font-semibold">{meta.label} · {Math.round(score * 100)}%</div>
          <p className="text-ink-200">{meta.why}</p>
        </div>
      }
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="flex items-end gap-0.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-1.5 rounded-sm ${barH[i]} ${
                i < meta.bars ? meta.bg : 'bg-ink-200'
              }`}
            />
          ))}
        </span>
        {showLabel && (
          <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
        )}
      </span>
    </Tooltip>
  )
}
