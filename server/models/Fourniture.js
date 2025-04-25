import mongoose from 'mongoose';

const fournitureSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  marque: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marque',
    required: true
  },
  quantite: {
    type: Number,
    required: true
  },
  dateAjout: {
    type: Date,
    default: Date.now
  },
  typeFourniture: {
    type: String,
    enum: ['PieceDetachee', 'Pneumatique', 'Filtre', 'LubrifiantFluide'],
    required: true
  },
  reference: {
    type: String,
    required: function() { return this.typeFourniture === 'PieceDetachee'; }
  },
  description: {
    type: String,
    required: function() {
      return this.typeFourniture === 'PieceDetachee' || this.typeFourniture === 'Filtre';
    }
  },
  dimension: {
    type: String,
    required: function() { return this.typeFourniture === 'Pneumatique'; }
  },
  typeFiltre: {
    type: String,
    required: function() { return this.typeFourniture === 'Filtre'; }
  },
  typeLubrifiant: {
    type: String,
    required: function() { return this.typeFourniture === 'LubrifiantFluide'; }
  },
  fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fournisseur',
    required: true
  },
  technicien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technicien',
    required: true
  }
});

export default mongoose.model('Fourniture', fournitureSchema);
