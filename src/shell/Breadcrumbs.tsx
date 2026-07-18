import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../state/AppState'
import { getReturn, clientName, threadById } from '../data/selectors'
import { Icon, ICONS } from '../components/ui/Icon'

/* Breadcrumbs derived from the real route (Challenge 04). Object ids are
   resolved to human labels from the world so a deep link is legible. */
export function Breadcrumbs() {
  const loc = useLocation()
  const { world } = useApp()
  const parts = loc.pathname.split('/').filter(Boolean)

  const crumbs: { label: string; to: string }[] = []
  let acc = ''

  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i]
    acc += '/' + seg
    let label = seg

    if (seg === 'dashboard') label = 'Dashboard'
    else if (seg === 'home') label = 'Home'
    else if (seg === 'returns' && i === 0) label = 'Returns'
    else if (seg === 'messages') label = 'Messages'
    else if (seg === 'tasks') label = 'Tasks'
    else if (seg === 'design') label = 'Design system'
    else if (seg === 'review') label = 'Review'
    else if (seg === 'items') label = 'Items'
    else if (seg === 'status') label = 'Status'
    else if (seg === 'threads') continue // fold into the thread label
    else if (seg.startsWith('RET-')) {
      const ret = getReturn(world, seg)
      label = ret ? `${clientName(world, ret.clientId)} · ${seg}` : seg
    } else if (seg.startsWith('TH-')) {
      label = threadById(world, seg)?.subject ?? seg
    } else if (seg.startsWith('FLD-')) {
      const f = world.fields.find((x) => x.id === seg)
      label = f ? f.label : seg
    } else if (parts[i - 1] === 'threads') {
      label = threadById(world, seg)?.subject ?? seg
    }

    crumbs.push({ label, to: acc })
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-ink-500">
      <Link to="/" className="text-ink-400 hover:text-ink-700">
        <Icon path={ICONS.dashboard} size={13} />
      </Link>
      {crumbs.map((c, i) => (
        <span key={c.to} className="flex items-center gap-1">
          <Icon path={ICONS.chevronRight} size={12} className="text-ink-300" />
          {i === crumbs.length - 1 ? (
            <span className="font-semibold text-ink-700">{c.label}</span>
          ) : (
            <Link to={c.to} className="hover:text-ink-700">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
