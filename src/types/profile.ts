export type RegistryType =
  | 'CRP'
  | 'CRM'
  | 'COREN'
  | 'RNTP'
  | 'CRO'
  | 'CRF'
  | 'CREFITO'
  | 'OUTRO'

export type ProfessionalRegistry = {
  type: RegistryType
  number: string
  label?: string
}

export type Profile = {
  slug: string
  name: string
  profession: string
  tagline?: string
  specialties: string[]
  about: string
  photo: string
  registry: ProfessionalRegistry
  whatsapp: string
  whatsappMessage: string
  email?: string
  instagram?: string
}
