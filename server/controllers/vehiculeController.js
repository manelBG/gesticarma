// controllers/vehiculeController.js
import Vehicule from "../models/Vehicule.js";

// Créer un véhicule
export const createVehicule = async (req, res) => {
  try {
    const newVehicule = new Vehicule(req.body);
    const savedVehicule = await newVehicule.save();
    res.status(201).json(savedVehicule);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
};

// Obtenir tous les véhicules
export const getVehicules = async (req, res) => {
  try {
    const vehicules = await Vehicule.find();
    res.status(200).json(vehicules);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error });
  }
};

// Obtenir un véhicule par ID
export const getVehiculeById = async (req, res) => {
  try {
    const vehicule = await Vehicule.findById(req.params.id);
    if (!vehicule) return res.status(404).json({ message: "Véhicule non trouvé" });
    res.status(200).json(vehicule);
  } catch (error) {
    res.status(500).json({ message: "Erreur", error });
  }
};

// Mettre à jour un véhicule
export const updateVehicule = async (req, res) => {
  try {
    const vehiculeId = req.query.vehiculeid; // ⬅️ récupérer l'id depuis la query string

    if (!vehiculeId) {
      return res
        .status(400)
        .json({ message: "ID du véhicule manquant dans les query params" });
    }

    const updated = await Vehicule.findByIdAndUpdate(vehiculeId, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Véhicule non trouvé" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
};



// Supprimer un véhicule
export const deleteVehicule = async (req, res) => {
  const vehiculeId = req.query.vehiculeid; // Retrieve the ID from the query string

  try {
    const deleted = await Vehicule.findByIdAndDelete(vehiculeId); // Use the ID from the query string
    if (!deleted)
      return res.status(404).json({ message: "Véhicule non trouvé" });
    res.status(200).json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};
