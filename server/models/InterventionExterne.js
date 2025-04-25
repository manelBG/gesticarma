import mongoose from 'mongoose';

const interventionExterneSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  vehicule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicule',
    required: true
  },
  prestataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prestataire',
    required: true
  },
  cout: {
    type: Number,
    required: true
  },
  factureNumero: {
    type: String
  },
  etat: {
    type: String,
    enum: ['en attente', 'en cours', 'terminée'],
    default: 'en attente'
  }
}, {
  timestamps: true
});

export default mongoose.model('InterventionExterne', interventionExterneSchema);
