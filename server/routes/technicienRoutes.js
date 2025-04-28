import express from 'express';
import { addTechnicien, getAllTechniciens, deleteTechnicien, updateTechnicien } from '../controllers/technicienController.js';

const router = express.Router();

// Ajouter un technicien
router.post('/createTechnicien', addTechnicien);

// Récupérer tous les techniciens
router.get('/getAllTechniciens', getAllTechniciens);

// Supprimer un technicien
router.delete('/deleteTechnicien/:id', deleteTechnicien); // Utilisation de :id

// Mettre à jour un technicien
router.put('/updateTechnicien/:id', updateTechnicien); // Utilisation de :id

export default router;
