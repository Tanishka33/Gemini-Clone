// server/runChat.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure we load the root .env regardless of CWD or import order
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(rootDir, ".env") });

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY is missing. Please create a .env file at the project root and set API_KEY=your_google_generative_ai_key");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function runChat(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Invalid prompt. It must be a non-empty string.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
