import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  resolveSelectWithOther,
  splitSelectWithOther,
} from '@/anamnesis/options'
import { cn } from '@/lib/utils'

type SelectWithOtherProps = {
  id: string
  label: string
  value: string
  options: readonly string[]
  otherOption: string
  otherLabel?: string
  error?: string
  optional?: boolean
  className?: string
  onChange: (resolved: string) => void
}

const selectClassName =
  'flex h-11 w-full rounded-xl border border-border bg-elevated px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35'

export function SelectWithOther({
  id,
  label,
  value,
  options,
  otherOption,
  otherLabel = 'Se quiser, descreva (opcional)',
  error,
  optional = true,
  className,
  onChange,
}: SelectWithOtherProps) {
  const { option, otherText } = splitSelectWithOther(value, otherOption)
  const showOther = Boolean(otherOption) && option === otherOption

  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
        ) : null}
      </Label>
      <select
        id={id}
        className={cn(selectClassName)}
        value={option}
        onChange={(event) => {
          const nextOption = event.target.value
          onChange(
            resolveSelectWithOther(
              nextOption,
              nextOption === otherOption ? otherText : '',
              otherOption,
            ),
          )
        }}
      >
        <option value="">Selecione</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {showOther ? (
        <div className="mt-2">
          <Label htmlFor={`${id}-other`} className="mb-1.5 block text-xs text-muted-foreground">
            {otherLabel}
          </Label>
          <Input
            id={`${id}-other`}
            value={otherText}
            onChange={(event) =>
              onChange(
                resolveSelectWithOther(otherOption, event.target.value, otherOption),
              )
            }
          />
        </div>
      ) : null}

      {error ? (
        <p className="mt-1.5 text-xs text-primary" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
