export const FIXED_CITY = 'São Luís - MA'

export const OTHER_OPTION = 'Outro'
export const GENDER_OTHER_OPTION = 'Outro / prefiro me autodescrever'
export const PRIOR_TREATMENT_YES = 'Sim'

export const SEX_AT_BIRTH_OPTIONS = [
  'Feminino',
  'Masculino',
  'Intersexo',
  'Prefiro não informar',
] as const

export const GENDER_IDENTITY_OPTIONS = [
  'Mulher cisgênero',
  'Homem cisgênero',
  'Mulher transgênero',
  'Homem transgênero',
  'Travesti',
  'Pessoa não binária',
  GENDER_OTHER_OPTION,
  'Prefiro não informar',
] as const

export const RELIGION_OPTIONS = [
  'Católica',
  'Evangélica',
  'Espírita',
  'Umbanda',
  'Candomblé',
  'Ateu(a)/sem religião',
  'Agnóstico(a)',
  'Prefiro não informar',
  OTHER_OPTION,
] as const

export const EDUCATION_OPTIONS = [
  'Fundamental incompleto',
  'Fundamental completo',
  'Médio incompleto',
  'Médio completo',
  'Superior incompleto',
  'Superior completo',
  'Pós-graduação',
  'Prefiro não informar',
  OTHER_OPTION,
] as const

export const MARITAL_STATUS_OPTIONS = [
  'Solteiro(a)',
  'Casado(a)',
  'União estável',
  'Separado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'Prefiro não informar',
  OTHER_OPTION,
] as const

export const EVOLUTION_OPTIONS = [
  'Repentino',
  'Gradual',
  'Não sei informar',
  OTHER_OPTION,
] as const

export const PRIOR_TREATMENT_OPTIONS = [
  PRIOR_TREATMENT_YES,
  'Não',
  'Prefiro não informar',
] as const

export function resolveSelectWithOther(
  option: string,
  otherText: string,
  otherOption: string = OTHER_OPTION,
): string {
  const selected = option.trim()
  if (!selected) return ''
  if (selected !== otherOption) return selected
  const detail = otherText.trim()
  return detail ? `${otherOption}: ${detail}` : otherOption
}

export function splitSelectWithOther(
  value: string,
  otherOption: string = OTHER_OPTION,
): { option: string; otherText: string } {
  const current = value.trim()
  if (!current) return { option: '', otherText: '' }
  if (current === otherOption) return { option: otherOption, otherText: '' }
  const prefix = `${otherOption}: `
  if (current.startsWith(prefix)) {
    return { option: otherOption, otherText: current.slice(prefix.length) }
  }
  return { option: current, otherText: '' }
}

/** Formato local: dd/mm/aaaa HH:mm */
export function formatLocalDateTime(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
