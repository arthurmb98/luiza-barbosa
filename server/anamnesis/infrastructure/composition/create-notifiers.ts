import type { EmailNotifier } from '../../application/ports/email-notifier.js'
import type { WhatsAppNotifier } from '../../application/ports/whatsapp-notifier.js'
import { ConsoleEmailNotifier } from '../email/console-email-notifier.js'
import { ResendEmailNotifier } from '../email/resend-email-notifier.js'
import { ConsoleWhatsAppNotifier } from '../whatsapp/console-whatsapp-notifier.js'
import { WhatsAppCloudNotifier } from '../whatsapp/whatsapp-cloud-notifier.js'

export type NotifierBundle = {
  emailNotifier: EmailNotifier
  whatsappNotifier: WhatsAppNotifier
}

export function createNotifiers(
  env: NodeJS.ProcessEnv = process.env,
): NotifierBundle {
  const emailTo =
    env.ANAMNESIS_TO_EMAIL?.trim() || 'luizatinoco2606@gmail.com'
  const whatsappTo =
    env.ANAMNESIS_TO_WHATSAPP?.trim() || '5598981263501'

  const resendKey = env.RESEND_API_KEY?.trim()
  const resendFrom =
    env.RESEND_FROM_EMAIL?.trim() || 'Anamnese <onboarding@resend.dev>'

  const emailNotifier = resendKey
    ? new ResendEmailNotifier({
        apiKey: resendKey,
        from: resendFrom,
        to: emailTo,
      })
    : new ConsoleEmailNotifier()

  const waToken = env.WHATSAPP_TOKEN?.trim()
  const waPhoneId = env.WHATSAPP_PHONE_NUMBER_ID?.trim()
  const waTemplateName =
    env.WHATSAPP_TEMPLATE_NAME?.trim() || 'anamnese_nova_alerta'
  const waTemplateLanguage =
    env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || 'pt_BR'

  const whatsappNotifier =
    waToken && waPhoneId
      ? new WhatsAppCloudNotifier({
          token: waToken,
          phoneNumberId: waPhoneId,
          toPhone: whatsappTo,
          templateName: waTemplateName,
          templateLanguage: waTemplateLanguage,
        })
      : new ConsoleWhatsAppNotifier()

  return { emailNotifier, whatsappNotifier }
}
