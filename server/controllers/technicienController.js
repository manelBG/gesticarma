import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Ajouter un technicien
export const addTechnicien = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, password, genre, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Créer un nouvel utilisateur (rôle : technicien ou employé selon le rôle fourni)
    const newUser = new User({
      nom: nom,
      prenom,
      email,
      telephone: telephone,
      password, // Assure-toi que ton modèle hash le mot de passe
      role: "technicien ",
      genre,
    });

    await newUser.save();

    // Envoi de l'email de confirmation
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Bienvenue sur GestiCarma 🚗',
      html: `
        <h3>Bonjour ${prenom} ${nom},</h3>
        <p>Votre compte ${role} a bien été créé sur <strong>GestiCarma</strong>.</p>
        <p>Merci de nous rejoindre !</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} ajouté et email envoyé !` });

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer tous les techniciens
export const getAllTechniciens = async (req, res) => {
  try {
    // Récupérer uniquement les techniciens
    const techniciens = await User.find({ role: 'technicien' });  // Recherche les utilisateurs avec le rôle 'technicien'
    res.status(200).json(techniciens);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des techniciens.' });
  }
};

// Supprimer un technicien
export const deleteTechnicien = async (req, res) => {
  try {
    const technicien = await User.findOneAndDelete({ _id: req.params.id, role: 'technicien' });
    if (!technicien) {
      return res.status(404).json({ message: "Technicien non trouvé" });
    }
    res.status(200).json({ message: "Technicien supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un technicien
export const updateTechnicien = async (req, res) => {
  try {
    const updatedTechnicien = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'technicien' },
      req.body,
      { new: true }
    );
    if (!updatedTechnicien) {
      return res.status(404).json({ message: "Technicien non trouvé" });
    }
    res.status(200).json(updatedTechnicien);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
