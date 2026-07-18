import { createContext, useContext, useState, type ReactNode } from 'react'

interface DemoGuideValue {
  open: boolean
  setOpen: (v: boolean) => void
  toggle: () => void
}
const Ctx = createContext<DemoGuideValue | null>(null)

export function DemoGuideProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <Ctx.Provider value={{ open, setOpen, toggle: () => setOpen((v) => !v) }}>
      {children}
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemoGuide() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDemoGuide within provider')
  return ctx
}
