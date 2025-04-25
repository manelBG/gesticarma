import express from "express";
import { getUserNotifications, markAsRead, createNotification } from "../controllers/notificationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createNotification);
router.get("/", authMiddleware, getUserNotifications);
router.put("/lu/:id", authMiddleware, markAsRead);

export default router;
