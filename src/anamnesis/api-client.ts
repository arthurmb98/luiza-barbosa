import type { AnamnesisPayload, AnamnesisSubmitResponse } from './types'

export async function submitAnamnesis(
  payload: AnamnesisPayload,
): Promise<AnamnesisSubmitResponse> {
  const response = await fetch('/api/anamnesis/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  let data: AnamnesisSubmitResponse
  try {
    data = (await response.json()) as AnamnesisSubmitResponse
  } catch {
    return {
      ok: false,
      error: 'Não foi possível interpretar a resposta do servidor.',
    }
  }

  if (!response.ok && data.ok !== false) {
    return {
      ok: false,
      error: `Falha ao enviar anamnese (${response.status}).`,
    }
  }

  return data
}
