import express from 'express';
import {
  ajouterFournisseur,
  getFournisseurs,
  getFournisseurById,
  supprimerFournisseur
} from '../controllers/fournisseurController.js';

const router = express.Router();

router.post('/', ajouterFournisseur); // Ajouter
router.get('/', getFournisseurs);     // Liste
router.get('/:id', getFournisseurById); // Détails
router.delete('/:id', supprimerFournisseur); // Supprimer

export default router;
