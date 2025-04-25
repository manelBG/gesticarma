// models/Intervention.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const interventionSchema = new Schema({
  type: {
    type: String,
    enum: ['interne', 'externe'],
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  dateIntervention: {
    type: Date,
    required: true,
   
  },
  cout: {
    type: Number,
    required: false,
  },
  statut: {
    type: String,
    enum: ['en cours', 'terminée', 'annulée'],
    required: true,
  },
  kilometrage: {
    type: Number,
    required: true,
  },
  duree: {
    type: Number,
    required: false,
  },
  technicien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // <- Si ton technicien est dans le modèle User
    required: true,
  },
  vehicule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicule',
    required: true,
  }
} , { timestamps: true });

const Intervention = mongoose.model('Intervention', interventionSchema);
export default Intervention;
