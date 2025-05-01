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


const store = configureStore({
  reducer: {
    vehicules: vehiculeReducer,
    interventions: InterventionReducer,
    fournitures: fournituresReducer,
    employees: employeeReducer,
    techniciens: technicienReducer,
    missions: missionReducer,
    interventionexternes: interventionexterneReducer,
    prestataire: prestataireReducer,
    notification: notificationReducer,


  },
});

export default store;
