import Vehicule from "../models/Vehicule.js";
import Mission from "../models/Mission.js";
import Intervention from "../models/Intervention.js";
import Fourniture from "../models/Fourniture.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Compter le nombre total de véhicules
    const vehiculesCount = await Vehicule.countDocuments();

    // Compter les véhicules opérationnels et en maintenance
    const operationalVehicules = await Vehicule.countDocuments({ status: 'operational' });
    const maintenanceVehicules = await Vehicule.countDocuments({ status: 'in maintenance' });

    // Compter le nombre total de missions et missions en retard
    const missionsCount = await Mission.countDocuments();
    const overdueMissions = await Mission.countDocuments({ status: 'en retard' });

    // Compter le nombre total d'interventions et intervention par type
    const interventionsCount = await Intervention.countDocuments();
    const maintenanceInterventions = await Intervention.countDocuments({ type: 'maintenance' });

    // Compter le nombre total de fournitures
    const fournituresCount = await Fourniture.countDocuments();

    // Rassembler toutes les stats
    const stats = {
      vehicules: {
        total: vehiculesCount,
        operational: operationalVehicules,
        maintenance: maintenanceVehicules
      },
      missions: {
        total: missionsCount,
        overdue: overdueMissions
      },
      interventions: {
        total: interventionsCount,
        maintenance: maintenanceInterventions
      },
      fournitures: fournituresCount
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des stats :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
