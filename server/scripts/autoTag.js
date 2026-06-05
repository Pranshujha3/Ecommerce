import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ProductModel from '../models/product.model.js'; // Adjust path if needed

dotenv.config();

// Configuration
const BATCH_DELAY = 2000; // Wait 2 seconds between items to respect API limits
const MONGO_URI = process.env.MONGODB_URI; // Ensure this matches your .env key

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    generationConfig: { responseMimeType: "application/json" }
});

const generateTagsForProduct = async (product) => {
    // Enhanced Prompt for better search results
    const prompt = `
      Analyze grocery product: "${product.name}". 
      Description: "${product.description}".
      
      Generate a JSON object { "tags": [] } with 6-10 keywords.
      Include:
      - Nutritional value (e.g., "high-protein", "vitamin-c", "fiber-rich", "calcium")
      - Diet types (e.g., "keto", "vegan", "gluten-free")
      - Use cases (e.g., "post-workout", "breakfast", "immunity")
      - Broad categories (e.g., "dairy", "citrus", "pulses")
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(text);
        return data.tags || [];
    } catch (error) {
        if (error.status === 429) {
            console.error(`🛑 Rate limit hit on ${product.name}. Waiting 30 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30s if rate limited
            return await generateTagsForProduct(product); // Retry once
        }
        console.error(`❌ Error for ${product.name}:`, error.message);
        return [];
    }
};

const runAutoTagging = async () => {
    try {
        // 1. Connect to DB
        if (!MONGO_URI) throw new Error("Missing MONGODB_URI in .env");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // 2. Find untagged products
        // Finds products where tags array is either missing or empty
        const products = await ProductModel.find({
            $or: [
                { tags: { $exists: false } },
                { tags: { $size: 0 } }
            ]
        });

        console.log(`🔍 Found ${products.length} products that need tags.`);

        if (products.length === 0) {
            console.log("🎉 All products are already tagged!");
            process.exit(0);
        }

        // 3. Process loop
        for (const [index, product] of products.entries()) {
            console.log(`\n[${index + 1}/${products.length}] Processing: ${product.name}...`);
            
            const newTags = await generateTagsForProduct(product);
            
            if (newTags.length > 0) {
                product.tags = newTags;
                await product.save();
                console.log(`   ✨ Added tags: ${newTags.join(", ")}`);
            } else {
                console.log(`   ⚠️ Skipped (No tags generated)`);
            }

            // 4. Rate Limit Pause (Crucial for free API)
            await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }

        console.log("\n✅ Auto-tagging complete!");
        process.exit(0);

    } catch (error) {
        console.error("Fatal Error:", error);
        process.exit(1);
    }
};

runAutoTagging();