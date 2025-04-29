import { sendNotification } from '../utils/sendNotification.js';
import User from '../models/User.js';
import Mission from '../models/Mission.js'; // Assure-toi d'importer le modèle Mission
import Vehicule from '../models/Vehicule.js';

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
    const updatedMission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('employee vehicule');

    if (!updatedMission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    // ✅ Si le statut a changé (validée ou refusée), notifier l’employé
    if (req.body.statut === 'validée' || req.body.statut === 'refusée') {
      await sendNotification(
        updatedMission.employee._id,
        'mission',
        `Votre mission pour le véhicule ${updatedMission.vehicule.marque} ${updatedMission.vehicule.modele} a été ${req.body.statut} par le directeur.`
      );
    }

    res.status(200).json(updatedMission);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la mission', error: err.message });
  }
};

// ✔️ Supprimer une mission
export const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);  // Suppression de la mission par son ID
    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    res.status(200).json({ message: 'Mission supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la mission', error: err.message });
  }
};

export const getAllMissions = async (req, res) => {
  try {
    // Récupérer toutes les missions
    const missions = await Mission.find().populate('employee vehicule'); // populate pour inclure les infos des employés et véhicules associés

    // Vérifie si des missions existent
    if (missions.length === 0) {
      return res.status(404).json({ message: 'Aucune mission trouvée' });
    }

    res.status(200).json(missions);  // Retourner les missions récupérées
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des missions', error: err.message });
  }
};

export const getMissionsByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;


    // 🔍 Logs pour vérifier ce qui se passe
    console.log("ID reçu :", employeeId);

    const missions = await Mission.find({ employee: employeeId});
    

    console.log("Missions trouvées :", missions);

    res.status(200).json(missions);
  } catch (error) {
    console.error("Erreur lors de la récupération des missions :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
