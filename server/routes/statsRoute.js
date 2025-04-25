import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { verifyToken } from "../middlewares/authMiddleware.js";



const router = Router();

router.get('/', verifyToken(),  getDashboardStats);

export default router;
