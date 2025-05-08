import InterventionExterne from "../models/InterventionExterne.js";
import Prestataire from "../models/Prestataire.js";
import Vehicule from "../models/Vehicule.js";

export const createInterventionExterne = async (req, res) => {
  try {
    const {
      description,
      dateDebut,
      dateFin,
      cout,
      factureNumero,
      etat,
      vehicule,
      prestataire,
      technicien,
    } = req.body;

    const vehiculeExists = await Vehicule.findById(vehicule);
    if (!vehiculeExists) {
      return res.status(404).json({ message: "Véhicule non trouvé" });
    }

    const prestataireExists = await Prestataire.findById(prestataire);
    if (!prestataireExists) {
      return res.status(404).json({ message: "Prestataire non trouvé" });
    }

    const newIntervention = new InterventionExterne({
      description,
      dateDebut,
      dateFin,
      cout,
      factureNumero,
      etat,
      vehicule,
      prestataire,
      technicien,
    });

    await newIntervention.save();
    await Vehicule.findByIdAndUpdate(vehicule, { statut: "En panne" });

    res.status(201).json(newIntervention);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllInterventionsExternes = async (req, res) => {
  try {
    // Populate pour les deux références : vehicule et prestataire
    const interventions = await InterventionExterne.find()
      .populate("vehicule")
      .populate("technicien")
      .populate("prestataire");
    res.status(200).json(interventions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterventionExterneById = async (req, res) => {
  try {
    // Populate pour les deux références : vehicule et prestataire
    const intervention = await InterventionExterne.findById(req.params.id)
      .populate("vehicule")
      .populate("prestataire");
    if (!intervention)
      return res.status(404).json({ message: "Intervention non trouvée" });
    res.status(200).json(intervention);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInterventionExterne = async (req, res) => {
  try {
    // Mise à jour de l'intervention et retour des nouvelles données
    const updated = await InterventionExterne.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("vehicule")
      .populate("prestataire");
    if (!updated)
      return res.status(404).json({ message: "Intervention non trouvée" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInterventionExterne = async (req, res) => {
  try {
    // Suppression de l'intervention
    const deleted = await InterventionExterne.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Intervention non trouvée" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const archiveInterventionExterne = async (req, res) => {
  try {
    const updated = await InterventionExterne.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ message: "Intervention externe non trouvée" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};