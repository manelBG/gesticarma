import { configureStore } from "@reduxjs/toolkit";
import vehiculeReducer from "./vehiculeSlice/vehiculeSlice";
import InterventionReducer from "./interventionSlice/interventionSlice";
import fournituresReducer from "./fournitureSlice/fournitureSlice";

const store = configureStore({
  reducer: {
    vehicules: vehiculeReducer,
    interventions: InterventionReducer,
    fournitures: fournituresReducer,
  },
});

export default store;
