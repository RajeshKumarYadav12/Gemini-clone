// npm install @google/generative-ai
// AIzaSyD1RiLDrVaGjKWyPdoPgUOXFGPU2lCNNtM

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = "AIzaSyD1RiLDrVaGjKWyPdoPgUOXFGPU2lCNNtM";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Initialize the chat session once and reuse
const chatSession = model.startChat({
  generationConfig,
  history: [],
});

async function run(prompt) {
  try {
    const result = await chatSession.sendMessage(prompt);
    const response = result.response;

    console.log(response.text());
    return response.text();
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
}

export default run;
