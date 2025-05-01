import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  nom:{
    type: String,
    // required: [true, "Le nom est obligatoire"],
    trim: true
  },
  prenom: {
    type: String,
    // required: [true, "Le prenom est obligatoire"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    lowercase: true,
    trim: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Veuillez entrer un email valide"
    ]
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 8 caractères"],
    select: false
  },
  role: {
    type: String,
    enum: ["admin","employee","technicien"],
    required: true
  },
  genre: {
    type: String,
    enum: ['male', 'female'],
    required: false, // ou true si tu veux forcer le choix
  },
  telephone:{
    type: String,
    // required: [true, "Le numéro de téléphone est obligatoire"],
    trim: true,
    match: [/^\d{8}$/, "Le numéro de téléphone doit contenir exactement 8 chiffres"]
  },
  // Champs spécifiques aux techniciens
  fournisseurs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fournisseur'
  }]
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  },
  versionKey:false
});

// 🔒 Hash automatique du mot de passe avant save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔐 Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
  
};

// Supprimer fournisseurs si ce n'est pas un technicien
userSchema.pre("save", function (next) {
  if (this.role !== 'technicien') {
    this.fournisseurs = undefined;
  }
  next();
});


const User = mongoose.model("User", userSchema);
export default User;
