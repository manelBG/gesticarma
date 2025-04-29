import mongoose from "mongoose";

const missionSchema = new mongoose.Schema(
  {
    missionName: { type: String, required: true },
    description: { type: String, required: true },
    statut: {
      type: String,
      enum: ["en attente", "en cours", "terminée"],
      default: "en attente",
    },
    priority: {
      type: String,
      enum: ["Normale", "Importante", "Urgente"],
      default: "Normale",
    },

    dateDebut: { type: Date, required: true },
    dateFin: { type: Date },
 
    kilometrageDebut: { type: Number },
    kilometrageFin: { type: Number },
    vehicule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicule",
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Mission", missionSchema);
