import { FIXED_CITY } from './options'

export type PersonIdentification = {
  name: string
  socialName: string
  birthDate: string
  sex: string
  genderIdentity: string
  maritalStatus: string
  address: string
  profession: string
  religion: string
  education: string
  phone: string
  email: string
}

export type AnamnesisPayload = {
  patient: PersonIdentification
  includeGuardian: boolean
  guardian?: PersonIdentification
  mainComplaint: string
  howItStarted: string
  suddenOrGradual: string
  symptoms: string
  observations: string
  priorTreatment: string
  medications: string
  therapyExpectations: string
  city: string
  date: string
  lgpdConsent: boolean
}

export type AnamnesisSubmitSuccess = {
  ok: true
  channels: {
    email: 'sent' | 'logged'
    whatsapp: 'sent' | 'logged'
  }
}

export type AnamnesisSubmitError = {
  ok: false
  error: string
  fieldErrors?: Record<string, string>
}

export type AnamnesisSubmitResponse = AnamnesisSubmitSuccess | AnamnesisSubmitError

export const emptyPersonIdentification = (): PersonIdentification => ({
  name: '',
  socialName: '',
  birthDate: '',
  sex: '',
  genderIdentity: '',
  maritalStatus: '',
  address: '',
  profession: '',
  religion: '',
  education: '',
  phone: '',
  email: '',
})

export const emptyAnamnesisPayload = (): AnamnesisPayload => ({
  patient: emptyPersonIdentification(),
  includeGuardian: false,
  mainComplaint: '',
  howItStarted: '',
  suddenOrGradual: '',
  symptoms: '',
  observations: '',
  priorTreatment: '',
  medications: '',
  therapyExpectations: '',
  city: FIXED_CITY,
  date: '',
  lgpdConsent: false,
})
