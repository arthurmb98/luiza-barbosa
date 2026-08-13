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

export type NotificationChannelResult = 'sent' | 'logged' | 'failed'

export type SubmitAnamnesisResult = {
  email: NotificationChannelResult
  whatsapp: NotificationChannelResult
}
