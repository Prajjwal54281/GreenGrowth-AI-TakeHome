import { useState, type ReactNode } from 'react'

/* Lightweight hover/focus tooltip. Positioned above by default. Used heavily
   by the affordance system to explain WHY a value is in its state (Challenge 08)
   and the AI confidence rationale (Challenge 10). */
export function Tooltip({
  content,
  children,
  width = 240,
  align = 'center',
}: {
  content: ReactNode
  children: ReactNode
  width?: number
  align?: 'center' | 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const alignClass =
    align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={`absolute bottom-full z-50 mb-2 ${alignClass} rounded-lg bg-ink-900 px-3 py-2 text-2xs leading-relaxed text-white shadow-panel`}
          style={{ width }}
        >
          {content}
        </span>
      )}
    </span>
  )
}
