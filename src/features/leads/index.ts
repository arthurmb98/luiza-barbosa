export type { Lead, LeadInput, LeadService } from '@/features/leads/domain/lead'
export type { LeadStore } from '@/features/leads/application/lead-store'
export { localLeadStore as leadService } from '@/features/leads/infrastructure/local-lead-store'
