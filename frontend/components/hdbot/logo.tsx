interface LogoProps {
  name: string
  tagline: string
}

export function Logo({ name, tagline }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-xl font-bold text-primary-foreground">+</span>
        </div>
      </div>
      <div>
        <h1 className="text-lg font-bold text-foreground">{name}</h1>
        <p className="text-xs text-muted-foreground">{tagline}</p>
      </div>
    </div>
  )
}
