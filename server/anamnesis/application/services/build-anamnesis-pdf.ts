import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { AnamnesisPayload, PersonIdentification } from '../../domain/model.js'

const A4: [number, number] = [595.28, 841.89]
const MARGIN = 48
const PAGE_BG = rgb(1, 0.97, 0.97)
const TEAL = rgb(0.2, 0.45, 0.48)
const INK = rgb(0.2, 0.16, 0.17)
const MUTED = rgb(0.42, 0.38, 0.39)
const RULE = rgb(0.88, 0.84, 0.83)

function display(value: string): string {
  const raw = value.trim() || '-'
  return toWinAnsiSafe(raw)
}

/** Helvetica (WinAnsi) não cobre todos os glyphs; normaliza o texto do PDF. */
function toWinAnsiSafe(value: string): string {
  return value
    .normalize('NFC')
    .replace(/[—–−]/g, '-')
    .replace(/[“”„]/g, '"')
    .replace(/[‘’‚]/g, "'")
    .replace(/…/g, '...')
    .replace(/[^\t\n\r\u0020-\u007E\u00A0-\u00FF]/g, '?')
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim() || '—'
  const words = normalized.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next
      continue
    }
    if (current) lines.push(current)
    current = word
  }
  if (current) lines.push(current)
  return lines.length > 0 ? lines : ['—']
}

type PdfWriter = {
  page: PDFPage
  y: number
  font: PDFFont
  bold: PDFFont
  doc: PDFDocument
}

async function ensureSpace(writer: PdfWriter, needed: number) {
  if (writer.y - needed >= MARGIN) return
  writer.page = writer.doc.addPage(A4)
  writer.page.drawRectangle({
    x: 0,
    y: 0,
    width: A4[0],
    height: A4[1],
    color: PAGE_BG,
  })
  writer.y = A4[1] - MARGIN
}

function drawHeader(writer: PdfWriter) {
  const { page, bold, font } = writer
  page.drawText('Luiza Barbosa', {
    x: MARGIN,
    y: writer.y,
    size: 18,
    font: bold,
    color: TEAL,
  })
  writer.y -= 18
  page.drawText('Psicóloga', {
    x: MARGIN,
    y: writer.y,
    size: 11,
    font,
    color: TEAL,
  })
  writer.y -= 28
  page.drawText('Ficha de Anamnese', {
    x: MARGIN,
    y: writer.y,
    size: 16,
    font: bold,
    color: TEAL,
  })
  writer.y -= 12
  page.drawLine({
    start: { x: MARGIN, y: writer.y },
    end: { x: A4[0] - MARGIN, y: writer.y },
    thickness: 1,
    color: RULE,
  })
  writer.y -= 22
}

async function drawSectionTitle(writer: PdfWriter, title: string) {
  await ensureSpace(writer, 28)
  writer.page.drawText(title.toUpperCase(), {
    x: MARGIN,
    y: writer.y,
    size: 11,
    font: writer.bold,
    color: INK,
  })
  writer.y -= 18
}

async function drawField(writer: PdfWriter, label: string, value: string) {
  const maxWidth = A4[0] - MARGIN * 2
  const labelSize = 9
  const valueSize = 10
  const lines = wrapText(display(value), writer.font, valueSize, maxWidth)
  await ensureSpace(writer, 16 + lines.length * 13)

  writer.page.drawText(label, {
    x: MARGIN,
    y: writer.y,
    size: labelSize,
    font: writer.bold,
    color: MUTED,
  })
  writer.y -= 12

  for (const line of lines) {
    await ensureSpace(writer, 14)
    writer.page.drawText(line, {
      x: MARGIN,
      y: writer.y,
      size: valueSize,
      font: writer.font,
      color: INK,
    })
    writer.y -= 13
  }
  writer.y -= 6
}

async function drawPerson(
  writer: PdfWriter,
  title: string,
  person: PersonIdentification,
) {
  await drawSectionTitle(writer, title)
  if (person.socialName.trim()) {
    await drawField(writer, 'Nome social', person.socialName)
  }
  await drawField(writer, 'Nome', person.name)
  await drawField(writer, 'Data de nascimento', person.birthDate)
  await drawField(writer, 'Sexo atribuído ao nascer', person.sex)
  await drawField(writer, 'Identidade de gênero', person.genderIdentity)
  await drawField(writer, 'Estado civil', person.maritalStatus)
  await drawField(writer, 'Endereço', person.address)
  await drawField(writer, 'Profissão', person.profession)
  await drawField(writer, 'Religião', person.religion)
  await drawField(writer, 'Escolaridade', person.education)
  await drawField(writer, 'Telefone', person.phone)
  await drawField(writer, 'E-mail', person.email)
}

function safeFilename(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  return `anamnese-${slug || 'paciente'}.pdf`
}

export async function buildAnamnesisPdf(payload: AnamnesisPayload): Promise<{
  filename: string
  bytes: Uint8Array
}> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  const page = doc.addPage(A4)
  page.drawRectangle({
    x: 0,
    y: 0,
    width: A4[0],
    height: A4[1],
    color: PAGE_BG,
  })

  const writer: PdfWriter = {
    page,
    y: A4[1] - MARGIN,
    font,
    bold,
    doc,
  }

  drawHeader(writer)
  await drawPerson(writer, 'Identificação pessoal', payload.patient)

  if (payload.includeGuardian && payload.guardian) {
    await drawPerson(writer, 'Identificação do responsável', payload.guardian)
  }

  await drawSectionTitle(writer, 'Queixa e evolução')
  await drawField(writer, 'Queixa principal', payload.mainComplaint)
  await drawField(writer, 'Como começou', payload.howItStarted)
  await drawField(writer, 'Foi repentino ou gradual?', payload.suddenOrGradual)
  await drawField(writer, 'Sintomas', payload.symptoms)
  await drawField(writer, 'Acompanhamento prévio', payload.priorTreatment)
  await drawField(writer, 'Medicamentos em uso', payload.medications)
  await drawField(writer, 'O que espera da terapia', payload.therapyExpectations)
  await drawField(writer, 'Observações', payload.observations)
  await drawField(writer, 'Cidade', payload.city)
  await drawField(writer, 'Data e hora', payload.date)
  await drawField(writer, 'Consentimento LGPD', 'Autorizado pelo paciente')

  const bytes = await doc.save()
  const displayName = payload.patient.socialName.trim() || payload.patient.name
  return {
    filename: safeFilename(displayName),
    bytes,
  }
}

export function bytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64')
}
