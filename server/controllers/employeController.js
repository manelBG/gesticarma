// controllers/employeController.js

import User from '../models/User.js';
import nodemailer from 'nodemailer';

export const addEmploye = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Créer un nouvel employé (rôle: employé)
    const newEmploye = new User({
      nom,
      prenom,
      email,
      telephone,
      password, // Assure-toi que ton modèle hash le mot de passe
      role: 'employee',
      genre,
    });

    await newEmploye.save();

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
        <p>Votre compte employé a bien été créé sur <strong>GestiCarma</strong>.</p>
                <p>Merci de nous rejoindre !</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Employé ajouté et email envoyé !" });

  } catch (error) {
    console.error("Erreur lors de l'ajout d'un employé :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
