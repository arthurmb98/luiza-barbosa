import type { AnamnesisPayload, NotificationChannelResult } from '../domain/types.js'

export type EmailAttachment = {
  filename: string
  contentBase64: string
  contentType?: string
}

export type EmailMessage = {
  subject: string
  text: string
  html: string
  attachments?: EmailAttachment[]
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
