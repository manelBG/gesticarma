import User from '../models/User.js';

// 👉 Récupérer tous les employés
export const getAllEmployes = async (req, res) => {
  try {
    const employes = await User.find({ role: "employee" }).select("nom prenom email telephone")
    res.status(200).json(employes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });

  }
};
