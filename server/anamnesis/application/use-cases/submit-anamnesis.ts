import type {
  AnamnesisPayload,
  SubmitAnamnesisResult,
} from '../../domain/model.js'
import { AnamnesisNotificationError } from '../../domain/errors.js'
import type { EmailNotifier } from '../ports/email-notifier.js'
import type { WhatsAppNotifier } from '../ports/whatsapp-notifier.js'
import {
  buildAnamnesisPdf,
  bytesToBase64,
} from '../services/build-anamnesis-pdf.js'
import {
  formatEmailMessage,
  formatWhatsAppMessage,
} from '../services/format-message.js'
import { parseAndValidateAnamnesisPayload } from '../services/validate-payload.js'

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
      const pdf = await buildAnamnesisPdf(payload)

      emailMessage.attachments = [
        {
          filename: pdf.filename,
          contentBase64: bytesToBase64(pdf.bytes),
          contentType: 'application/pdf',
        },
      ]

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

export type SubmitAnamnesisUseCase = ReturnType<
  typeof createSubmitAnamnesisUseCase
>
