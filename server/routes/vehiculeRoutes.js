// routes/vehiculeRoutes.js
import express from "express";
import {
  createVehicule,
  getVehicules,
  getVehiculeById,
  updateVehicule,
  deleteVehicule
} from "../controllers/vehiculeController.js";

const router = express.Router();

// Routes
router.post("/", createVehicule);
router.get("/", getVehicules);
router.get("/:id", getVehiculeById);
router.put("/:id", updateVehicule);
router.delete("/:id", deleteVehicule);

export default router;
