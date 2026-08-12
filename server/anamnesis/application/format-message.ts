import type { AnamnesisPayload, PersonIdentification } from '../domain/types.js'
import type { EmailMessage, WhatsAppMessage } from './ports.js'

const WHATSAPP_MAX_CHARS = 3500

function display(value: string): string {
  return value.trim() || '—'
}

function personRows(person: PersonIdentification): Array<[string, string]> {
  const rows: Array<[string, string]> = [['Nome', person.name]]
  if (person.socialName.trim()) {
    rows.unshift(['Nome social', person.socialName])
  }
  rows.push(
    ['Data de nascimento', display(person.birthDate)],
    ['Sexo atribuído ao nascer', display(person.sex)],
    ['Identidade de gênero', display(person.genderIdentity)],
    ['Estado civil', display(person.maritalStatus)],
    ['Endereço', display(person.address)],
    ['Profissão', display(person.profession)],
    ['Religião', display(person.religion)],
    ['Escolaridade', display(person.education)],
    ['Telefone', display(person.phone)],
    ['E-mail', display(person.email)],
  )
  return rows
}

function personBlock(title: string, person: PersonIdentification): string {
  return [title, ...personRows(person).map(([label, value]) => `${label}: ${value}`)].join(
    '\n',
  )
}

function personHtml(title: string, person: PersonIdentification): string {
  const rows = personRows(person)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b6164;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:4px 0;color:#2a2426;">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  return `<h2 style="font-size:16px;margin:24px 0 8px;color:#9e6b73;">${escapeHtml(title)}</h2><table>${rows}</table>`
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function section(title: string, body: string): string {
  return `${title}\n${display(body)}`
}

export function formatEmailMessage(payload: AnamnesisPayload): EmailMessage {
  const displayName = payload.patient.socialName.trim() || payload.patient.name
  const subject = `Nova anamnese online — ${displayName}`

  const textParts = [
    'Ficha de Anamnese (envio online)',
    '',
    personBlock('IDENTIFICAÇÃO PESSOAL', payload.patient),
    '',
  ]

  if (payload.includeGuardian && payload.guardian) {
    textParts.push(
      personBlock('IDENTIFICAÇÃO DO RESPONSÁVEL', payload.guardian),
      '',
    )
  }

  textParts.push(
    section('QUEIXA PRINCIPAL', payload.mainComplaint),
    '',
    section('COMO COMEÇOU', payload.howItStarted),
    '',
    section('FOI REPENTINO OU GRADUAL?', payload.suddenOrGradual),
    '',
    section('SINTOMAS', payload.symptoms),
    '',
    section('ACOMPANHAMENTO PRÉVIO', payload.priorTreatment),
    '',
    section('MEDICAMENTOS EM USO', payload.medications),
    '',
    section('O QUE ESPERA DA TERAPIA', payload.therapyExpectations),
    '',
    section('OBSERVAÇÕES', payload.observations),
    '',
    `Cidade: ${payload.city}`,
    `Data e hora: ${payload.date}`,
    '',
    'Consentimento LGPD: autorizado pelo paciente.',
  )

  const htmlParts = [
    '<div style="font-family:DM Sans,Arial,sans-serif;line-height:1.5;max-width:640px;">',
    '<h1 style="font-size:22px;color:#2a2426;margin:0 0 8px;">Ficha de Anamnese</h1>',
    '<p style="color:#6b6164;margin:0 0 16px;">Envio automático pelo site</p>',
    personHtml('Identificação pessoal', payload.patient),
  ]

  if (payload.includeGuardian && payload.guardian) {
    htmlParts.push(personHtml('Identificação do responsável', payload.guardian))
  }

  const textSections: Array<[string, string]> = [
    ['Queixa principal', payload.mainComplaint],
    ['Como começou', payload.howItStarted],
    ['Foi repentino ou gradual?', payload.suddenOrGradual],
    ['Sintomas', payload.symptoms],
    ['Acompanhamento prévio', payload.priorTreatment],
    ['Medicamentos em uso', payload.medications],
    ['O que espera da terapia', payload.therapyExpectations],
    ['Observações', payload.observations],
  ]

  for (const [title, body] of textSections) {
    htmlParts.push(
      `<h2 style="font-size:16px;margin:24px 0 8px;color:#9e6b73;">${escapeHtml(title)}</h2>`,
      `<p style="white-space:pre-wrap;margin:0;color:#2a2426;">${escapeHtml(display(body))}</p>`,
    )
  }

  htmlParts.push(
    `<p style="margin:24px 0 0;color:#2a2426;"><strong>Cidade:</strong> ${escapeHtml(payload.city)} &nbsp;|&nbsp; <strong>Data e hora:</strong> ${escapeHtml(payload.date)}</p>`,
    '<p style="margin:12px 0 0;color:#6b6164;font-size:13px;">Consentimento LGPD: autorizado pelo paciente.</p>',
    '</div>',
  )

  return {
    subject,
    text: textParts.join('\n'),
    html: htmlParts.join(''),
  }
}

export function formatWhatsAppMessage(payload: AnamnesisPayload): WhatsAppMessage {
  const email = formatEmailMessage(payload)
  let text = `*Nova anamnese online*\n\n${email.text}`

  if (text.length > WHATSAPP_MAX_CHARS) {
    text = `${text.slice(0, WHATSAPP_MAX_CHARS - 40)}\n\n… (mensagem truncada; veja o e-mail completo)`
  }

  return { text }
}
