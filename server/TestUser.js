import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connecté à MongoDB");
    
   
    const hashedPassword = await bcrypt.hash("f54892++", 10);
    console.log("🔐 Password haché :", hashedPassword);

    const user = new User({
      name: "Ben Gharsallah",
      prenom: "fathi",
      email: "fathibengharsallah@gmail.com",
      password: "f54892++", // ✅ important : on utilise le mot de passe haché ici
      role: "employee",
      genre: "male",
      tlf: "54892333",
    });

    await user.save();
    console.log("✅ Utilisateur créé avec succès !");
    console.log(user);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erreur :", error);
    mongoose.connection.close();
  }
};

createTestUser();
