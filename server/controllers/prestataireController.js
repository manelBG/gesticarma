import Prestataire from '../models/Prestataire.js';

// ➕ Ajouter un prestataire
export const ajouterPrestataire = async (req, res) => {
  try {
    const { nom, adresse, telephone, specialite } = req.body;

    const nouveauPrestataire = new Prestataire({
      nom,
      adresse,
      telephone,
      specialite
    });

    await nouveauPrestataire.save();
    res.status(201).json(nouveauPrestataire);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du prestataire.' });
  }
};

// 📋 Récupérer tous les prestataires
export const getAllPrestataires = async (req, res) => {
  try {
    const prestataires = await Prestataire.find();
    res.status(200).json(prestataires);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des prestataires.' });
  }
};

// ✏️ Modifier un prestataire
export const updatePrestataire = async (req, res) => {
  try {
    const { id } = req.params;
    const prestataireModifie = await Prestataire.findByIdAndUpdate(id, req.body, { new: true });

    if (!prestataireModifie) {
      return res.status(404).json({ message: 'Prestataire non trouvé.' });
    }

    res.status(200).json(prestataireModifie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du prestataire.' });
  }
};

// ❌ Supprimer un prestataire
export const deletePrestataire = async (req, res) => {
  try {
    const { id } = req.params;
    await Prestataire.findByIdAndDelete(id);
    res.status(200).json({ message: 'Prestataire supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du prestataire.' });
  }
};
