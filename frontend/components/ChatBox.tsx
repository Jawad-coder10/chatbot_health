// frontend/components/ChatBox.tsx
"use client"
import { useState, useRef, useEffect } from "react"
import { analyzeText, Message, PredictionResponse } from "@/lib/api"
import ResponseDisplay from "./ResponseDisplay"

export default function ChatBox() {

    const [messages, setMessages]   = useState<Message[]>([])
    const [input, setInput]         = useState("")
    const [loading, setLoading]     = useState(false)
    const bottomRef                 = useRef<HTMLDivElement>(null)

    // Scroll automatique vers le bas
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = async () => {

        // Vérifier que le champ n'est pas vide
        if (!input.trim() || loading) return

        const userMessage: Message = {
            id:   Date.now(),
            type: "user",
            text: input.trim()
        }

        // Ajouter le message utilisateur
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setLoading(true)

        try {
            // Appel au backend
            const response: PredictionResponse = await analyzeText(userMessage.text)

            // Ajouter la réponse du bot
            const botMessage: Message = {
                id:       Date.now() + 1,
                type:     "bot",
                text:     userMessage.text,
                response: response
            }
            setMessages(prev => [...prev, botMessage])

        } catch (error) {
            // Message d'erreur si le backend ne répond pas
            const errorMessage: Message = {
                id:   Date.now() + 1,
                type: "bot",
                text: " Impossible de contacter le serveur. Vérifiez que le backend tourne sur le port 8080."
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    // Envoyer avec la touche Entrée
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="flex flex-col h-full">

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">

                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        Écrivez votre message ci-dessous
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id}>

                        {/* Message utilisateur */}
                        {msg.type === "user" && (
                            <div className="flex justify-end">
                                <div className="bg-green-500 text-white rounded-2xl
                                                rounded-tr-sm px-4 py-2 max-w-xs">
                                    {msg.text}
                                </div>
                            </div>
                        )}

                        {/* Réponse bot */}
                        {msg.type === "bot" && (
                            <div className="flex justify-start">
                                <div className="max-w-sm w-full">
                                    {msg.response ? (
                                        <ResponseDisplay response={msg.response} />
                                    ) : (
                                        <div className="bg-red-50 text-red-600
                                                        rounded-xl px-4 py-2">
                                            {msg.text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Indicateur de chargement */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-xl px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400
                                                 rounded-full animate-bounce"/>
                                <span className="w-2 h-2 bg-gray-400
                                                 rounded-full animate-bounce
                                                 [animation-delay:0.1s]"/>
                                <span className="w-2 h-2 bg-gray-400
                                                 rounded-full animate-bounce
                                                 [animation-delay:0.2s]"/>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Zone de saisie */}
            <div className="border-t p-4">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Écrivez votre message ici..."
                        disabled={loading}
                        className="flex-1 border rounded-full px-4 py-2
                                   text-sm outline-none focus:ring-2
                                   focus:ring-green-400 disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="bg-green-500 hover:bg-green-600 text-white
                                   rounded-full p-2 disabled:opacity-50
                                   transition-colors"
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    )
}