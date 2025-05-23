import User from "../models/User.js";
import Intervention from "../models/Intervention.js";
import Vehicule from "../models/Vehicule.js";
import Notification from "../models/Notification.js";
import { sendNotification } from "../index.js";

// export const createIntervention = async (req, res) => {
//   try {
//     const {
//       type,
//       description,
//       dateIntervention,
//       cout,
//       statut,
//       kilometrage,
//       duree,
//       technicien,
//       vehicule,
//     } = req.body;

//     const intervention = new Intervention({
//       type,
//       description,
//       dateIntervention,
//       cout,
//       statut,
//       kilometrage,
//       duree,
//       technicien,
//       vehicule,
//     });

//     const savedIntervention = await intervention.save();
//     await Vehicule.findByIdAndUpdate(vehicule, { statut: "En maintenance" });

//     // ✅ Notification au directeur
//     const directeur = await User.findOne({ role: "directeur" });
//     if (directeur) {
//       await sendNotification(
//         directeur._id,
//         "intervention",
//         `Une intervention a été créée pour le véhicule ${vehicule} par le technicien ${technicien}.`
//       );
//     }

//     res.status(201).json(savedIntervention);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Erreur lors de la création de l'intervention", error });
//   }
// };

// Supprimer un véhicule
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

    // Création de l'intervention
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

    // Mise à jour du statut du véhicule
    await Vehicule.findByIdAndUpdate(vehicule, { statut: "En maintenance" });

    // Récupération des données complètes de l'intervention avec populate
    const fullIntervention = await Intervention.findById(
      savedIntervention._id
    ).populate("technicien");
    // Préparation du message de notification
    const message = `Une nouvelle intervention a été créée par le technicien ${fullIntervention.technicien.nom} ${fullIntervention.technicien.prenom}.`;
    // Récupération des admins
    const admins = await User.find({ role: "admin" });

    // Envoi des notifications aux admins
    for (const admin of admins) {
      const newNotification = await Notification.create({
        destinataireId: admin._id,
        type: "intervention",
        sousType: "creation",
        message,
        dateCreation: new Date(),
        lue: false,
      });

      // Envoi temps réel via Socket.IO
      sendNotification(admin._id.toString(), newNotification);
    }

    res.status(201).json(savedIntervention);
  } catch (error) {
    console.error("Erreur complète:", error); // <- Affichage complet
    res.status(500).json({
      message: "Erreur lors de la création de l'intervention",
      error: error.message, // <- Affiche juste le message de l'erreur au client
    });
  }
  
}

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
        select: "name prenom nom role", // sélectionner uniquement nom et prénom du technicien
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

export const archiveIntervention = async (req, res) => {
  const interventionId = req.query.interventionid;
  console.log(interventionId, "interventionId to archive");

  try {
    const archived = await Intervention.findByIdAndUpdate(
      interventionId,
      { isArchived: true },
      { new: true }
    );

    if (!archived)
      return res.status(404).json({ message: "Intervention non trouvée" });

    res
      .status(200)
      .json({ message: "Intervention archivée avec succès", archived });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'archivage", error });
  }
};