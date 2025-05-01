import User from "../models/User.js";
import Mission from "../models/Mission.js"; // Assure-toi d'importer le modèle Mission
import Vehicule from "../models/Vehicule.js";
import Notification from "../models/Notification.js";
import { sendNotification } from "../index.js";
// ✔️ Créer une mission et envoyer une notification au directeur
export const createMission = async (req, res) => {
  try {
    const mission = new Mission(req.body);
    await mission.save();
    // ✅ Notification au directeur
    const directeur = await User.findOne({ role: "directeur" });
    if (directeur) {
      await sendNotification(
        directeur._id,
        "mission",
        `Une nouvelle mission a été créée par l'employé ${mission.employee} pour le véhicule ${mission.vehicule}.`
      );
    }

    // ✅ Mise à jour du statut du véhicule
    await Vehicule.findByIdAndUpdate(mission.vehicule, {
      statut: "En mission",
    });

    res.status(201).json(mission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✔️ Mettre à jour une mission (et notifier l’employé)
export const updateMission = async (req, res) => {
  try {
    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("employee vehicule");

    if (!updatedMission) {
      return res.status(404).json({ message: "Mission non trouvée" });
    }

    // ✅ Si le statut a changé (validée ou refusée), notifier l’employé
    if (req.body.statut === "validée" || req.body.statut === "refusée") {
      await sendNotification(
        updatedMission.employee._id,
        "mission",
        `Votre mission pour le véhicule ${updatedMission.vehicule.marque} ${updatedMission.vehicule.modele} a été ${req.body.statut} par le directeur.`
      );
    }

    res.status(200).json(updatedMission);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la mission",
      error: err.message,
    });
  }
};

// ✔️ Supprimer une mission
export const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id); // Suppression de la mission par son ID
    if (!mission) {
      return res.status(404).json({ message: "Mission non trouvée" });
    }
    res.status(200).json({ message: "Mission supprimée avec succès" });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la mission",
      error: err.message,
    });
  }
};

export const getAllMissions = async (req, res) => {
  try {
    // Récupérer toutes les missions
    const missions = await Mission.find().populate("employee vehicule"); // populate pour inclure les infos des employés et véhicules associés

    // Vérifie si des missions existent
    if (missions.length === 0) {
      return res.status(404).json({ message: "Aucune mission trouvée" });
    }

    res.status(200).json(missions); // Retourner les missions récupérées
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des missions",
      error: err.message,
    });
  }
};

export const getMissions = async (req, res) => {
  try {
    const user = req.user;

    let missions;

    // Admin & Technicien → tout voir
    if (user.role === "admin" || user.role === "technicien") {
      missions = await Mission.find().populate("vehicule employee createdBy");
    }

    // Employé → seulement les missions qu’il a créées
    else if (user.role === "employee") {
      missions = await Mission.find({ createdBy: user._id }).populate(
        "vehicule employee createdBy"
      );
    }

    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMissionsByUserId = async (req, res) => {
  try {
    const userId = req.query.userId; // Récupérer l'userId depuis les paramètres de la route
    const missions = await Mission.find({ employee: userId }); // Trouver toutes les missions créées par cet employé

    if (!missions || missions.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune mission trouvée pour cet employé." });
    }

    return res.status(200).json(missions); // Retourner les missions
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des missions." });
  }
};

export const updateMissionStatut = async (req, res) => {
  const { missionId } = req.query;
  const { statut, raisonRefus } = req.body;

  try {
    const updatedMission = await Mission.findByIdAndUpdate(
      missionId,
      { statut },
      { new: true }
    );

    if (!updatedMission) {
      return res.status(404).json({ message: "Mission non trouvée" });
    }

    // Récupérer les détails de la mission avec l'employé peuplé
    const mission = await Mission.findById(missionId).populate("employee");

    if (["en cours", "refuser"].includes(statut)) {
      const destinataireId = mission.employee._id;

      const messageBase = `Votre mission "${mission.missionName}" a été ${
        statut === "en cours" ? "acceptée" : "refusée"
      }.`;

      const message =
        statut === "refuser" && raisonRefus
          ? `${messageBase} Raison: ${raisonRefus}`
          : messageBase;

      await Notification.create({
        destinataireId,
        type: "mission",
        sousType: statut === "en cours" ? "acceptation" : "refus",
        message,
      });
      const newNotification = await Notification.create({
        destinataireId,
        type: "mission",
        sousType: statut === "en cours" ? "acceptation" : "refus",
        message,
        dateCreation: new Date(),
        lue: false,
      });

      sendNotification(destinataireId.toString(), newNotification);

      // Envoie ciblé
    }

    res.status(200).json(updatedMission);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la mission :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// export const updateMissionStatut = async (req, res) => {
//   try {
//     const { missionId, statut } = req.body;

//     const mission = await Mission.findById(missionId).populate("employee");

//     if (!mission)
//       return res.status(404).json({ message: "Mission non trouvée" });

//     mission.statut = statut;
//     await mission.save();

//     // Créer une notification si accepté ou refusé
//     // if (["en cours", "refuser"].includes(statut)) {
//     //   await Notification.create({
//     //     // expediteurId: req.user._id, // L'utilisateur connecté (admin)
//     //     destinataireId: mission.employee._id, // Le technicien/employé
//     //     type: "mission",
//     //     sousType: statut === "en cours" ? "acceptation" : "refus",
//     //     message: `Votre mission "${mission.missionName}" a été ${
//     //       statut === "en cours" ? "acceptée" : "refusée"
//     //     }.`,
//     //   });
//     // }

//     res.status(200).json(mission);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
