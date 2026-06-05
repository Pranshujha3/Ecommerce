import dotenv from 'dotenv';
dotenv.config();

// We use native fetch to avoid SDK version issues
async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ No API Key found in .env");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ Error fetching models:", data.error.message);
      return;
    }

    console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
    console.log("---------------------------------");
    
    // Filter for "generateContent" models (the ones we need)
    const chatModels = data.models.filter(m => 
      m.supportedGenerationMethods.includes("generateContent")
    );

    chatModels.forEach(model => {
      // Clean up the name (remove "models/" prefix)
      const cleanName = model.name.replace("models/", "");
      console.log(`🔹 ${cleanName}`);
    });

    console.log("---------------------------------");
    console.log("👉 Pick one of the above names for your testGemini.js file.");

  } catch (error) {
    console.error("Network Error:", error);
  }
}

listAvailableModels();