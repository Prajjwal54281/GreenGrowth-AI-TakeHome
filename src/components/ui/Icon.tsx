/** Minimal inline-SVG icon. `path` is 24x24 viewBox path data. */
export function Icon({
  path,
  size = 16,
  className = '',
}: {
  path: string
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

/* A small library of UI glyphs used across the shell. */
export const ICONS = {
  dashboard: 'M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z',
  returns: 'M4 4h16v4H4V4Zm0 6h16v4H4v-4Zm0 6h10v4H4v-4Z',
  review: 'M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5Zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  messages: 'M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z',
  tasks: 'M22 5.2 20.6 3.8 10 14.4l-4.6-4.6L4 11.2 10 17.2z M3 5h9v2H3zM3 11h5v2H3zM3 17h5v2H3z',
  status: 'M13 2v8h8a9 9 0 1 0-8-8Zm-2 2a9 9 0 1 0 9 9h-9V4Z',
  items: 'M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z',
  search: 'M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5Zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z',
  chevronRight: 'M8.6 4.6 7.2 6l6 6-6 6 1.4 1.4L16 12z',
  chevronDown: 'M7.4 8.6 6 10l6 6 6-6-1.4-1.4L12 13.2z',
  close: 'M18.3 5.7 12 12l6.3 6.3-1.4 1.4L12 13.4l-6.3 6.3-1.4-1.4L10.6 12 4.3 5.7l1.4-1.4L12 10.6l6.3-6.3z',
  link: 'M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12ZM8 13h8v-2H8v2Zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10Z',
  arrowLeft: 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z',
  guide: 'M12 2 2 7l10 5 10-5-10-5Zm0 7.2L5.7 6 12 3.8 18.3 6 12 9.2ZM4 10v5c0 2.2 3.6 4 8 4s8-1.8 8-4v-5l-8 4-8-4Z',
  warning: 'M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z',
  flag: 'M6 2v20H4V2h2Zm2 1h11l-2 4 2 4H8V3Z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 11H7v-2h4V6h2v7Z',
  check: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
  person: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4 0-9 2-9 6v2h18v-2c0-4-5-6-9-6Z',
  building: 'M4 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18h6v-8h-4V4h4a2 2 0 0 1 2 2v16H4Zm4-4h2v2H8v-2Zm0-4h2v2H8v-2Zm0-4h2v2H8V10Z',
  swap: 'M7 7h10l-3-3 1.4-1.4L20.8 8 15.4 13.4 14 12l3-3H7V7Zm10 10H7l3 3-1.4 1.4L3.2 16l5.4-5.4L10 12l-3 3h10v2Z',
}
