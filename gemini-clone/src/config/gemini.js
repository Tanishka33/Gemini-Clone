import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";


const MODEL_NAME = "gemini-1.5-flash";

// Use correct env variable (no REACT_APP_ needed for Node backend)
const API_KEY = "AIzaSyDOsE2rDlKxE_eFwKv6V5ijR7k_z6wrofY";

async function runChat(prompt) {
  try {
    if (!API_KEY) {
      throw new Error("API key not found. Please check your .env file and variable name.");
    }

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      throw new Error("Valid prompt is required.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chat.sendMessage(prompt.trim());
    const responseText = result.response.text();
    console.log("Gemini Response:", responseText);

    return responseText;
  } catch (error) {
    console.error("Error in runChat:", error);

    if (error.message?.includes('API key')) {
      throw new Error("Invalid or missing API key.");
    } else if (error.message?.includes('quota')) {
      throw new Error("API quota exceeded.");
    } else if (error.message?.includes('model')) {
      throw new Error("Model not available or incorrect.");
    }

    throw error;
  }
}

export default runChat;