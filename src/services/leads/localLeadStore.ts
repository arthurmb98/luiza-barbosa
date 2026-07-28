import type { Lead, LeadInput, LeadService } from '@/types/lead'
import { digitsOnly } from '@/lib/utils'

const STORAGE_KEY = 'perfil-saude:leads'

function readLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Lead[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

export const localLeadStore: LeadService = {
  save(input: LeadInput): Lead {
    const lead: Lead = {
      id: crypto.randomUUID(),
      profileSlug: input.profileSlug,
      name: input.name.trim(),
      phone: digitsOnly(input.phone),
      note: input.note?.trim() || undefined,
      createdAt: new Date().toISOString(),
      source: 'whatsapp_cta',
    }

    const leads = readLeads()
    leads.push(lead)
    writeLeads(leads)
    return lead
  },

  list(profileSlug?: string): Lead[] {
    const leads = readLeads()
    if (!profileSlug) return leads
    return leads.filter((lead) => lead.profileSlug === profileSlug)
  },
}
