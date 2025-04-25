import Fournisseur from '../models/Fournisseur.js';

// Ajouter un fournisseur
export const ajouterFournisseur = async (req, res) => {
  try {
    const nouveauFournisseur = new Fournisseur(req.body);
    const saved = await nouveauFournisseur.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir tous les fournisseurs
export const getFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.find().populate('fournitures');
    res.status(200).json(fournisseurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Détails d’un fournisseur
export const getFournisseurById = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findById(req.params.id).populate('fournitures');
    if (!fournisseur) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    res.status(200).json(fournisseur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un fournisseur
export const supprimerFournisseur = async (req, res) => {
  try {
    await Fournisseur.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Fournisseur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
