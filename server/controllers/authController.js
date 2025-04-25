import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const login = async (req, res) => {
  try {
    console.log("💡 Requête reçue :", req.body); // 👈 log 1

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password"); // 👈 log 2
    console.log("🔍 Utilisateur trouvé :", user);

    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // 👈 log 3
    console.log("🔐 Mot de passe valide :", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong Password" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "20d" }
    );

    // Log après la génération du token, avant de renvoyer la réponse
    console.log("Clé JWT utilisée pour SIGNER :", process.env.JWT_KEY);
    console.log("Token généré :", token);

    // Envoi de la réponse avec le token et les données utilisateur
    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        genre: user.genre,
        tlf: user.tlf,

      },
    });

  } catch (error) {
    console.error("🔥 Erreur dans login:", error); // 👈 log 4
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export { login };


