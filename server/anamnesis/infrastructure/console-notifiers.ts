import type { AnamnesisPayload, NotificationChannelResult } from '../domain/types'
import type { EmailMessage, EmailNotifier, WhatsAppMessage, WhatsAppNotifier } from '../application/ports'

export class ConsoleEmailNotifier implements EmailNotifier {
  async send(
    message: EmailMessage,
    _payload: AnamnesisPayload,
  ): Promise<NotificationChannelResult> {
    console.info('[anamnesis:email:console]', {
      subject: message.subject,
      textPreview: message.text.slice(0, 280),
    })
    return 'logged'
  }
}

export class ConsoleWhatsAppNotifier implements WhatsAppNotifier {
  async send(
    message: WhatsAppMessage,
    _payload: AnamnesisPayload,
  ): Promise<NotificationChannelResult> {
    console.info('[anamnesis:whatsapp:console]', {
      textPreview: message.text.slice(0, 280),
      length: message.text.length,
    })
    return 'logged'
  }
}
