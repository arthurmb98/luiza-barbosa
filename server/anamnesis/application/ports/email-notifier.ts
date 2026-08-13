import type {
  AnamnesisPayload,
  NotificationChannelResult,
} from '../../domain/model.js'

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

export interface EmailNotifier {
  send(
    message: EmailMessage,
    payload: AnamnesisPayload,
  ): Promise<NotificationChannelResult>
}
