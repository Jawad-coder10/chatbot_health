import { cn } from "@/lib/utils"

type IconVariant = "question" | "medication" | "pharmacy" | "health"

interface FeatureIconProps {
  variant: IconVariant
  className?: string
}

export function FeatureIcon({ variant, className }: FeatureIconProps) {
  const iconConfig = {
    question: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      content: (
        <div className="relative">
          <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">💬</span>
          </div>
        </div>
      ),
    },
    medication: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      content: (
        <div className="relative transform -rotate-45">
          <div className="h-8 w-3 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
          <div className="absolute top-0 h-4 w-3 rounded-t-full bg-white/60" />
        </div>
      ),
    },
    pharmacy: {
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      content: (
        <div className="relative">
          <div className="h-6 w-4 rounded-t-full bg-gradient-to-b from-indigo-400 to-indigo-600" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-indigo-300" />
        </div>
      ),
    },
    health: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      content: (
        <div className="text-2xl">❤️</div>
      ),
    },
  }

  const config = iconConfig[variant]

  return (
    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", config.bg, className)}>
      {config.content}
    </div>
  )
}
