import type { AnamnesisPayload, PersonIdentification } from './types'

export type AnamnesisStep = 1 | 2 | 3

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function requireText(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label} é obrigatório.`
  return undefined
}

function validatePersonMinimal(
  person: PersonIdentification,
  prefix: string,
  requireName: boolean,
  requirePhone: boolean,
): Record<string, string> {
  const errors: Record<string, string> = {}

  if (requireName) {
    const message = requireText(person.name, 'Nome')
    if (message) errors[`${prefix}.name`] = message
  }

  if (requirePhone) {
    const message = requireText(person.phone, 'Telefone')
    if (message) errors[`${prefix}.phone`] = message
  }

  if (person.email.trim() && !EMAIL_RE.test(person.email.trim())) {
    errors[`${prefix}.email`] = 'E-mail inválido.'
  }

  return errors
}

export function validateStep(
  step: AnamnesisStep,
  data: AnamnesisPayload,
): Record<string, string> {
  if (step === 1) {
    return validatePersonMinimal(data.patient, 'patient', true, true)
  }

  if (step === 2) {
    if (!data.includeGuardian) return {}
    return validatePersonMinimal(
      data.guardian ?? emptyGuardian(),
      'guardian',
      true,
      false,
    )
  }

  const errors: Record<string, string> = {}
  if (!data.lgpdConsent) {
    errors.lgpdConsent = 'É necessário autorizar o envio dos dados.'
  }
  return errors
}

export function validateAnamnesisPayload(
  data: AnamnesisPayload,
): Record<string, string> {
  return {
    ...validateStep(1, data),
    ...validateStep(2, data),
    ...validateStep(3, data),
  }
}

function emptyGuardian(): PersonIdentification {
  return {
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
  }
}
