import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../models/product.model.js';

dotenv.config();

const forceUpdateDirect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to DB");

        const targetId = "69394a81fb3f8c829ff62391"; // Your Lemon ID

        // 1. Direct Database Update (Bypasses Schema checks)
        const result = await ProductModel.collection.updateOne(
            { _id: new mongoose.Types.ObjectId(targetId) },
            { 
                $set: { 
                    tags: ["high protein", "high-protein", "food", "healthy"] 
                } 
            }
        );

        console.log("------------------------------------------------");
        console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

        if (result.modifiedCount > 0) {
            console.log("🎉 SUCCESS! Database confirmed the change.");
        } else {
            console.log("⚠️ No changes made (Maybe ID is wrong or tags already exist?)");
        }
        
        // 2. Verify immediately by reading it back
        const check = await ProductModel.findById(targetId);
        console.log("👀 VERIFICATION READ -> Tags in DB are now:", check.tags);
        console.log("------------------------------------------------");

        process.exit(0);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

forceUpdateDirect();