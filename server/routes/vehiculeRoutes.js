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
router.post("/createVeicule", createVehicule);
router.get("/getAllVeh", getVehicules);
router.get("/:id", getVehiculeById);
router.put("/updateVeh", updateVehicule);
router.delete("/deleteVeh", deleteVehicule);

export default router;
