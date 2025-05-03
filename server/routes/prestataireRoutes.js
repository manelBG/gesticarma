import express from 'express';
import {
  ajouterPrestataire,
  getAllPrestataires,
  updatePrestataire,
  deletePrestataire
} from '../controllers/prestataireController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔒 Routes protégées
router.post('/', verifyToken, ajouterPrestataire);
router.get("/getAllPrestataires", getAllPrestataires);
router.put('/:id', verifyToken, updatePrestataire);
router.delete('/:id', verifyToken, deletePrestataire);

export default router;
