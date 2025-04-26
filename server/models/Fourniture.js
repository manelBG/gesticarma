import mongoose from 'mongoose';

const fournitureSchema = new mongoose.Schema({
  nom: {
    type: String,
  },
  marque: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Marque",
    //
  },
  quantite: {
    type: Number,
  },
  dateAjout: {
    type: Date,
    default: Date.now,
  },
  typeFourniture: {
    type: String,
    enum: ["PieceDetachee", "Pneumatique", "Filtre", "LubrifiantFluide"],
  },
  reference: {
    type: String,
    required: function () {
      return this.typeFourniture === "PieceDetachee";
    },
  },
  description: {
    type: String,
    required: function () {
      return (
        this.typeFourniture === "PieceDetachee" ||
        this.typeFourniture === "Filtre"
      );
    },
  },
  dimension: {
    type: String,
    required: function () {
      return this.typeFourniture === "Pneumatique";
    },
  },
  typeFiltre: {
    type: String,
    required: function () {
      return this.typeFourniture === "Filtre";
    },
  },
  typeLubrifiant: {
    type: String,
    required: function () {
      return this.typeFourniture === "LubrifiantFluide";
    },
  },
  fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fournisseur",
  },
  technicien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model('Fourniture', fournitureSchema);
