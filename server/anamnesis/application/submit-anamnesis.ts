import type { AnamnesisPayload, SubmitAnamnesisResult } from '../domain/types.js'
import { AnamnesisNotificationError } from '../domain/errors.js'
import type { EmailNotifier, WhatsAppNotifier } from './ports.js'
import { formatEmailMessage, formatWhatsAppMessage } from './format-message.js'
import { parseAndValidateAnamnesisPayload } from './validate-payload.js'

type Dependencies = {
  emailNotifier: EmailNotifier
  whatsappNotifier: WhatsAppNotifier
}

export function createSubmitAnamnesisUseCase(deps: Dependencies) {
  return {
    async execute(input: unknown): Promise<SubmitAnamnesisResult> {
      const payload: AnamnesisPayload = parseAndValidateAnamnesisPayload(input)
      const emailMessage = formatEmailMessage(payload)
      const whatsappMessage = formatWhatsAppMessage(payload)

      try {
        const [email, whatsapp] = await Promise.all([
          deps.emailNotifier.send(emailMessage, payload),
          deps.whatsappNotifier.send(whatsappMessage, payload),
        ])
        return { email, whatsapp }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Falha ao notificar e-mail/WhatsApp.'
        throw new AnamnesisNotificationError(message)
      }
    },
  }
}

export type SubmitAnamnesisUseCase = ReturnType<typeof createSubmitAnamnesisUseCase>
