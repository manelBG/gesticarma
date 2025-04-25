import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose"; 
import bcrypt from "bcrypt";
import User from "./models/User.js";
import connectToDatabase from "./db/db.js";

const userRegister = async () => {
  try {
    // Connexion à la base de données
    await connectToDatabase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: "directeur@gmail.com" });

    if (existingUser) {
      console.log("L'utilisateur avec cet email existe déjà !");
      return;
    }

    // Hacher le mot de passe
    const hashPassword = await bcrypt.hash("directeur", 10);

    // Créer un nouvel utilisateur avec le mot de passe haché
    const newUser = new User({
      name: "directeur",
      email: "directeur@gmail.com",
      password: hashPassword,
      role: "admin",
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();
    console.log("Utilisateur enregistré avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
  } finally {
    // Fermer la connexion MongoDB
    await mongoose.connection.close();
    console.log("Connexion MongoDB fermée.");
  }
};

userRegister();
