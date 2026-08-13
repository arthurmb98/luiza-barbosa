/** Digitos apenas. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Máscara BR: (00) 00000-0000 ou (00) 0000-0000
 */
export function formatPhoneBr(value: string): string {
  const digits = digitsOnly(value).slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Normaliza e-mail enquanto digita: minúsculas, sem espaços,
 * só caracteres usuais de e-mail.
 */
export function formatEmailInput(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9.@_+-]/g, '')
}
