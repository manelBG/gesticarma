import { verifyToken } from "../middlewares/authMiddleware.js"; // ✅ Import correct de verifyToken
import express from "express";
import {
  createInterventionExterne,
  getAllInterventionsExternes,
  getInterventionExterneById,
  updateInterventionExterne,
  deleteInterventionExterne,
  archiveInterventionExterne,
} from "../controllers/interventionExterneController.js";
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
// Utilisation de verifyToken directement
// Pareil que internes
router.get("/allinterventionsExterne", getAllInterventionsExternes);
router.post(
  "/createinterventionsExterne",
  upload.single("rapport"),
  createInterventionExterne
);
router.get(
  "createinterventionsExterne/:id",
  verifyToken,
  getInterventionExterneById
);
router.put("/updateInterventionExterne/:id", updateInterventionExterne);
router.delete("/deleteInterventionExterne/:id", deleteInterventionExterne);
router.put("/archiveInterventionExterne/:id", archiveInterventionExterne);

export default router;
