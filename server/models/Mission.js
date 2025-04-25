import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  statut: {
    type: String,
    enum: ['en attente', 'en cours', 'terminée'],
    default: 'en attente',
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
  },
  kilometrageDebut: {
    type: Number,
  },
  kilometrageFin: {
    type: Number,
  },
  vehicule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicule',
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

const Mission = mongoose.model('Mission', missionSchema);
export default Mission;
