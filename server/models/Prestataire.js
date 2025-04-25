import mongoose from 'mongoose';

const prestataireSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  adresse: {
    type: String
  },
  telephone: {
    type: String
  },
  
  specialite: {
    type: String // exemple : mécanique, carrosserie, électricité...
  }
}, {
  timestamps: true
});

export default mongoose.model('Prestataire', prestataireSchema);
