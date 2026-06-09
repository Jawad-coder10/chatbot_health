import { AlertTriangle } from "lucide-react"

interface WarningBoxProps {
  title: string
  message: string
}

export function WarningBox({ title, message }: WarningBoxProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
    </div>
  )
}
