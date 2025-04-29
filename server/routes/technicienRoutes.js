// src/routes/technicienRoute.js

import express from 'express';
import {
  addTechnicien,
  getAllTechniciens,
  deleteTechnicien,
  updateTechnicien
} from '../controllers/technicienController.js';

const router = express.Router();

// 📌 Ajouter un technicien
router.post('/createTechnicien', addTechnicien);

// 📌 Récupérer tous les techniciens
router.get('/getAllTechniciens', getAllTechniciens);

// 📌 Mettre à jour un technicien (corrigé : récupération de l'ID dans l'URL)
router.put('/updateTechnicien/:id', updateTechnicien);

// 📌 Supprimer un technicien (corrigé : récupération de l'ID dans l'URL)
router.delete('/deleteTechnicien/:id', deleteTechnicien);

export default router;
