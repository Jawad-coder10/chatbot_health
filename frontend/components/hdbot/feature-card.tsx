import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
  onClick?: () => void
}

export function FeatureCard({ icon, title, description, className, onClick }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </button>
  )
}
