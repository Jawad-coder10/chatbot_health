"use client"

import { Globe, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderControlsProps {
  languages: { code: string; label: string }[]
  currentLanguage: string
  darkModeLabel: string
  isDarkMode: boolean
  onLanguageChange?: (code: string) => void
  onDarkModeToggle?: () => void
}

export function HeaderControls({
  languages,
  currentLanguage,
  darkModeLabel,
  isDarkMode,
  onLanguageChange,
  onDarkModeToggle,
}: HeaderControlsProps) {
  const currentLang = languages.find((l) => l.code === currentLanguage)

  return (
    <div className="flex items-center gap-2">
      {/* Language selector */}
      <Button variant="outline" size="sm" className="gap-2 bg-card">
        <Globe className="h-4 w-4" />
        <span>{currentLang?.label || currentLanguage}</span>
      </Button>

      {/* Dark mode toggle */}
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-card"
        onClick={onDarkModeToggle}
      >
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span>{darkModeLabel}</span>
      </Button>
    </div>
  )
}
