import type { AnamnesisPayload, NotificationChannelResult } from '../../domain/model.js'
import { AnamnesisNotificationError } from '../../domain/errors.js'
import type { WhatsAppMessage, WhatsAppNotifier } from '../../application/ports/index.js'

type WhatsAppCloudConfig = {
  token: string
  phoneNumberId: string
  toPhone: string
  /** Template name required to message users outside the 24h window. */
  templateName: string
  templateLanguage: string
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export class WhatsAppCloudNotifier implements WhatsAppNotifier {
  private readonly config: WhatsAppCloudConfig

  constructor(config: WhatsAppCloudConfig) {
    this.config = config
  }

  async send(
    message: WhatsAppMessage,
    _payload: AnamnesisPayload,
  ): Promise<NotificationChannelResult> {
    const url = `https://graph.facebook.com/v21.0/${this.config.phoneNumberId}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: digitsOnly(this.config.toPhone),
        type: 'template',
        template: {
          name: this.config.templateName,
          language: { code: this.config.templateLanguage },
          components: [
            {
              type: 'body',
              parameters: message.templateBodyParameters.map((text) => ({
                type: 'text',
                text,
              })),
            },
          ],
        },
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new AnamnesisNotificationError(
        `WhatsApp Cloud API falhou (${response.status}): ${detail.slice(0, 300)}`,
      )
    }

    return 'sent'
  }
}
