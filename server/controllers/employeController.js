import User from "../models/User.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"; // très important d'importer bcrypt
import crypto from "crypto"; // pour générer un mot de passe sécurisé


export const addEmploye = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, genre, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Générer un mot de passe automatique (par ex. 8 caractères aléatoires)
    // const generatedPassword = crypto.randomBytes(4).toString("hex"); // ex: "a1b2c3d4"

    // Hasher ce mot de passe avant de le sauvegarder
    // const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Créer un nouvel employé (rôle: employé)
    const newEmploye = new User({
      nom,
      prenom,
      email,
      telephone,
      password, // stocke le mot de passe hashé !!
      role: "employee",
      genre,
    });

    await newEmploye.save();

    // Envoi de l'email avec email + mot de passe
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Bienvenue sur GestiCarma 🚗 - Vos identifiants",
      html: `
        <h3>Bonjour ${prenom} ${nom},</h3>
        <p>Votre compte employé a été créé avec succès sur <strong>GestiCarma</strong>.</p>
        <p>Voici vos identifiants de connexion :</p>
        <ul>
          <li><strong>Email :</strong> ${email}</li>
          <li><strong>Mot de passe :</strong> ${password}</li>
        </ul>
        <p><em>Nous vous recommandons de changer votre mot de passe après votre première connexion.</em></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Employé ajouté et email envoyé avec les identifiants !",
      employe: { id: newEmploye._id, email: newEmploye.email },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un employé :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


export const getAllEmployees = async (req, res) => {
  try {
    // Récupérer uniquement les employés
    const employees = await User.find({ role: "employee" }); // Recherche les utilisateurs avec le rôle 'employee'
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des employés." });
  }
};
// Supprimer un employé
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findOneAndDelete({
      _id: req.params.id,
      role: "employee",
    });
    if (!employee) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }
    res.status(200).json({ message: "Employé supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un employé
export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await User.findOneAndUpdate(
      { _id: req.params.id, role: "employee" },
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
