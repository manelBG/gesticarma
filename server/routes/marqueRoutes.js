import express from 'express';
import {
  ajouterMarque,
  getAllMarques,
  updateMarque,
  deleteMarque
} from '../controllers/marqueController.js';
//import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔒 Routes protégées par le token
router.post('/', ajouterMarque);
router.get('/', getAllMarques);
router.put('/:id',  updateMarque);
router.delete('/:id',  deleteMarque);

export default router;
