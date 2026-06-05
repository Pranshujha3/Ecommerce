import { GoogleGenAI } from "@google/genai";
import ProductModel from "../models/product.model.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const recommendMeals = async (req, res) => {
    try {
        // 1. FIX: Capture 'search' from the frontend (as confirmed by your logs)
       const query = req.body.search || req.body.prompt;
        
        if (!query) {
            return res.status(400).json({ success: false, message: "Search term is missing" });
        }

        console.log("\n🔎 AI SEARCH START:", query);
        
        // Initial fallback data to prevent "not defined" errors
        let aiData = { 
            tags: query.toLowerCase().split(" ").filter(t => t.length > 2), 
            duration_days: 1 
        }; 

        // --- STEP 1: AI Analysis (Protected by internal try-catch) ---
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", // Stable 2025 Model
                contents: `Extract search tags for: "${query}"`,
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema: {
                        type: "object",
                        properties: {
                            tags: { type: "array", items: { type: "string" } },
                            duration_days: { type: "number" }
                        },
                        required: ["tags", "duration_days"]
                    }
                }
            });
            aiData = JSON.parse(response.text);
            console.log("🤖 AI Tags:", aiData.tags);
        } catch (aiError) {
            console.warn("⚠️ AI logic skipped, using basic keywords.");
        }

        // --- STEP 2: MongoDB Search ---
        const searchTerms = [...new Set([...aiData.tags, ...query.split(" ")])];
        const regexQueries = searchTerms.filter(t => t.length > 1).map(t => new RegExp(t, "i"));

        const products = await ProductModel.find({
            publish: true,
            $or: [
                { $text: { $search: query } },                  // 🚀 Weighted Text Search
                { tags: { $in: regexQueries } },               // Array Keyword Match
                { name: { $regex: query, $options: 'i' } }     // Phrase Backup
            ]
        })
        .sort({ score: { $meta: "textScore" } })
        .limit(20)
        .lean();

        console.log(`📦 Found ${products.length} products.`);

        // --- STEP 3: Successful Response ---
        res.status(200).json({
            success: true,
            data: {
                analysis: aiData,
                products: products 
            }
        });

    } catch (error) {
        // This catches FATAL errors (like DB connection issues)
        console.error("❌ Fatal Controller Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { recommendMeals };