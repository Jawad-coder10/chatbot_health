"use client"

import { useState } from "react"
import { Mic, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  title: string
  subtitle: string
  placeholder: string
  exampleQuestionsLabel: string
  exampleQuestions: string[]
  onSendMessage?: (message: string) => void
  onVoiceInput?: () => void
  onExampleClick?: (question: string) => void
}

export function ChatInput({
  title,
  subtitle,
  placeholder,
  exampleQuestionsLabel,
  exampleQuestions,
  onSendMessage,
  onVoiceInput,
  onExampleClick,
}: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

      {/* Input area */}
      <div className="flex items-center gap-3">
        {/* Voice button */}
        <Button
          variant="outline"
          size="icon-lg"
          className="h-12 w-12 shrink-0 rounded-full bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
          onClick={onVoiceInput}
        >
          <Mic className="h-5 w-5" />
        </Button>

        {/* Text input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="h-12 w-full rounded-full border border-border bg-muted/50 px-5 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {/* Send button */}
          <Button
            size="icon"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Example questions */}
      <div className="mt-6">
        <p className="text-sm font-medium text-primary mb-3">{exampleQuestionsLabel}</p>
        <div className="flex flex-wrap gap-2">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                onExampleClick?.(question)
                setMessage(question)
              }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/50 hover:bg-muted transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
