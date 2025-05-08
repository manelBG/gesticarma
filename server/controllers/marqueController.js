import Marque from '../models/Marque.js';

// ➕ Ajouter une marque
export const ajouterMarque = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const marqueExistante = await Marque.findOne({ nom });
    if (marqueExistante) {
      return res.status(400).json({ message: 'Cette marque existe déjà.' });
    }

    const nouvelleMarque = new Marque({ nom, description });
    await nouvelleMarque.save();
    res.status(201).json(nouvelleMarque);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de la marque.' });
  }
};

// 📋 Récupérer toutes les marques
export const getAllMarques = async (req, res) => {
  try {
    const marques = await Marque.find().populate('fournitures');
    res.status(200).json(marques);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des marques.' });
  }
};

// ✏️ Modifier une marque
export const updateMarque = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMarque = await Marque.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMarque) return res.status(404).json({ message: 'Marque non trouvée' });
    res.status(200).json(updatedMarque);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la marque.' });
  }
};

// ❌ Supprimer une marque
export const deleteMarque = async (req, res) => {
  try {
    const { id } = req.params;
    await Marque.findByIdAndDelete(id);
    res.status(200).json({ message: 'Marque supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la marque.' });
  }
};
