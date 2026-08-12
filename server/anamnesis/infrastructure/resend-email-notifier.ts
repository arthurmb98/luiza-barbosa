import type { AnamnesisPayload, NotificationChannelResult } from '../domain/types.js'
import { AnamnesisNotificationError } from '../domain/errors.js'
import type { EmailMessage, EmailNotifier } from '../application/ports.js'

type ResendConfig = {
  apiKey: string
  from: string
  to: string
}

export class ResendEmailNotifier implements EmailNotifier {
  private readonly config: ResendConfig

  constructor(config: ResendConfig) {
    this.config = config
  }

  async send(
    message: EmailMessage,
    _payload: AnamnesisPayload,
  ): Promise<NotificationChannelResult> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.config.from,
        to: [this.config.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AnamnesisNotificationError(
        `Resend falhou (${response.status}): ${detail.slice(0, 200)}`,
      )
    }

    return 'sent'
  }
}
