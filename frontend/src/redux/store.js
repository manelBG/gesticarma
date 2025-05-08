import { configureStore } from "@reduxjs/toolkit";
import vehiculeReducer from "./vehiculeSlice/vehiculeSlice";
import InterventionReducer from "./interventionSlice/interventionSlice";
import fournituresReducer from "./fournitureSlice/fournitureSlice";
import employeeReducer from "./employeeSlice/employeeSlice";
import technicienReducer from"./technicienSlice/technicienSlice";
import missionReducer from "./missionSlice/missionSlice";
import interventionexterneReducer from "./interventionexterneSlice/interventionexterneSlice";
import prestataireReducer from './prestataireSlice/prestataireSlice';
import notificationReducer from "./notificationSlice/notificationSlice";
import fournisseurReducer from "./fournisseurSlice/fournisseurSlice";
import marqueReducer from "./marqueSlice/marqueSlice";

const store = configureStore({
  reducer: {
    vehicules: vehiculeReducer,
    interventions: InterventionReducer,
    fournitures: fournituresReducer,
    employees: employeeReducer,
    techniciens: technicienReducer,
    missions: missionReducer,
    interventionExternes: interventionexterneReducer,
    prestataire: prestataireReducer, // Correctement ajouté
    notification: notificationReducer,
    fournisseurs:fournisseurReducer,
    marques:marqueReducer,
  },
});

export default store;
