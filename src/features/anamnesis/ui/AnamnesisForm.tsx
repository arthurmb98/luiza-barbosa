import { useState, type FormEvent } from 'react'
import { submitAnamnesis } from '@/features/anamnesis/application/api-client'
import {
  EVOLUTION_OPTIONS,
  FIXED_CITY,
  formatLocalDateTime,
  OTHER_OPTION,
  PRIOR_TREATMENT_OPTIONS,
  PRIOR_TREATMENT_YES,
} from '@/features/anamnesis/lib/options'
import {
  emptyAnamnesisPayload,
  emptyPersonIdentification,
  type AnamnesisPayload,
} from '@/features/anamnesis/domain/types'
import {
  validateStep,
  type AnamnesisStep,
} from '@/features/anamnesis/application/validation'
import { PersonFields } from '@/features/anamnesis/ui/PersonFields'
import { SelectWithOther } from '@/features/anamnesis/ui/SelectWithOther'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/lib/utils'

type AnamnesisFormProps = {
  onSuccess: () => void
}

const STEPS: Array<{ step: AnamnesisStep; title: string }> = [
  { step: 1, title: 'Você' },
  { step: 2, title: 'Responsável' },
  { step: 3, title: 'Queixa' },
]

export function AnamnesisForm({ onSuccess }: AnamnesisFormProps) {
  const [step, setStep] = useState<AnamnesisStep>(1)
  const [data, setData] = useState<AnamnesisPayload>(emptyAnamnesisPayload)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function goNext() {
    const nextErrors = validateStep(step, data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setStep((current) => (current < 3 ? ((current + 1) as AnamnesisStep) : current))
  }

  function goBack() {
    setErrors({})
    setSubmitError(null)
    setStep((current) => (current > 1 ? ((current - 1) as AnamnesisStep) : current))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateStep(3, data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setSubmitError(null)

    const payload: AnamnesisPayload = {
      ...data,
      city: FIXED_CITY,
      date: formatLocalDateTime(),
    }

    try {
      const result = await submitAnamnesis(payload)
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {})
        setSubmitError(result.error)
        return
      }
      onSuccess()
    } catch {
      setSubmitError(
        'Não foi possível enviar. Confira se a API local está rodando (npm run dev:api).',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <ol className="flex items-center gap-2" aria-label="Progresso da anamnese">
        {STEPS.map((item) => {
          const active = item.step === step
          const done = item.step < step
          return (
            <li key={item.step} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  active && 'bg-primary text-elevated',
                  done && 'bg-accent text-elevated',
                  !active && !done && 'bg-muted-surface text-muted-foreground',
                )}
                aria-current={active ? 'step' : undefined}
              >
                {item.step}
              </span>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:inline',
                  active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {item.title}
              </span>
              {item.step < 3 ? (
                <span className="ml-auto hidden h-px flex-1 bg-border sm:block" />
              ) : null}
            </li>
          )
        })}
      </ol>

      {step === 1 ? (
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Identificação pessoal
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Só nome e telefone são obrigatórios; o restante ajuda no acolhimento.
            </p>
          </div>
          <PersonFields
            idPrefix="patient"
            errorPrefix="patient"
            value={data.patient}
            errors={errors}
            requirePhone
            onChange={(patient) => setData((current) => ({ ...current, patient }))}
          />
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Identificação do responsável
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Útil para menores ou quando outra pessoa acompanha o atendimento.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-muted-surface/40 px-4 py-3">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-border accent-primary"
              checked={data.includeGuardian}
              onChange={(event) => {
                const includeGuardian = event.target.checked
                setData((current) => ({
                  ...current,
                  includeGuardian,
                  guardian: includeGuardian
                    ? (current.guardian ?? emptyPersonIdentification())
                    : undefined,
                }))
                setErrors({})
              }}
            />
            <span>
              <span className="block text-sm font-medium text-foreground">
                Preciso informar responsável
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Marque se quem preenche não é o próprio paciente.
              </span>
            </span>
          </label>

          {data.includeGuardian ? (
            <PersonFields
              idPrefix="guardian"
              errorPrefix="guardian"
              value={data.guardian ?? emptyPersonIdentification()}
              errors={errors}
              onChange={(guardian) =>
                setData((current) => ({ ...current, guardian }))
              }
            />
          ) : (
            <p className="rounded-2xl bg-muted-surface/50 px-4 py-3 text-sm text-muted-foreground">
              Sem responsável adicional. Avance para descrever a queixa.
            </p>
          )}
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Queixa e evolução
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Conte com calma o que trouxe você até aqui. Todos os campos abaixo são
              opcionais.
            </p>
          </div>

          <TextField
            id="mainComplaint"
            label="Queixa principal"
            error={errors.mainComplaint}
            value={data.mainComplaint}
            onChange={(mainComplaint) =>
              setData((current) => ({ ...current, mainComplaint }))
            }
            rows={4}
          />
          <TextField
            id="howItStarted"
            label="Como começou"
            error={errors.howItStarted}
            value={data.howItStarted}
            onChange={(howItStarted) =>
              setData((current) => ({ ...current, howItStarted }))
            }
            rows={3}
          />

          <SelectWithOther
            id="suddenOrGradual"
            label="Foi repentino ou gradual?"
            value={data.suddenOrGradual}
            options={EVOLUTION_OPTIONS}
            otherOption={OTHER_OPTION}
            error={errors.suddenOrGradual}
            onChange={(suddenOrGradual) =>
              setData((current) => ({ ...current, suddenOrGradual }))
            }
          />

          <TextField
            id="symptoms"
            label="Sintomas"
            error={errors.symptoms}
            value={data.symptoms}
            onChange={(symptoms) =>
              setData((current) => ({ ...current, symptoms }))
            }
            rows={3}
          />

          <SelectWithOther
            id="priorTreatment"
            label="Já fez acompanhamento psicológico ou psiquiátrico?"
            value={data.priorTreatment}
            options={PRIOR_TREATMENT_OPTIONS}
            otherOption={PRIOR_TREATMENT_YES}
            otherLabel="Se quiser, conte brevemente (opcional)"
            error={errors.priorTreatment}
            onChange={(priorTreatment) =>
              setData((current) => ({ ...current, priorTreatment }))
            }
          />

          <TextField
            id="medications"
            label="Medicamentos em uso"
            error={errors.medications}
            value={data.medications}
            onChange={(medications) =>
              setData((current) => ({ ...current, medications }))
            }
            rows={2}
          />

          <TextField
            id="therapyExpectations"
            label="O que espera da terapia?"
            error={errors.therapyExpectations}
            value={data.therapyExpectations}
            onChange={(therapyExpectations) =>
              setData((current) => ({ ...current, therapyExpectations }))
            }
            rows={3}
          />

          <TextField
            id="observations"
            label="Observações"
            error={errors.observations}
            value={data.observations}
            onChange={(observations) =>
              setData((current) => ({ ...current, observations }))
            }
            rows={3}
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border px-4 py-3">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-border accent-primary"
              checked={data.lgpdConsent}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  lgpdConsent: event.target.checked,
                }))
              }
            />
            <span className="text-sm text-foreground">
              Autorizo o envio destes dados para contato clínico com a
              profissional responsável (LGPD).
            </span>
          </label>
          {errors.lgpdConsent ? (
            <p className="-mt-2 text-xs text-primary" role="alert">
              {errors.lgpdConsent}
            </p>
          ) : null}
        </section>
      ) : null}

      {submitError ? (
        <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={goBack} disabled={submitting}>
            Voltar
          </Button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <Button type="button" onClick={goNext}>
            Continuar
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Enviando…' : 'Enviar anamnese'}
          </Button>
        )}
      </div>
    </form>
  )
}

function TextField({
  id,
  label,
  value,
  error,
  onChange,
  rows,
}: {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  rows: number
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block">
        {label}
        <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
      </Label>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-primary" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
