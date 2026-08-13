import type { ReactNode } from 'react'
import type { PersonIdentification } from '@/features/anamnesis/domain/types'
import {
  EDUCATION_OPTIONS,
  GENDER_IDENTITY_OPTIONS,
  GENDER_OTHER_OPTION,
  MARITAL_STATUS_OPTIONS,
  OTHER_OPTION,
  RELIGION_OPTIONS,
  SEX_AT_BIRTH_OPTIONS,
} from '@/features/anamnesis/lib/options'
import { formatEmailInput, formatPhoneBr } from '@/features/anamnesis/lib/masks'
import { SelectWithOther } from '@/features/anamnesis/ui/SelectWithOther'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

type PersonFieldsProps = {
  idPrefix: string
  value: PersonIdentification
  errors: Record<string, string>
  errorPrefix: string
  onChange: (next: PersonIdentification) => void
  /** When true, name and phone show as required (patient). Guardian only requires name. */
  requirePhone?: boolean
}

export function PersonFields({
  idPrefix,
  value,
  errors,
  errorPrefix,
  onChange,
  requirePhone = false,
}: PersonFieldsProps) {
  function update<K extends keyof PersonIdentification>(
    key: K,
    next: PersonIdentification[K],
  ) {
    onChange({ ...value, [key]: next })
  }

  function fieldError(key: keyof PersonIdentification) {
    return errors[`${errorPrefix}.${key}`]
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        className="sm:col-span-2"
        id={`${idPrefix}-name`}
        label="Nome"
        error={fieldError('name')}
        optional={false}
      >
        <Input
          id={`${idPrefix}-name`}
          autoComplete="name"
          value={value.name}
          onChange={(event) => update('name', event.target.value)}
        />
      </Field>

      <Field
        className="sm:col-span-2"
        id={`${idPrefix}-socialName`}
        label="Nome social"
        error={fieldError('socialName')}
      >
        <Input
          id={`${idPrefix}-socialName`}
          value={value.socialName}
          onChange={(event) => update('socialName', event.target.value)}
          placeholder="Como prefere ser chamada"
        />
      </Field>

      <Field
        id={`${idPrefix}-birthDate`}
        label="Data de nascimento"
        error={fieldError('birthDate')}
      >
        <Input
          id={`${idPrefix}-birthDate`}
          type="date"
          value={value.birthDate}
          onChange={(event) => update('birthDate', event.target.value)}
        />
      </Field>

      <SelectWithOther
        id={`${idPrefix}-maritalStatus`}
        label="Estado civil"
        value={value.maritalStatus}
        options={MARITAL_STATUS_OPTIONS}
        otherOption={OTHER_OPTION}
        error={fieldError('maritalStatus')}
        onChange={(maritalStatus) => update('maritalStatus', maritalStatus)}
      />

      <SelectWithOther
        id={`${idPrefix}-sex`}
        label="Sexo atribuído ao nascer"
        value={value.sex}
        options={SEX_AT_BIRTH_OPTIONS}
        otherOption=""
        error={fieldError('sex')}
        onChange={(sex) => update('sex', sex)}
      />

      <SelectWithOther
        id={`${idPrefix}-genderIdentity`}
        label="Identidade de gênero"
        value={value.genderIdentity}
        options={GENDER_IDENTITY_OPTIONS}
        otherOption={GENDER_OTHER_OPTION}
        otherLabel="Se quiser, descreva como se identifica (opcional)"
        error={fieldError('genderIdentity')}
        onChange={(genderIdentity) => update('genderIdentity', genderIdentity)}
      />

      <Field
        className="sm:col-span-2"
        id={`${idPrefix}-address`}
        label="Endereço"
        error={fieldError('address')}
      >
        <Input
          id={`${idPrefix}-address`}
          autoComplete="street-address"
          value={value.address}
          onChange={(event) => update('address', event.target.value)}
        />
      </Field>

      <Field
        id={`${idPrefix}-profession`}
        label="Profissão"
        error={fieldError('profession')}
      >
        <Input
          id={`${idPrefix}-profession`}
          value={value.profession}
          onChange={(event) => update('profession', event.target.value)}
        />
      </Field>

      <SelectWithOther
        id={`${idPrefix}-religion`}
        label="Religião"
        value={value.religion}
        options={RELIGION_OPTIONS}
        otherOption={OTHER_OPTION}
        error={fieldError('religion')}
        onChange={(religion) => update('religion', religion)}
      />

      <SelectWithOther
        id={`${idPrefix}-education`}
        label="Escolaridade"
        value={value.education}
        options={EDUCATION_OPTIONS}
        otherOption={OTHER_OPTION}
        error={fieldError('education')}
        onChange={(education) => update('education', education)}
      />

      <Field
        id={`${idPrefix}-phone`}
        label="Telefone"
        error={fieldError('phone')}
        optional={!requirePhone}
      >
        <Input
          id={`${idPrefix}-phone`}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="(98) 99999-9999"
          maxLength={15}
          value={value.phone}
          onChange={(event) => update('phone', formatPhoneBr(event.target.value))}
        />
      </Field>

      <Field
        id={`${idPrefix}-email`}
        label="E-mail"
        error={fieldError('email')}
      >
        <Input
          id={`${idPrefix}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nome@email.com"
          value={value.email}
          onChange={(event) => update('email', formatEmailInput(event.target.value))}
        />
      </Field>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  className,
  children,
  optional = true,
}: {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactNode
  optional?: boolean
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-primary" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
