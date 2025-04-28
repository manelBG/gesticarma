import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, role, telephone, genre } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà." });
    }

    // Ne pas hacher le mot de passe ici, laissez le hook pre-save s'en charger
    const newUser = new User({
      nom,
      prenom,
      email,
      password, // Mot de passe en clair, sera haché par le hook pre-save
      role,
      telephone,
      genre,
    });

    await newUser.save();

    res.status(201).json({ message: "Utilisateur enregistré avec succès !" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// 👉 Récupérer tous les employés
export const getAllEmployes = async (req, res) => {
  try {
    const employes = await User.find({ role: "employee" }).select("nom prenom email telephone")
    res.status(200).json(employes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });

  }
};
