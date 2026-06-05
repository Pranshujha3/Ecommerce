import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../models/product.model.js';
import { generateTags } from '../utils/tagGenerator.js';

dotenv.config();

const syncProducts = async () => {
    try {
        console.log("🚀 Starting Tag Sync...");
        
        // Connect to your Database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database Connected");

        // 1. Fetch all products
        const products = await ProductModel.find({});
        console.log(`📦 Found ${products.length} products to process.`);

        let updatedCount = 0;

        // 2. Loop through and update
        for (const product of products) {
            const newTags = generateTags(product.name, product.description);
            
            // Only update if tags have changed or are empty
            if (newTags.length > 0) {
                product.tags = [...new Set([...product.tags, ...newTags])];
                await product.save();
                updatedCount++;
                console.log(`✅ Updated: ${product.name} -> [${newTags.join(", ")}]`);
            }
        }

        console.log(`\n✨ Sync Complete! Updated ${updatedCount} products.`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Sync Failed:", error);
        process.exit(1);
    }
};

syncProducts();