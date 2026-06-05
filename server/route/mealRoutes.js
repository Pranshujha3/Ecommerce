import express from 'express';
// Don't forget the .js extension!
import { recommendMeals } from '../controllers/mealController.js'; 

const router = express.Router();

router.post('/ai-search', recommendMeals);

export default router;