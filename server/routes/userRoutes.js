import express from 'express';
import { getAllEmployes } from '../controllers/userController.js';
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 👉 GET /api/users/employes
router.get('/employes', verifyToken, getAllEmployes);

export default router;
