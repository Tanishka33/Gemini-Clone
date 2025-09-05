// server/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { runChat } from "./runChat.js"; // <-- make sure this file exists

// Ensure we always load the .env from the project root regardless of where the process is started
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(rootDir, ".env") }); // Load API_KEY from root .env

const app = express(); 
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route to handle Gemini prompt
app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    const reply = await runChat(prompt);
    res.json({ reply });
  } catch (error) {
    // Log full error for debugging
    console.error("Gemini API error:", error);
    // In development, surface the real error message to help debug quickly
    const isProd = process.env.NODE_ENV === "production";
    const payload = isProd
      ? { error: "Something went wrong!" }
      : { error: error?.message || "Unknown error" };
    res.status(500).json(payload);
  }
});
 
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
