import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates nutritional and search tags using AI
 * Uses 'gemini-2.5-flash' for maximum reliability in late 2025.
 */
export const generateTagsForProduct = async (product, retryCount = 0) => {
    const prompt = `
      Analyze this grocery product: "${product.name}"
      Description: "${product.description}"
      Generate keywords for nutrients, diet types, and categories.
    `;

    try {
        const response = await ai.models.generateContent({
            // 🚀 CHANGE: Using the stable 2.5 series to avoid 404 errors
            model: "gemini-2.5-flash", 
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: {
                    type: "object",
                    properties: {
                        tags: {
                            type: "array",
                            items: { type: "string" },
                            description: "6-10 keywords for nutrition, diet, and category."
                        }
                    },
                    required: ["tags"]
                }
            }
        });

        const data = JSON.parse(response.text);
        console.log(`✅ Tags generated for ${product.name}:`, data.tags);
        return data.tags || [];

    } catch (error) {
        // Handle 404 (Model Not Found) or 429 (Rate Limit)
        const statusCode = error.status || error.code;

        if (statusCode === 429 && retryCount < 3) {
            const waitTime = (retryCount + 1) * 5000; 
            console.log(`⚠️ Rate limit. Retrying ${product.name} in ${waitTime/1000}s...`);
            await new Promise(r => setTimeout(r, waitTime));
            return generateTagsForProduct(product, retryCount + 1);
        }

        if (statusCode === 404) {
            console.error(`❌ Model Name Error: Please ensure you aren't using a retired model ID.`);
        }

        console.error(`❌ AI Error for ${product.name}:`, error.message);
        return [];
    }
};