type AboutProps = {
  about: string
}

export function About({ about }: AboutProps) {
  return (
    <section className="bg-muted-surface/60">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Sobre
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {about}
        </p>
      </div>
    </section>
  )
}
