import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { AnamnesisForm } from '@/features/anamnesis/ui/AnamnesisForm'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'

type AnamnesisSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnamnesisSheet({ open, onOpenChange }: AnamnesisSheetProps) {
  const [completed, setCompleted] = useState(false)

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) {
      window.setTimeout(() => setCompleted(false), 200)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Anamnese online</SheetTitle>
          <SheetDescription>
            Leva poucos minutos e antecipa seu atendimento com mais clareza.
          </SheetDescription>
        </SheetHeader>

        {completed ? (
          <div className="flex flex-col items-start gap-4 py-6">
            <CheckCircle2 className="size-10 text-accent" aria-hidden />
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Anamnese enviada
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Recebemos suas informações. Em breve a Dra. Luiza entra em
                contato para os próximos passos.
              </p>
            </div>
            <Button type="button" onClick={() => handleOpenChange(false)}>
              Fechar
            </Button>
          </div>
        ) : (
          <AnamnesisForm onSuccess={() => setCompleted(true)} />
        )}
      </SheetContent>
    </Sheet>
  )
}
