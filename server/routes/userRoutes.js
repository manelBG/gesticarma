import express from 'express';
import { getAllEmployes } from '../controllers/userController.js';
import { verifyToken } from "../middlewares/authMiddleware.js";
import { registerUser } from '../controllers/userController.js';

const router = express.Router();
router.post('/register', registerUser);

// 👉 GET /api/users/employes
router.get('/employes', verifyToken, getAllEmployes);


export default router;
