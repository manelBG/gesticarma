import mongoose from 'mongoose';

const fournisseurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  telephone: { type: String, required: true },
  adresse: { type: String, required: true },

  fournitures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fourniture' }]
}, {
  timestamps: true,
  versionKey: false
});

const Fournisseur = mongoose.model('Fournisseur', fournisseurSchema);
export default Fournisseur;
