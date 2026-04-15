import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";


export const geminiModel = new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: config.GOOGLE_API_KEY,
})

export const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRALAI_API_KEY,
})

// backend/src/ai/models.ai.ts
export const cohereModel = new ChatCohere({
    model: "command-a-03-2025", // This is correct for ChatCohere
    apiKey: config.COHERE_API_KEY,
})

