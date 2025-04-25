import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    // Utilise la variable d'environnement pour la connexion
    await mongoose.connect(process.env.MONGODB_URL, {
     
    });
    console.log(" Connected to MongoDB");
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error);
  }
};

export default connectToDatabase;
