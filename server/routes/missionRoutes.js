import express from 'express';
import { createMission, getAllMissions, getMissionsByUserId, getMissions, deleteMission, updateMission, updateMissionStatut} from '../controllers/missionController.js';  // Importer les fonctions du contrôleur
import { verifyToken } from '../middlewares/authMiddleware.js'; 
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
// Create uploads directory if not exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `file_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Récupérer toutes les missions (admin)
router.get("/getAllMissions", getAllMissions);

// Récupérer les missions par employé
router.get("/", verifyToken, getMissions);

// Route pour récupérer les missions par userId
router.get("/getMissionsByUserId", getMissionsByUserId);
router.put("/updateMissionStatut", updateMissionStatut);


// Créer une mission (employé ou admin)
router.post("/createMission", upload.single("rapport"), createMission);

// 🧹 Supprimer une mission
router.delete('/:id', deleteMission);

router.put('/:id', verifyToken, updateMission); 


export default router;
