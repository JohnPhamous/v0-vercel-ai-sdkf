"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Sparkles } from "lucide-react"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

if (process.env.VERCEL_ENV === 'production') {
    throw new Error('Error: The OPENAI_API_KEY environment variable is missing or empty')
}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        throw new Error("Failed to generate response")
      }

      const data = await res.json()
      setResponse(data.text)
    } catch (error) {
      console.error("Error:", error)
      setResponse("Sorry, there was an error generating the response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-balance">AI Inference App</h1>
          </div>
          <p className="text-muted-foreground text-lg">Powered by Vercel AI SDK and OpenAI</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ask AI Anything</CardTitle>
            <CardDescription>
              Enter your prompt below and get an AI-generated response using OpenAI's GPT model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Enter your prompt here... (e.g., 'Write a short story about a robot learning to paint')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Response
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle>AI Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap text-pretty leading-relaxed">{response}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
