// models/Vehicule.js
import mongoose from "mongoose";

const vehiculeSchema = new mongoose.Schema({
  marque: {
    type: String,
    required: true
  },
  modele: {
    type: String,
    required: true
  },
  immatriculation: {
    type: String,
    required: true,
    unique: true
  },
  statut: {
    type: String,
    enum: ["Disponible", "En mission", "En panne", "En maintenance"],
    default: "Disponible"
  },
  carburant: {
    type: String,
    enum: ["Essence", "Diesel", "Électrique", "Hybride"]
  },
  dateMiseEnCirculation: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model("Vehicule", vehiculeSchema);
