import { configureStore } from "@reduxjs/toolkit";
import vehiculeReducer from "./vehiculeSlice/vehiculeSlice";
import InterventionReducer from "./interventionSlice/interventionSlice";
import fournituresReducer from "./fournitureSlice/fournitureSlice";
import employeeReducer from "./employeeSlice/employeeSlice";
import technicienReducer from"./technicienSlice/technicienSlice";
import missionReducer from "./missionSlice/missionSlice";

const store = configureStore({
  reducer: {
    vehicules: vehiculeReducer,
    interventions: InterventionReducer,
    fournitures: fournituresReducer,
    employees: employeeReducer,
    techniciens: technicienReducer,
    missions: missionReducer,
  },
});

export default store;
