export type Lead = {
  id: string
  profileSlug: string
  name: string
  phone: string
  note?: string
  createdAt: string
  source: 'whatsapp_cta'
}

export type LeadInput = {
  profileSlug: string
  name: string
  phone: string
  note?: string
}

export type LeadService = {
  save: (input: LeadInput) => Lead
  list: (profileSlug?: string) => Lead[]
}
