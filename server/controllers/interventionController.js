import { sendNotification } from "../utils/sendNotification.js";
import User from "../models/User.js";
import Intervention from "../models/Intervention.js";

export const createIntervention = async (req, res) => {
  try {
    const {
      type,
      description,
      dateIntervention,
      cout,
      statut,
      kilometrage,
      duree,
      technicien,
      vehicule,
    } = req.body;

    const intervention = new Intervention({
      type,
      description,
      dateIntervention,
      cout,
      statut,
      kilometrage,
      duree,
      technicien,
      vehicule,
    });

    const savedIntervention = await intervention.save();

    // ✅ Notification au directeur
    const directeur = await User.findOne({ role: "directeur" });
    if (directeur) {
      await sendNotification(
        directeur._id,
        "intervention",
        `Une intervention a été créée pour le véhicule ${vehicule} par le technicien ${technicien}.`
      );
    }

    res.status(201).json(savedIntervention);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'intervention", error });
  }
};

// Supprimer un véhicule
export const deleteIntervention = async (req, res) => {
  const interventionId = req.query.interventionid; // Retrieve the ID from the query string
console.log(interventionId, "interventionIdsss");
  try {
    const deleted = await Intervention.findByIdAndDelete(interventionId); // Use the ID from the query string
    if (!deleted)
      return res.status(404).json({ message: "Véhicule non trouvé" });
    res.status(200).json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};

export const getAllInterventions = async (req, res) => {
  try {
    const interventions = await Intervention.find()
      .populate({
        path: "vehicule",
        select: "marque modele immatriculation", // sélectionner uniquement marque, modèle et immatriculation
      })
      .populate({
        path: "technicien",
        select: "name prenom", // sélectionner uniquement nom et prénom du technicien
      });

    res.status(200).json(interventions);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des interventions",
      error: err.message,
    });
  }
};
export const getInterventionById = async (req, res) => {
  try {
    const intervention = await Intervention.findById(req.params.id); // Utilise l'ID dans la route pour trouver l'intervention
    if (!intervention) {
      return res.status(404).json({ message: "Intervention non trouvée" });
    }
    res.status(200).json(intervention); // Retourne l'intervention trouvée
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération de l'intervention",
        error: err.message,
      });
  }
};


export const updateIntervention = async (req, res) => {
  try {
    const interventionId = req.query.interventionid; // ⬅️ récupérer l'id depuis la query string

    if (!interventionId) {
      return res
        .status(400)
        .json({ message: "ID du véhicule manquant dans les query params" });
    }

    const updated = await Intervention.findByIdAndUpdate(interventionId, req.body, {
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
