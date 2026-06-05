import mongoose from 'mongoose';
import ProductModel from "../models/product.model.js";
import { generateTags } from '../utils/tagGenerator.js';
import { generateTagsForProduct } from "../utils/aiHelper.js"; // <--- 1. IMPORT ADDED HERE

export const createProductController = async(request,response)=>{
    try {
        const { 
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = request.body 

        if(!name || !image[0] || !category[0] || !unit || !price || !description ){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        // 2. GENERATE TAGS HERE
        const autoTags = generateTags(name, description);

        const product = new ProductModel({
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
            tags: autoTags // <--- 3. SAVE TAGS TO DATABASE
        })
        const saveProduct = await product.save()

        return response.json({
            message : "Product Created Successfully",
            data : saveProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductController = async(request,response)=>{
    try {
        
        let { page, limit, search } = request.body 

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data,totalCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const product = await ProductModel.find({ 
            category : { $in : id }
        }).limit(15)

        return response.json({
            message : "category product list",
            data : product,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategoryAndSubCategory = async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.body;

        if (!categoryId || !subCategoryId || subCategoryId === "undefined") {
             return res.status(400).json({
                message: "Valid SubCategory ID is required",
                error: true,
                success: false
            });
        }

        if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
             return res.status(400).json({
                message: "Invalid SubCategory ID Format",
                error: true,
                success: false
            });
        }

        const data = await ProductModel.find({ 
            category: categoryId, 
            subCategory: subCategoryId 
        });
        
        res.json({ data: data, success: true });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: error.message });
    }
}

export const getProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body 

        const product = await ProductModel.findOne({ _id : productId })

        return response.json({
            message : "product details",
            data : product,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : _id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export const getTaggingStats = async (req, res) => {
    try {
        const total = await ProductModel.countDocuments();
        const untagged = await ProductModel.countDocuments({
            $or: [
                { tags: { $exists: false } },
                { tags: { $size: 0 } }
            ]
        });

        return res.json({
            success: true,
            total,
            tagged: total - untagged,
            untagged,
            healthPercentage: total > 0 ? (((total - untagged) / total) * 100).toFixed(2) : 0
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const runAutoTaggingAction = async (req, res) => {
    try {
        const products = await ProductModel.find({
            $or: [{ tags: { $exists: false } }, { tags: { $size: 0 } }]
        });

        for (const product of products) {
            const newTags = await generateTagsForProduct(product);
            if (newTags.length > 0) {
                product.tags = newTags;
                await product.save();
            }
            
            // ✅ INCREASE DELAY: 5000ms (5 seconds)
            // This keeps you safely under the 20 requests/minute limit
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        res.json({ success: true, message: "Sync complete" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//search product
export const searchProduct = async(request,response)=>{
   try {
        let { search, page , limit } = request.query 

        console.log("Server Received Query:", request.query);
        
        if(!page){
            page = 1
        }
        if(!limit){
            limit  = 10
        }

        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } } // <--- 4. ADDED TAG SEARCH
            ]
        } : {}

        const skip = ( page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt  : -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            data : data,
            totalCount :dataCount,
            totalPage : Math.ceil(dataCount/limit),
            page : page,
            limit : limit 
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}