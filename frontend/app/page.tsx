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
import {
  Sidebar,
  WelcomeHero,
  HeaderControls,
  FeatureCard,
  FeatureIcon,
  ChatInput,
} from "@/components/hdbot"

// Configuration des textes (peuvent être remplacés par des props ou un système i18n)
const content = {
  brand: {
    name: "HDBot",
    tagline: "Votre assistant santé intelligent",
  },
  nav: [
    { id: "accueil", icon: Home, label: "Accueil" },
    { id: "nouvelle-conversation", icon: Plus, label: "Nouvelle conversation" },
    { id: "historique", icon: Clock, label: "Historique" },
    { id: "medicaments", icon: Pill, label: "Médicaments" },
    { id: "pharmacies", icon: MapPin, label: "Pharmacies" },
    { id: "conseils-sante", icon: Heart, label: "Conseils santé" },
    { id: "parametres", icon: Settings, label: "Paramètres" },
  ],
  warning: {
    title: "Avertissement",
    message: "HDBot ne remplace pas un avis médical professionnel. En cas d'urgence, contactez un médecin.",
  },
  welcome: {
    greeting: "👋",
    title: "Bienvenue !",
    subtitle: "Je suis HDBot, votre assistant santé. Comment puis-je vous aider aujourd'hui ?",
  },
  features: [
    {
      id: "question",
      variant: "question" as const,
      title: "Poser une question",
      description: "Posez vos questions sur les symptômes, traitements ou médicaments.",
    },
    {
      id: "medication",
      variant: "medication" as const,
      title: "Rechercher un médicament",
      description: "Trouvez des informations détaillées sur vos médicaments.",
    },
    {
      id: "pharmacy",
      variant: "pharmacy" as const,
      title: "Trouver une pharmacie",
      description: "Localisez les pharmacies proches de vous.",
    },
    {
      id: "health",
      variant: "health" as const,
      title: "Conseils santé",
      description: "Découvrez des conseils et informations pour votre bien-être.",
    },
  ],
  chat: {
    title: "Dites-moi ce dont vous avez besoin...",
    subtitle: "Vous pouvez écrire votre message ou utiliser la voix",
    placeholder: "Écrivez votre message ici...",
    exampleQuestionsLabel: "Exemples de questions",
    exampleQuestions: [
      "Où puis-je trouver du Doliprane ?",
      "Quels sont les effets de la fièvre ?",
      "J'ai mal à la tête, que prendre ?",
      "Comment traiter un rhume ?",
    ],
  },
  languages: [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ],
  darkMode: {
    label: "Mode sombre",
  },
}

export default function HDBotPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleSendMessage = (message: string) => {
    console.log("Message envoyé:", message)
  }

  const handleVoiceInput = () => {
    console.log("Entrée vocale activée")
  }

  const handleFeatureClick = (featureId: string) => {
    console.log("Feature cliquée:", featureId)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        brandName={content.brand.name}
        brandTagline={content.brand.tagline}
        navItems={content.nav}
        warningTitle={content.warning.title}
        warningMessage={content.warning.message}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header controls */}
          <div className="flex justify-end">
            <HeaderControls
              languages={content.languages}
              currentLanguage="fr"
              darkModeLabel={content.darkMode.label}
              isDarkMode={isDarkMode}
              onDarkModeToggle={handleDarkModeToggle}
            />
          </div>

          {/* Welcome hero */}
          <WelcomeHero
            greeting={content.welcome.greeting}
            title={content.welcome.title}
            subtitle={content.welcome.subtitle}
          />

          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={<FeatureIcon variant={feature.variant} />}
                title={feature.title}
                description={feature.description}
                onClick={() => handleFeatureClick(feature.id)}
              />
            ))}
          </div>

          {/* Chat input */}
          <ChatInput
            title={content.chat.title}
            subtitle={content.chat.subtitle}
            placeholder={content.chat.placeholder}
            exampleQuestionsLabel={content.chat.exampleQuestionsLabel}
            exampleQuestions={content.chat.exampleQuestions}
            onSendMessage={handleSendMessage}
            onVoiceInput={handleVoiceInput}
          />
        </div>
      </main>
    </div>
  )
}
