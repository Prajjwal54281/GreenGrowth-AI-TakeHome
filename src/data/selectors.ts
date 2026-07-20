/* Read helpers over the seeded world. Pure functions — pass the live world in. */

import type { SeedWorld, TaxReturn, Persona } from './types'

export function getReturn(w: SeedWorld, id: string): TaxReturn | undefined {
  return w.returns.find((r) => r.id === id)
}
export function getClient(w: SeedWorld, id: string) {
  return w.clients.find((c) => c.id === id)
}
export function clientName(w: SeedWorld, clientId: string): string {
  return getClient(w, clientId)?.name ?? 'Unknown client'
}
export function fieldsFor(w: SeedWorld, returnId: string) {
  return w.fields.filter((f) => f.returnId === returnId)
}
export function fieldById(w: SeedWorld, id: string) {
  return w.fields.find((f) => f.id === id)
}
export function docsFor(w: SeedWorld, returnId: string) {
  return w.documents.filter((d) => d.returnId === returnId)
}
export function docById(w: SeedWorld, id: string) {
  return w.documents.find((d) => d.id === id)
}
export function regionById(w: SeedWorld, regionId: string) {
  for (const d of w.documents) {
    const r = d.regions.find((rg) => rg.id === regionId)
    if (r) return { region: r, doc: d }
  }
  return undefined
}
/** all fields fed by a given region (reverse traceability) */
export function fieldsFedByRegion(w: SeedWorld, regionId: string) {
  return w.fields.filter((f) => f.sourceRegionIds.includes(regionId))
}
export function threadsFor(w: SeedWorld, returnId: string) {
  return w.threads.filter((t) => t.returnId === returnId)
}
export function threadById(w: SeedWorld, id: string) {
  return w.threads.find((t) => t.id === id)
}
export function requestsFor(w: SeedWorld, returnId: string) {
  return w.requests.filter((r) => r.returnId === returnId)
}
export function questionnaireFor(w: SeedWorld, returnId: string) {
  return w.questionnaire.filter((q) => q.returnId === returnId)
}
export function warningsFor(w: SeedWorld, returnId: string) {
  return w.warnings.filter((wn) => wn.returnId === returnId)
}

/** The return the current persona is looking at "as a client" (Challenge 05).
 *  A client sees their own return; firm staff in "My taxes" mode see THEIR
 *  personal return, not the demo client's. Staff previewing the client
 *  experience fall back to the fully-seeded hero return. */
export function personalReturnFor(w: SeedWorld, persona: Persona): TaxReturn | undefined {
  if (!persona.personalClientId) return undefined
  return w.returns.find((r) => r.clientId === persona.personalClientId)
}
