import type { AnamnesisPayload, NotificationChannelResult } from '../domain/types.js'

export type EmailMessage = {
  subject: string
  text: string
  html: string
}

export type WhatsAppMessage = {
  text: string
}

export interface EmailNotifier {
  send(message: EmailMessage, payload: AnamnesisPayload): Promise<NotificationChannelResult>
}

export interface WhatsAppNotifier {
  send(message: WhatsAppMessage, payload: AnamnesisPayload): Promise<NotificationChannelResult>
}
