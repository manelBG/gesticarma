import { verifyToken } from "../middlewares/authMiddleware.js"; // ✅ Import correct de verifyToken
import express from "express";
import {
  createInterventionExterne,
  getAllInterventionsExternes,
  getInterventionExterneById,
  updateInterventionExterne,
  deleteInterventionExterne,
} from "../controllers/interventionExterneController.js";

const router = express.Router();

// Utilisation de verifyToken directement
// Pareil que internes
router.get("/allinterventionsExterne", getAllInterventionsExternes);
router.post("/createinterventionsExterne", createInterventionExterne);
router.get(
  "createinterventionsExterne/:id",
  verifyToken,
  getInterventionExterneById
);
router.put("/updateInterventionExterne/:id", updateInterventionExterne);
router.delete("/deleteInterventionExterne/:id", deleteInterventionExterne);

export default router;
