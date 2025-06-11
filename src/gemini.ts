// src/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Vite automatically loads environment variables that start with VITE_
const apiKey: string | undefined = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY not found in environment variables');
}

// Initialize the GoogleGenerativeAI instance
export const genAI = new GoogleGenerativeAI(apiKey || '');