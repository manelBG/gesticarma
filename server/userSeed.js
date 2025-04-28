import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose"; 
import User from "./models/User.js";
import connectToDatabase from "./db/db.js";

const userRegister = async () => {
  try {
    // Connexion à la base de données
    await connectToDatabase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: "hassenmrabet@gmail.com" });

    if (existingUser) {
      console.log("L'utilisateur avec cet email existe déjà !");
      return;
    }

    // Créer un nouvel utilisateur SANS hacher le mot de passe
    // Le hook pre-save se chargera de le hacher
    const newUser = new User({
      nom: "Mrabet",
      prenom: "Hassen",
      email: "hassenmrabet@gmail.com",
      password: "hassen123",  // Mot de passe en clair, sera haché par le hook pre-save
      role: "admin",
      telephone: "20129410",
      genre: "male"
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