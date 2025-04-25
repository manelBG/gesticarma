import Vehicule from '../models/Vehicule.js';
import Mission from '../models/Mission.js';
import Intervention from '../models/Intervention.js';
import Fourniture from '../models/Fourniture.js';
import User from '../models/User.js';
import InterventionExterne from '../models/InterventionExterne.js';



export const getDashboardStats = async (req, res) => {
  try {
    const user = req.user; // Le user est normalement attaché à la requête après validation du JWT (middleware auth)
    
    const stats = {};

    // Si l'utilisateur est un administrateur ou un technicien, il peut voir toutes les données
    if (user.role === 'admin' || user.role === 'technicien') {
      stats.totalVehicules = await Vehicule.countDocuments();
      stats.totalInterventions = await Intervention.countDocuments();
      stats.totalInterventionsExternes = await InterventionExterne.countDocuments();
      stats.totalFournitures = await Fourniture.countDocuments();
    }

    // Si l'utilisateur est un administrateur ou un employé, il peut voir les missions
    if (user.role === 'admin' || user.role === 'technicien') {
        stats.totalMissions = await Mission.countDocuments();  // Admin voit toutes les missions
      } else if (user.role === 'employee') {
        stats.totalMissions = await Mission.countDocuments({ employee: user._id });  // L'employé voit seulement ses missions
      }
    

    // Si l'utilisateur est un administrateur ou un technicien, on peut aussi compter les employés et techniciens
    if (user.role === 'admin') {
      stats.totalEmployees = await User.countDocuments({ role: 'employee' });
      stats.totalTechniciens = await User.countDocuments({ role: 'technicien' });
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error("Erreur dans getDashboardStats:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
