import Notification from "../models/Notification.js";

export const sendNotification = async (destinataireId, type, message) => {
  try {
    const notification = new Notification({
      destinataireId,
      type: "mission",
      message,
    });
    await notification.save();
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification :", error);
  }
};
