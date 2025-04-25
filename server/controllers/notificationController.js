import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  try {
    const { destinataireId, type, message } = req.body;

    const newNotification = new Notification({
      destinataireId,
      type,
      message
    });

    await newNotification.save();
    res.status(201).json({ message: "Notification créée", notification: newNotification });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
};

// Récupérer toutes les notifications (moins de 30 jours)
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      destinataireId: req.user.id,
      dateCreation: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ dateCreation: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Marquer une notification comme lue
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { lue: true });
    res.status(200).json({ message: "Notification marquée comme lue" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
