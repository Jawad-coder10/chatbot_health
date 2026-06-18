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
import { analyzeText, PredictionResponse, getIntentLabel } from "@/lib/api"
// Configuration des textes (peuvent être remplacés par des props ou un système i18n)
const content = {
  brand: {
    name: "HDHealth",
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
    message: "HDHealth ne remplace pas un avis médical professionnel. En cas d'urgence, contactez un médecin.",
  },
  welcome: {
    greeting: "",
    title: "Bienvenue !",
    subtitle: "Je suis HDHealth, votre assistant santé. Comment puis-je vous aider aujourd'hui ?",
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
      "Bhit 2 dolipranes",
      "3indi douleur fi rasi ?",
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

export default function HDHealthPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [response, setResponse]   = useState<PredictionResponse | null>(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await analyzeText(message)
      setResponse(result)
    } catch (err) {
      setError(" Impossible de contacter le serveur. Vérifiez que le backend tourne sur le port 8080.")
    } finally {
      setLoading(false)
    }
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
        {/* ── AJOUTER ICI — Affichage réponse backend ── */}

          {loading && (
            <div className="flex justify-center py-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce"/>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.1s]"/>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]"/>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Réponse du backend */}
          {response && (
            <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">

              {/* Intention + Confiance */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">
                  {getIntentLabel(response.intent)}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  {Math.round(response.confidence * 100)}% confiance
                </span>
              </div>

              {/* Langue */}
              <div className="text-xs text-gray-400">
                Langue détectée : {response.input_language}
              </div>

              {/* Entités trouvées */}
              {Object.entries(response.entities).some(([_, v]) => v !== null) && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Informations extraites
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(response.entities)
                      .filter(([_, value]) => value !== null)
                      .map(([key, value]) => (
                        <div key={key}
                          className="flex gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm">
                          <span className="text-gray-400 capitalize">{key} :</span>
                          <span className="text-gray-800 font-medium">{value}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

            </div>
          )}
           </div>   {/* ferme le div mx-auto */}
      </main>   {/* ferme le main */}
    </div>      
  )
}