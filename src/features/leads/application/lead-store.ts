import type { Lead, LeadInput } from '@/features/leads/domain/lead'

/** Port for persisting WhatsApp CTA leads (local or remote). */
export type LeadStore = {
  save: (input: LeadInput) => Lead
  list: (profileSlug?: string) => Lead[]
}
