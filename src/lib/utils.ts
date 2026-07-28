import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const params = new URLSearchParams({ text: message })
  return `https://wa.me/${digitsOnly(phone)}?${params.toString()}`
}
