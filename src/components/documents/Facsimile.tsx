import type { TaxDocument, DocRegion } from '../../data/types'

/* ============================================================================
   DOCUMENT FACSIMILES — Challenge 01
   Styled HTML mockups of a W-2, 1099-INT, 1099-DIV, and brokerage statement.
   NOT real documents and NOT parsed — every tracked box is positioned with the
   SAME percentage coordinates as its traceability region, so the highlight
   overlay lines up exactly. Decorative boxes add realism.
   ========================================================================== */

interface DecoBox {
  x: number; y: number; w: number; h: number; label: string; value: string
}

// small helper to place an absolutely-positioned box by % coords
function boxStyle(b: { x: number; y: number; w: number; h: number }) {
  return { left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` } as const
}

function FormBox({
  region,
  highlighted,
  dimmed,
  onClick,
}: {
  region: DocRegion
  highlighted: boolean
  dimmed: boolean
  onClick?: () => void
}) {
  const feeds = region.feedsFieldIds.length > 0
  return (
    <button
      type="button"
      onClick={onClick}
      style={boxStyle(region.bbox)}
      className={[
        'absolute flex flex-col justify-between rounded border p-1 text-left transition',
        feeds ? 'cursor-pointer' : 'cursor-default',
        highlighted
          ? 'z-20 border-brand-500 bg-brand-100/80 ring-2 ring-brand-400 trace-pulse'
          : feeds
            ? 'border-brand-300/70 bg-brand-50/40 hover:bg-brand-50'
            : 'border-ink-200 bg-white',
        dimmed && !highlighted ? 'opacity-40' : '',
      ].join(' ')}
    >
      <span className="text-[8px] font-semibold uppercase leading-none tracking-wide text-ink-500">
        {region.label}
      </span>
      <span className="font-mono text-[11px] font-bold text-ink-900">{region.rawValue}</span>
    </button>
  )
}

function DecoBoxEl({ b }: { b: DecoBox }) {
  return (
    <div
      style={boxStyle(b)}
      className="absolute flex flex-col justify-between rounded border border-ink-200 bg-white p-1"
    >
      <span className="text-[8px] uppercase leading-none tracking-wide text-ink-400">{b.label}</span>
      <span className="font-mono text-[10px] text-ink-500">{b.value}</span>
    </div>
  )
}

const DECO: Record<TaxDocument['type'], DecoBox[]> = {
  'W-2': [
    { x: 51, y: 42, w: 44, h: 9, label: 'Box 3 — SS wages', value: '90,450.00' },
    { x: 5, y: 42, w: 44, h: 9, label: 'Box 4 — SS tax withheld', value: '5,607.00' },
    { x: 51, y: 53, w: 44, h: 9, label: 'Box 5 — Medicare wages', value: '90,450.00' },
    { x: 5, y: 53, w: 44, h: 9, label: 'Box 6 — Medicare tax', value: '1,311.00' },
    { x: 51, y: 72, w: 44, h: 11, label: 'Box 17 — State tax', value: '4,120.00' },
  ],
  '1099-INT': [
    { x: 5, y: 33, w: 42, h: 12, label: 'Payer TIN', value: '**-***4821' },
    { x: 51, y: 47, w: 44, h: 10, label: 'Box 4 — Fed tax withheld', value: '0.00' },
    { x: 5, y: 47, w: 42, h: 10, label: 'Box 8 — Tax-exempt interest', value: '0.00' },
  ],
  '1099-DIV': [
    { x: 5, y: 26, w: 42, h: 9, label: 'Payer', value: 'Vanguard' },
    { x: 5, y: 37, w: 42, h: 9, label: 'Recipient TIN', value: '**-***7731' },
    { x: 51, y: 59, w: 44, h: 9, label: 'Box 3 — Nondividend distr.', value: '0.00' },
    { x: 5, y: 59, w: 42, h: 9, label: 'Box 7 — Foreign tax paid', value: '38.00' },
  ],
  brokerage: [
    { x: 6, y: 70, w: 42, h: 7, label: 'Short-term proceeds', value: '12,050.00' },
    { x: 52, y: 70, w: 42, h: 7, label: 'Long-term proceeds', value: '33,150.00' },
  ],
}

const FORM_TITLE: Record<TaxDocument['type'], { code: string; name: string }> = {
  'W-2': { code: 'Form W-2', name: 'Wage and Tax Statement · 2025' },
  '1099-INT': { code: 'Form 1099-INT', name: 'Interest Income · 2025' },
  '1099-DIV': { code: 'Form 1099-DIV', name: 'Dividends and Distributions · 2025' },
  brokerage: { code: 'Consolidated 1099', name: 'Realized Gain / Loss Summary · 2025' },
}

export function Facsimile({
  doc,
  highlightedRegionIds,
  onRegionClick,
}: {
  doc: TaxDocument
  highlightedRegionIds: string[]
  onRegionClick?: (region: DocRegion) => void
}) {
  const title = FORM_TITLE[doc.type]
  const anyHighlighted = highlightedRegionIds.length > 0
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="relative aspect-[17/22] w-full overflow-hidden rounded-lg border border-ink-300 bg-white shadow-card">
        {/* Header chrome */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between border-b-2 border-ink-800 px-[4%] py-[2.5%]">
          <div>
            <div className="text-[13px] font-black uppercase tracking-tight text-ink-900">
              {title.code}
            </div>
            <div className="text-[9px] text-ink-500">{title.name}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-semibold text-ink-600">{doc.issuer}</div>
            <div className="text-[8px] text-ink-400">OMB No. 1545-0008</div>
          </div>
        </div>

        {/* Party block */}
        <div className="absolute left-[4%] top-[14%] w-[46%] rounded border border-ink-200 bg-ink-50 p-[2%]">
          <div className="text-[8px] uppercase tracking-wide text-ink-400">
            {doc.type === 'W-2' ? 'Employer' : 'Payer'}
          </div>
          <div className="text-[10px] font-semibold text-ink-800">{doc.issuer}</div>
          <div className="text-[8px] text-ink-400">Recipient: Sarah Chen</div>
        </div>

        {/* Decorative boxes */}
        {DECO[doc.type].map((b, i) => (
          <DecoBoxEl key={i} b={b} />
        ))}

        {/* Tracked, highlightable regions */}
        {doc.regions.map((r) => (
          <FormBox
            key={r.id}
            region={r}
            highlighted={highlightedRegionIds.includes(r.id)}
            dimmed={anyHighlighted}
            onClick={r.feedsFieldIds.length ? () => onRegionClick?.(r) : undefined}
          />
        ))}

        {/* brokerage gets a faux table caption */}
        {doc.type === 'brokerage' && (
          <div className="absolute inset-x-[6%] top-[44%] text-[9px] font-semibold uppercase tracking-wide text-ink-500">
            Realized gain / loss — totals
          </div>
        )}

        <div className="absolute inset-x-0 bottom-[1.5%] text-center text-[8px] text-ink-300">
          Styled mockup · not a real tax document · Greenfield prototype
        </div>
      </div>
    </div>
  )
}
