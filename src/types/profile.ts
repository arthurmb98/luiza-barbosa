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
  /** Path to a validation QR code image (e.g. under /qrcodes). */
  qrCode?: string
  /** Short title shown above the QR (defaults based on registry type). */
  qrCodeLabel?: string
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
