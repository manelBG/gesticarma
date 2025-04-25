import express from 'express';
import { login } from '../controllers/authController.js'; 

const router = express.Router();

// Route pour la connexion
router.post('/login', login);

export default router;
