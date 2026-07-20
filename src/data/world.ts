/* Assembles the single seeded world from the hero return + generated volume. */

import type { SeedWorld } from './types'
import { PERSONAS } from './personas'
import {
  HERO_CLIENTS,
  HERO_RETURN,
  HERO_DOCUMENTS,
  HERO_FIELDS,
  HERO_THREADS,
  HERO_REQUESTS,
  PERSONAL_RETURN,
  PERSONAL_REQUESTS,
  BUSINESS_RETURN,
  BUSINESS_REQUESTS,
  BUSINESS_THREADS,
} from './hero'
import { generateBook, heroQuestionnaire, heroWarnings } from './generate'

const book = generateBook()

export const WORLD: SeedWorld = {
  personas: PERSONAS,
  clients: [...HERO_CLIENTS, ...book.clients],
  returns: [HERO_RETURN, PERSONAL_RETURN, BUSINESS_RETURN, ...book.returns],
  documents: HERO_DOCUMENTS,
  fields: HERO_FIELDS,
  threads: [...HERO_THREADS, ...BUSINESS_THREADS],
  requests: [...HERO_REQUESTS, ...PERSONAL_REQUESTS, ...BUSINESS_REQUESTS],
  questionnaire: heroQuestionnaire(),
  warnings: heroWarnings(),
}
