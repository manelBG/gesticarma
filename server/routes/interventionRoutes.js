import express from 'express';
import {
  createIntervention,         // Utilise createIntervention pour une intervention interne
  getAllInterventions,        // Utilise getAllInterventions pour récupérer toutes les interventions internes
  getInterventionById,        // Utilise getInterventionById pour récupérer une intervention interne par ID
  updateIntervention,         // Utilise updateIntervention pour mettre à jour une intervention interne
  deleteIntervention          // Utilise deleteIntervention pour supprimer une intervention interne
} from '../controllers/interventionController.js';
import auth from '../middlewares/authMiddleware.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; // ✅ Import correct de verifyToken


const router = express.Router();

// Routes pour l'intervention interne
// Admin ou technicien
router.get('/interventions', verifyToken(['admin', 'technicien']), getAllInterventions);

// Créer une intervention interne
router.post('/interventions', verifyToken(['admin', 'technicien']), createIntervention);

router.get('/:id', auth, getInterventionById);  // Récupère une intervention interne par ID

router.put('/:id', auth, updateIntervention);  // Met à jour une intervention interne

router.delete('/:id', auth, deleteIntervention);  // Supprime une intervention interne

export default router;
