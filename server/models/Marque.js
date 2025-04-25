import mongoose from 'mongoose';

const marqueSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  
  description: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Marque', marqueSchema);
