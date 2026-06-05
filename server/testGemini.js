import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. List of models to try (in order of likelihood to work on free tier)
const MODELS_TO_TRY = [
  "gemini-1.5-flash",        // Standard Free Tier workhorse
  "gemini-1.5-flash-latest", // Alias for the above
  "gemini-flash-latest",     // Alias that appeared in your list
  "gemini-1.5-pro"           // Backup
];

async function testConnection() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY is missing from .env file");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  console.log(`🔑 API Key found. Testing ${MODELS_TO_TRY.length} models to find a working one...\n`);

  for (const modelName of MODELS_TO_TRY) {
    console.log(`👉 Attempting: ${modelName}...`);
    
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = "Say 'Hello, Success!'";
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // IF WE GET HERE, IT WORKED!
      console.log(`\n✅ SUCCESS with model: "${modelName}"`);
      console.log("------------------------------------------------");
      console.log(text);
      console.log("------------------------------------------------");
      console.log(`📌 IMPORTANT: Use "${modelName}" in your main mealController.js file.`);
      return; // Exit the loop, we are done

    } catch (error) {
      // If it fails, print a short error and loop to the next one
      if (error.message.includes("404")) {
        console.log(`   ❌ Failed: Model not found (404).`);
      } else if (error.message.includes("429")) {
        console.log(`   ❌ Failed: Quota exceeded/Billing required (429).`);
      } else {
        console.log(`   ❌ Failed: ${error.message.split('[')[0]}`); // Short error message
      }
    }
  }

  console.log("\n❌ ALL ATTEMPTS FAILED.");
  console.log("Please create a NEW API Key in a NEW Project at https://aistudio.google.com");
}

testConnection();