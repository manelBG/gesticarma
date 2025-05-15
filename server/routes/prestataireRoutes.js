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
router.post('/', ajouterPrestataire);
router.get("/getAllPrestataires", getAllPrestataires);
router.put('/:id', updatePrestataire);
router.delete('/:id', deletePrestataire);

export default router;
