import type { AnamnesisPayload, PersonIdentification } from '../../domain/model.js'
import { AnamnesisValidationError } from '../../domain/errors.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FIXED_CITY = 'São Luís - MA'

function requireText(
  value: unknown,
  key: string,
  label: string,
  errors: Record<string, string>,
) {
  if (typeof value !== 'string' || !value.trim()) {
    errors[key] = `${label} é obrigatório.`
  }
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function validatePersonMinimal(
  person: unknown,
  prefix: string,
  errors: Record<string, string>,
  options: { requireName: boolean; requirePhone: boolean },
) {
  if (!person || typeof person !== 'object') {
    errors[prefix] = 'Dados incompletos.'
    return
  }

  const data = person as Record<string, unknown>

  if (options.requireName) {
    requireText(data.name, `${prefix}.name`, 'Nome', errors)
  }
  if (options.requirePhone) {
    requireText(data.phone, `${prefix}.phone`, 'Telefone', errors)
  }

  if (
    typeof data.email === 'string' &&
    data.email.trim() &&
    !EMAIL_RE.test(data.email.trim())
  ) {
    errors[`${prefix}.email`] = 'E-mail inválido.'
  }
}

function readPerson(person: unknown): PersonIdentification {
  const data = (person ?? {}) as Record<string, unknown>
  return {
    name: asString(data.name),
    socialName: asString(data.socialName),
    birthDate: asString(data.birthDate),
    sex: asString(data.sex),
    genderIdentity: asString(data.genderIdentity),
    maritalStatus: asString(data.maritalStatus),
    address: asString(data.address),
    profession: asString(data.profession),
    religion: asString(data.religion),
    education: asString(data.education),
    phone: asString(data.phone),
    email: asString(data.email),
  }
}

export function parseAndValidateAnamnesisPayload(input: unknown): AnamnesisPayload {
  if (!input || typeof input !== 'object') {
    throw new AnamnesisValidationError({ _: 'Payload inválido.' })
  }

  const raw = input as Record<string, unknown>
  const errors: Record<string, string> = {}

  validatePersonMinimal(raw.patient, 'patient', errors, {
    requireName: true,
    requirePhone: true,
  })

  const includeGuardian = Boolean(raw.includeGuardian)
  if (includeGuardian) {
    validatePersonMinimal(raw.guardian, 'guardian', errors, {
      requireName: true,
      requirePhone: false,
    })
  }

  if (raw.lgpdConsent !== true) {
    errors.lgpdConsent = 'É necessário autorizar o envio dos dados.'
  }

  const date = asString(raw.date)
  if (!date) {
    errors.date = 'Data e hora do envio são obrigatórias.'
  }

  if (Object.keys(errors).length > 0) {
    throw new AnamnesisValidationError(errors)
  }

  return {
    patient: readPerson(raw.patient),
    includeGuardian,
    guardian: includeGuardian ? readPerson(raw.guardian) : undefined,
    mainComplaint: asString(raw.mainComplaint),
    howItStarted: asString(raw.howItStarted),
    suddenOrGradual: asString(raw.suddenOrGradual),
    symptoms: asString(raw.symptoms),
    observations: asString(raw.observations),
    priorTreatment: asString(raw.priorTreatment),
    medications: asString(raw.medications),
    therapyExpectations: asString(raw.therapyExpectations),
    city: FIXED_CITY,
    date,
    lgpdConsent: true,
  }
}
