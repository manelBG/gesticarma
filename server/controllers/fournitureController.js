import Fourniture from "../models/Fourniture.js";

export const createFourniture = async (req, res) => {
  try {
    const newFourniture = new Fourniture(req.body);
    await newFourniture.save();
    res.status(201).json(newFourniture);
  } catch (error) {
    console.error(error); // <-- ajoute ça pour voir dans la console
    res
      .status(500)
      .json({ message: "Erreur serveur lors de l'ajout de la fourniture." });
  }
};

export const getAllFournitures = async (req, res) => {
  try {
    const fournitures = await Fourniture.find()
    .populate({
      path: "technicien",
      select: "nom prenom ", // sélectionner uniquement nom et prénom du technicien
    })
    .populate({
      path: "marque",
      select: "nom",
    })
    .populate({
      path: "fournisseur",
      select: "nom",
    });

    res.status(200).json(fournitures);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des fournitures",
      error: err.message,
    });
  }
};


export const updateFournitures = async (req, res) => {
  try {
    const fournitureId = req.query.fournitureid; // ⬅️ récupérer l'id depuis la query string

    if (!fournitureId) {
      return res
        .status(400)
        .json({ message: "ID du véhicule manquant dans les query params" });
    }

    const updated = await Fourniture.findByIdAndUpdate(fournitureId, req.body, {
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

export const deleteFourniture = async (req, res) => {
  const fournitureId = req.query.fournitureid; // Retrieve the ID from the query string
console.log(fournitureId, "fournitureIdsss");
  try {
    const deleted = await Fourniture.findByIdAndDelete(fournitureId); // Use the ID from the query string
    if (!deleted)
      return res.status(404).json({ message: "Véhicule non trouvé" });
    res.status(200).json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};