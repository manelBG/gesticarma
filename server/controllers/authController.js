import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
  try {
    console.log("💡 Requête reçue :", req.body);

    const { email, password } = req.body;

    // Trouver l'utilisateur par email et inclure explicitement le champ password
    const user = await User.findOne({ email }).select("+password");
    console.log("🔍 Utilisateur trouvé :", user ? "Oui" : "Non");

    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    // Utiliser la méthode comparePassword du modèle User
    const isMatch = await user.comparePassword(password);
    console.log("🔐 Mot de passe valide :", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong Password" });
    }
    user.updatedAt = new Date();
    await user.save();

    // Génération du token JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "20d" }
    );

    // Envoi de la réponse avec le token et les données utilisateur
    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        genre: user.genre,
        telephone: user.telephone,
      },
    });
  } catch (error) {
    console.error("🔥 Erreur dans login:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export { login };
