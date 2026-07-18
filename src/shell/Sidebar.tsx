import { NavLink, useLocation } from 'react-router-dom'
import { navForRole } from './nav'
import { useEffectiveRole } from '../state/AppState'
import { Icon } from '../components/ui/Icon'

export function Sidebar() {
  const role = useEffectiveRole()
  const sections = navForRole(role)
  const loc = useLocation()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-ink-200 bg-white">
      <div className="flex h-14 items-center gap-2 border-b border-ink-100 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
          <span className="text-sm font-bold">G</span>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-ink-800">Greenfield</div>
          <div className="text-2xs text-ink-400">AI Tax Platform</div>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <div className="mb-1.5 px-2 text-2xs font-semibold uppercase tracking-wide text-ink-400">
                {section.heading}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.matchPrefix
                  ? loc.pathname.startsWith(item.matchPrefix)
                  : loc.pathname === item.to
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={[
                      'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition',
                      active
                        ? 'bg-brand-50 text-brand-800'
                        : 'text-ink-600 hover:bg-ink-50 hover:text-ink-800',
                    ].join(' ')}
                  >
                    <Icon
                      path={item.icon}
                      size={18}
                      className={active ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-500'}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.challenge && (
                      <span className="rounded bg-ink-100 px-1 text-[9px] font-bold text-ink-400 group-hover:bg-ink-200">
                        {item.challenge}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-100 px-3 py-3 text-2xs text-ink-400">
        Prototype · fake data · no backend
      </div>
    </aside>
  )
}
