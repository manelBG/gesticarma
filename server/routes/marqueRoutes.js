import express from 'express';
import {
  ajouterMarque,
  getAllMarques,
  updateMarque,
  deleteMarque
} from '../controllers/marqueController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔒 Routes protégées par le token
router.post('/', verifyToken, ajouterMarque);
router.get('/', verifyToken, getAllMarques);
router.put('/:id', verifyToken, updateMarque);
router.delete('/:id', verifyToken, deleteMarque);

export default router;
