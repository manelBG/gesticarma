import express from 'express';
import { createFourniture, deleteFourniture, getAllFournitures, updateFournitures } from "../controllers/fournitureController.js";

const router = express.Router();

router.post("/createFourniture", createFourniture);
router.get("/getAllFournitures", getAllFournitures);
router.put("/updateFournitures", updateFournitures);  // Met à jour une intervention interne
router.delete("/deleteFourniture", deleteFourniture);  // Supprime une intervention interne

export default router;
