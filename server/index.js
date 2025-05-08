import express, { response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import connectToDatabase from "./db/db.js";
import dotenv from "dotenv";
import vehiculeRoutes from "./routes/vehiculeRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";
import interventionRoutes from "./routes/interventionRoutes.js";
import interventionExterneRoutes from "./routes/interventionExterne.js";
import fournitureRoutes from "./routes/fournitureRoutes.js";
import fournisseurRoutes from "./routes/fournisseurRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import marqueRoutes from "./routes/marqueRoutes.js";
import prestataireRoutes from "./routes/prestataireRoutes.js";
import statsRoute from "./routes/statsRoute.js";
import userRoutes from "./routes/userRoutes.js";
import employeRoutes from "./routes/employeRoutes.js";
import technicienRoutes from "./routes/technicienRoutes.js";

import { Server } from "socket.io";
import http from "http";
// const path = require("path");
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Create an HTTP server for the Express app
const server = http.createServer(app);
app.use("/files", express.static(path.join(__dirname, "upload/files")));
app.use("/uploads", express.static("uploads"));

// Create a Socket.IO server attached to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (userId) => {
    console.log(`User ${userId} joined the room`);
    socket.join(userId); // Important pour l'envoi ciblé
  });
});
export { io };
export const sendNotification = (destinataireId, notification) => {
  console.log(`Emitting notification to userId: ${destinataireId}`);
  console.log("Notification object:", notification); // debug

  io.to(destinataireId.toString()).emit("receive-notification", notification);
};

// Load environment variables
dotenv.config();

// Check for required environment variables
const { PORT, MONGODB_URL, JWT_KEY, VITE_API_BASE_URL } = process.env;
if (!MONGODB_URL || !JWT_KEY || !VITE_API_BASE_URL) {
  console.error("Error: Required environment variables are missing.");
  process.exit(1); // Stop the application if any required variable is missing
}
// Connect to MongoDB before starting the server
connectToDatabase()
  .then(() => {
    // If successful, start the Express server
    // CORS configuration for the Express app
    const allowedOrigins = [VITE_API_BASE_URL, "http://localhost:5173"];
    const corsOptions = {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("CORS not allowed for this origin"));
        }
      },
      credentials: true, // Allow sending cookies with requests
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };

    // Apply CORS middleware
    app.use(cors(corsOptions));

    // Middleware to handle JSON data

    // Define routes
    app.use("/api/vehicules", vehiculeRoutes);
    app.use("/api/missions", missionRoutes);
    app.use("/api/auth", authRouter);
    app.use("/api/interventions", interventionRoutes);
    app.use("/api/interventions-externes", interventionExterneRoutes);
    app.use("/api/fournitures", fournitureRoutes);
    app.use("/api/fournisseurs", fournisseurRoutes);
    app.use("/api/dashboard", dashboardRoutes);
    app.use("/api/marques", marqueRoutes);
    app.use("/api/prestataires", prestataireRoutes);
    app.use("/api/notifications", notificationRoutes);
    app.use("/api/stats", statsRoute);
    app.use("/api/users", userRoutes);
    app.use("/api/employees", employeRoutes);
    app.use("/api/techniciens", technicienRoutes);
    // Clean up old notifications every 24 hours
    setInterval(async () => {
      const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
      await Notification.deleteMany({ dateCreation: { $lt: cutoffDate } });
    }, 24 * 60 * 60 * 1000); // Every 24 hours

    // Log incoming requests
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.originalUrl}`);
      next();
    });

    // Handle 404 errors
    app.use((req, res) => {
      res.status(404).json({ message: "Endpoint not found" });
    });

    // General error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      const status = err.status || 500;
      const message = status === 500 ? "Internal server error" : err.message;
      res.status(status).json({ message });
    });

    // Start the server
    const serverPort = PORT || 5000;
    server.listen(serverPort, "0.0.0.0", () => {
      console.log(`Server started on port ${serverPort}`);
    });
  })
  .catch((err) => {
    // If MongoDB connection fails, stop the application
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
