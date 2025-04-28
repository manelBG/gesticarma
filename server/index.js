import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import connectToDatabase from './db/db.js';
import dotenv from 'dotenv';
import vehiculeRoutes from './routes/vehiculeRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import interventionRoutes from './routes/interventionRoutes.js';
import interventionExterneRoutes from './routes/interventionExterne.js';
import fournitureRoutes from './routes/fournitureRoutes.js';
import fournisseurRoutes from './routes/fournisseurRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js';
import marqueRoutes from './routes/marqueRoutes.js';
import prestataireRoutes from './routes/prestataireRoutes.js';
import statsRoute from './routes/statsRoute.js'; 
import userRoutes from './routes/userRoutes.js';
import employeRoutes from './routes/employeRoutes.js';
import technicienRoutes from './routes/technicienRoutes.js';








// Charger les variables d'environnement
dotenv.config();

// Vérification des variables d'environnement
const { PORT, MONGODB_URL, JWT_KEY, VITE_API_BASE_URL } = process.env;

if (!MONGODB_URL || !JWT_KEY || !VITE_API_BASE_URL) {
  console.error('Erreur : Les variables d\'environnement requises sont manquantes.');
  process.exit(1); // Arrêter l'application si une variable d'environnement est manquante
}



// Connexion à MongoDB avant de démarrer le serveur
connectToDatabase()
  .then(() => {
    // Si la connexion réussit, démarrer le serveur Express
    const app = express();

    // Middleware CORS
    const allowedOrigins = [VITE_API_BASE_URL, 'http://localhost:5173']; // Pour développement et production
    const corsOptions = {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('CORS non autorisé pour cette origine'));
        }
      },
      credentials: true, // Permet d'envoyer les cookies avec les requêtes
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };

    // Appliquer le middleware CORS avec la configuration
    app.use(cors(corsOptions));

    // Middleware pour gérer les données JSON
    app.use(express.json());


    app.use('/api/vehicules', vehiculeRoutes);

    app.use('/api/missions', missionRoutes); // ✅ Ce préfixe est important !

    app.use('/api/auth', authRouter);

    app.use('/api/interventions', interventionRoutes);

    app.use('/api/interventions-externes', interventionExterneRoutes);

    app.use('/api/fournitures', fournitureRoutes);

    app.use('/api/fournisseurs', fournisseurRoutes);

    app.use("/api/dashboard", dashboardRoutes);

    app.use('/api/marques', marqueRoutes);

    app.use('/api/prestataires', prestataireRoutes);
    
    app.use('/api/notifications', notificationRoutes);
    
    app.use('/api/stats', statsRoute);

    app.use('/api/users', userRoutes);
    
    app.use('/api/employees', employeRoutes);

    app.use('/api/technicien', technicienRoutes); 


    setInterval(async () => {
      const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      await Notification.deleteMany({ dateCreation: { $lt: cutoffDate } });
    }, 24 * 60 * 60 * 1000); // Toutes les 24h
    
    
   
    // Middleware de logging des requêtes
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.originalUrl}`);
      next();
    });

    // Middleware de gestion des erreurs 404 (Route non trouvée)
    app.use((req, res, next) => {
      res.status(404).json({ message: 'Endpoint non trouvé' });
    });

    // Middleware de gestion des erreurs générales
    app.use((err, req, res, next) => {
      console.error(err.stack);
      const status = err.status || 500;
      const message = status === 500 ? 'Erreur interne du serveur' : err.message;
      res.status(status).json({ message });
    });

    app.use((req, res, next) => {
      console.log(`Requête reçue: ${req.method} ${req.url}`);
      next();
    });
    
    // Démarrer le serveur
    const serverPort = PORT || 5000;
    app.listen(serverPort, '0.0.0.0', () => {
      console.log(`Serveur démarré sur le port ${serverPort}`);
    });
  })
  .catch((err) => {
    // Si la connexion échoue, afficher l'erreur et ne pas démarrer le serveur
    console.error('Échec de la connexion à MongoDB:', err.message);
    process.exit(1); // Arrêter l'application si la connexion à la base de données échoue
  });
