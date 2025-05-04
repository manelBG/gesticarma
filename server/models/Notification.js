// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  expediteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  destinataireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  type: {
    type: String,
    enum: ["intervention", "mission"],
    // required: true,
  },
  sousType: {
    type: String,
    enum: [
      "urgente",
      "normale",
      "creation",
      "acceptation",
      "refus",
      "modification",
    ],
  },
  message: {
    type: String,
    // required: true,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  lue: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Notification', notificationSchema);
