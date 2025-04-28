import express from 'express';
import { createMission, getAllMissions,   getMissionsByEmployee, deleteMission, updateMission} from '../controllers/missionController.js';  // Importer les fonctions du contrôleur
import { verifyToken } from '../middlewares/authMiddleware.js'; 



const router = express.Router();


// Récupérer toutes les missions (admin)
router.get('/', verifyToken(['admin']), getAllMissions);

// Récupérer les missions par employé

router.get('/employee/:id', verifyToken(['admin', 'employee']), getMissionsByEmployee);

// Créer une mission (employé ou admin)
router.post('/', verifyToken(['admin', 'employee' , 'technicien']), createMission);

// 🧹 Supprimer une mission
router.delete('/:id', deleteMission);

router.put('/:id', verifyToken(), updateMission);


export default router;
