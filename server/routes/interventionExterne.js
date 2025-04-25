import { verifyToken } from '../middlewares/authMiddleware.js'; // ✅ Import correct de verifyToken
import express from 'express';
import { createInterventionExterne, getAllInterventionsExternes, getInterventionExterneById, updateInterventionExterne, deleteInterventionExterne } from '../controllers/interventionExterneController.js';

const router = express.Router();



// Utilisation de verifyToken directement
// Pareil que internes
router.get('/interventionsExterne', verifyToken(['admin', 'technicien']), getAllInterventionsExternes);
router.post('/interventionsExterne', verifyToken(['admin', 'technicien']),  createInterventionExterne);
router.get('/:id', verifyToken, getInterventionExterneById);
router.put('/:id', verifyToken, updateInterventionExterne);
router.delete('/:id', verifyToken, deleteInterventionExterne);

export default router;
