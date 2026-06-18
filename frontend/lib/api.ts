// frontend/lib/api.ts
const BACKEND_URL = "http://localhost:8000"

export interface Entities {
    medication:    string | null
    quantity:      string | null
    frequency:     string | null
    duration:      string | null
    symptom:       string | null
    body_part:     string | null
    urgence_type:  string | null
    specialite:    string | null
    lieu:          string | null
    assurance:     string | null
}

export interface PredictionResponse {
    intent:         string
    confidence:     number
    input_language: string
    entities:       Entities
}

export interface Message {
    id:        number
    type:      "user" | "bot"
    text:      string
    response?: PredictionResponse
}

export async function analyzeText(text: string): Promise<PredictionResponse> {
    const response = await fetch(`${BACKEND_URL}/predict`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text })
    })
    if (!response.ok) {
        throw new Error(`Erreur API : ${response.status}`)
    }
    return response.json()
}

export function getIntentLabel(intent: string): string {
    const labels: Record<string, string> = {
        "medication_request":     "Demande de médicament",
        "symptom_description":    "Description de symptôme",
        "demande_posologie":      "Demande de posologie",
        "demande_consultation":   "Demande de consultation",
        "demande_prix":           "Demande de prix",
        "remboursement_mutuelle": "Remboursement mutuelle",
        "urgence":                "Urgence",
        "unknown":                "Intention inconnue",
    }
    return labels[intent] || intent
}