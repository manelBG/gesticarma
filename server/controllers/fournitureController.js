import Fourniture from '../models/Fourniture.js';

import mongoose from 'mongoose';

export const ajouterFourniture = async (req, res) => {
  try {
    const {
      nom,
      marque,
      quantite,
      dateAjout,
      typeFourniture,
      reference,
      description,
      dimension,
      typeFiltre,
      typeLubrifiant,
      fournisseur,
      technicien
    } = req.body;

    if (!['PieceDetachee', 'Pneumatique', 'Filtre', 'LubrifiantFluide'].includes(typeFourniture)) {
      return res.status(400).json({ message: 'Type de fourniture invalide.' });
    }

    const nouvelleFourniture = new Fourniture({
      nom,
      marque: new mongoose.Types.ObjectId(marque),
      quantite,
      dateAjout,
      typeFourniture,
      fournisseur: new mongoose.Types.ObjectId(fournisseur),
      technicien: new mongoose.Types.ObjectId(technicien)
    });

    // Champs conditionnels
    if (typeFourniture === 'PieceDetachee') {
      if (!reference || !description) {
        return res.status(400).json({ message: 'Référence et description requises pour une pièce détachée.' });
      }
      nouvelleFourniture.reference = reference;
      nouvelleFourniture.description = description;
    } else if (typeFourniture === 'Pneumatique') {
      if (!dimension) {
        return res.status(400).json({ message: 'Dimension requise pour un pneumatique.' });
      }
      nouvelleFourniture.dimension = dimension;
    } else if (typeFourniture === 'Filtre') {
      if (!typeFiltre || !description) {
        return res.status(400).json({ message: 'Type de filtre et description requis pour un filtre.' });
      }
      nouvelleFourniture.typeFiltre = typeFiltre;
      nouvelleFourniture.description = description;
    } else if (typeFourniture === 'LubrifiantFluide') {
      if (!typeLubrifiant) {
        return res.status(400).json({ message: 'Type de lubrifiant requis.' });
      }
      nouvelleFourniture.typeLubrifiant = typeLubrifiant;
    }

    console.log("Fourniture à sauvegarder :", nouvelleFourniture);

    await nouvelleFourniture.save();

    res.status(201).json({
      message: 'Fourniture ajoutée avec succès.',
      fourniture: nouvelleFourniture
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la fourniture :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout de la fourniture." });
  }
};
