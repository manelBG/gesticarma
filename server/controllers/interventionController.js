import { sendNotification } from '../utils/sendNotification.js';
import User from '../models/User.js';

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
      vehicule 
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
      vehicule
    });

    const savedIntervention = await intervention.save();

    // ✅ Notification au directeur
    const directeur = await User.findOne({ role: 'directeur' });
    if (directeur) {
      await sendNotification(
        directeur._id,
        'intervention',
        `Une intervention a été créée pour le véhicule ${vehicule} par le technicien ${technicien}.`
      );
    }

    res.status(201).json(savedIntervention);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'intervention', error });
  }
};

export const deleteIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.findByIdAndDelete(req.params.id);  // Supprimer l'intervention par son ID

    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }

    res.status(200).json({ message: 'Intervention supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'intervention', error: err.message });
  }
};

export const getAllInterventions = async (req, res) => {
  try {
    const interventions = await Intervention.find();  // Trouver toutes les interventions dans la base de données
    res.status(200).json(interventions);  // Retourner les interventions trouvées
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des interventions', error: err.message });
  }
};
export const getInterventionById = async (req, res) => {
  try {
    const intervention = await Intervention.findById(req.params.id);  // Utilise l'ID dans la route pour trouver l'intervention
    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }
    res.status(200).json(intervention);  // Retourne l'intervention trouvée
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'intervention', error: err.message });
  }
};
export const updateIntervention = async (req, res) => {
  try {
    const updatedIntervention = await Intervention.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ); // Mise à jour de l'intervention par son ID

    if (!updatedIntervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }

    res.status(200).json(updatedIntervention); // Retourne l'intervention mise à jour
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'intervention', error: err.message });
  }
};