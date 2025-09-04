import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      maxTokens: 1000,
    })

    return Response.json({ text })
  } catch (error) {
    console.error("Error generating text:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
