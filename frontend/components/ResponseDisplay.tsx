// frontend/components/ResponseDisplay.tsx

import { PredictionResponse, getIntentLabel } from "@/lib/api"

interface Props {
    response: PredictionResponse
}

const entityLabels: Record<string, string> = {
    medication: "Médicament",
    quantity: "Quantité",
    frequency: "Fréquence",
    duration: "Durée",
    symptom: "Symptôme",
    body_part: "Partie du corps",
    urgence_type: "Type d'urgence",
    specialite: "Spécialité médicale",
    assurance: "Assurance",
    lieu: "Lieu",
}

export default function ResponseDisplay({ response }: Props) {
    return (
        <div className="bg-white rounded-xl border p-5 space-y-4 shadow-sm">

            {/* Intention */}
            <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-gray-800">
                    {getIntentLabel(response.intent)}
                </span>

                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {Math.round(response.confidence * 100)}% confiance
                </span>
            </div>

            {/* Langue */}
            <div className="text-sm text-gray-500">
                 Langue détectée : <strong>{response.input_language}</strong>
            </div>

            {/* Entités */}
            <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 border-b pb-1 uppercase">
                    Informations extraites
                </p>

                {Object.keys(entityLabels).map((key) => {
                    const value = response.entities?.[
                        key as keyof typeof response.entities
                    ]

                    return (
                        <div
                            key={key}
                            className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
                        >
                            <span className="text-gray-600">
                                {entityLabels[key]}
                            </span>

                            <span
                                className={
                                    value
                                        ? "font-medium text-green-700"
                                        : "text-gray-400 italic"
                                }
                            >
                                {value || "Non détecté"}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* JSON brut */}
            <details className="mt-4">
                <summary className="cursor-pointer text-sm text-blue-600">
                    Voir la réponse JSON complète
                </summary>

                <pre className="mt-2 text-xs bg-slate-100 p-3 rounded overflow-auto">
                    {JSON.stringify(response, null, 2)}
                </pre>
            </details>
        </div>
    )
}