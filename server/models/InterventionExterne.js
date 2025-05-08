import mongoose from 'mongoose';

const interventionExterneSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    dateDebut: {
      type: Date,
      required: true,
    },
    dateFin: {
      type: Date,
      required: true,
    },
    technicien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // <- Si ton technicien est dans le modèle User
      // required: true,
    },
    vehicule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicule",
      required: true,
    },
    prestataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prestataire",
      required: true,
    },
    cout: {
      type: Number,
      required: true,
    },
    factureNumero: {
      type: String,
    },
    etat: {
      type: String,
      enum: ["en attente", "en cours", "terminée"],
      default: "en attente",
    },
    isArchived: {
      type: Boolean,
      default: false,
      // required: true,
    },
    rapport: {
      type: String,
      default: "",
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InterventionExterne', interventionExterneSchema);
