import express from 'express';
import { createMission, getAllMissions, getMissionsByUserId, getMissions, deleteMission, updateMission} from '../controllers/missionController.js';  // Importer les fonctions du contrôleur
import { verifyToken } from '../middlewares/authMiddleware.js'; 



const router = express.Router();


// Récupérer toutes les missions (admin)
router.get("/getAllMissions", getAllMissions);

// Récupérer les missions par employé
router.get("/", verifyToken, getMissions);

// Route pour récupérer les missions par userId
router.get('/missions/:userId', getMissionsByUserId);


// Créer une mission (employé ou admin)
router.post("/createMission", createMission);

// 🧹 Supprimer une mission
router.delete('/:id', deleteMission);

router.put('/:id', verifyToken, updateMission); 


export default router;
