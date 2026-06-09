"use client"

import { useState } from "react"
import {
  Home,
  Plus,
  Clock,
  Pill,
  MapPin,
  Heart,
  Settings,
} from "lucide-react"
import { SidebarNavItem } from "./sidebar-nav-item"
import { WarningBox } from "./warning-box"
import { Logo } from "./logo"

interface NavItem {
  id: string
  icon: typeof Home
  label: string
}

interface SidebarProps {
  brandName: string
  brandTagline: string
  navItems: NavItem[]
  warningTitle: string
  warningMessage: string
  activeItemId?: string
  onNavItemClick?: (id: string) => void
}

export function Sidebar({
  brandName,
  brandTagline,
  navItems,
  warningTitle,
  warningMessage,
  activeItemId = "accueil",
  onNavItemClick,
}: SidebarProps) {
  const [activeItem, setActiveItem] = useState(activeItemId)

  const handleNavClick = (id: string) => {
    setActiveItem(id)
    onNavItemClick?.(id)
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar p-4">
      {/* Logo */}
      <div className="mb-8">
        <Logo name={brandName} tagline={brandTagline} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.id}
            onClick={() => handleNavClick(item.id)}
          />
        ))}
      </nav>

      {/* Warning */}
      <div className="mt-auto">
        <WarningBox title={warningTitle} message={warningMessage} />
      </div>
    </aside>
  )
}

// Export default nav items for convenience
export const defaultNavItems: NavItem[] = [
  { id: "accueil", icon: Home, label: "Accueil" },
  { id: "nouvelle-conversation", icon: Plus, label: "Nouvelle conversation" },
  { id: "historique", icon: Clock, label: "Historique" },
  { id: "medicaments", icon: Pill, label: "Médicaments" },
  { id: "pharmacies", icon: MapPin, label: "Pharmacies" },
  { id: "conseils-sante", icon: Heart, label: "Conseils santé" },
  { id: "parametres", icon: Settings, label: "Paramètres" },
]
