import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 8080;
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.router.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';
import router from './route/mealRoutes.js';

const app = express();

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (origin === process.env.FRONTEND_URL) return callback(null, true);
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        if (origin.includes('localhost')) return callback(null, true);
        if (origin === 'http://43.204.37.227') return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    }
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev')); // Added 'dev' format to avoid the warning you saw earlier
app.use(helmet({ crossOriginResourcePolicy: false }));

// Routes
app.get("/", (request, response) => {
    response.json({ message: "Server is running on port " + PORT });
});

app.use('/api/user', userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/meals', router);

// Final: Connect to DB and start server once
connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log("Server is running on port", PORT);
    });
}).catch((err) => {
    console.error("Database connection failed:", err);
});