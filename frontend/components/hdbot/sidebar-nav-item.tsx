"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface SidebarNavItemProps {
  icon: LucideIcon
  label: string
  isActive?: boolean
  onClick?: () => void
}

export function SidebarNavItem({ icon: Icon, label, isActive = false, onClick }: SidebarNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/70 hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  )
}
