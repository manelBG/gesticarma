import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
// import { protect } from "../middlewares/authMiddleware.js"; // if you're using JWT

const router = express.Router();

// Create a notification
router.post("/", createNotification);

// Get all notifications for the logged-in user
// routes/notificationRoutes.js
router.get("/getUserNotifications/:userId", getUserNotifications);

// Mark one as read
router.put("/:id/read", markAsRead);

export default router;
