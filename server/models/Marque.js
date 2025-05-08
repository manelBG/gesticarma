import mongoose from 'mongoose';

const marqueSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  
  description: {
    type: String
  },
  fournitures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fourniture' }]
}, {
  timestamps: true
});

const Marque = mongoose.model('Marque', marqueSchema);
export default Marque;
