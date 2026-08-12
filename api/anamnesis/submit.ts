import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  AnamnesisNotificationError,
  AnamnesisValidationError,
} from '../../server/anamnesis/domain/errors'
import { createSubmitAnamnesisUseCase } from '../../server/anamnesis/application/submit-anamnesis'
import { createNotifiers } from '../../server/anamnesis/infrastructure/create-notifiers'
import { isRateLimited } from '../../server/anamnesis/infrastructure/rate-limit'

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return req.socket?.remoteAddress || 'unknown'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Método não permitido.' })
    return
  }

  const ip = clientIp(req)
  if (isRateLimited(ip)) {
    res.status(429).json({
      ok: false,
      error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    })
    return
  }

  const useCase = createSubmitAnamnesisUseCase(createNotifiers(process.env))

  try {
    const result = await useCase.execute(req.body)
    res.status(200).json({
      ok: true,
      channels: {
        email: result.email,
        whatsapp: result.whatsapp,
      },
    })
  } catch (error) {
    if (error instanceof AnamnesisValidationError) {
      res.status(400).json({
        ok: false,
        error: error.message,
        fieldErrors: error.fieldErrors,
      })
      return
    }

    if (error instanceof AnamnesisNotificationError) {
      console.error(
        '[anamnesis:submit] notification failed',
        error instanceof Error ? error.message : error,
      )
      res.status(502).json({
        ok: false,
        error: 'Não foi possível enviar a anamnese agora. Tente novamente.',
      })
      return
    }

    console.error('[anamnesis:submit] unexpected error')
    res.status(500).json({
      ok: false,
      error: 'Erro interno ao processar a anamnese.',
    })
  }
}
