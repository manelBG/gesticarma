// src/redux/slices/vehiculeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 📌 Créer un véhicule (POST)
export const createVehicule = createAsyncThunk(
  "vehicules/createVehicule",
  async (vehiculeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/vehicules/createVeicule",
        vehiculeData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


// 📌 Obtenir tous les véhicules (GET)
export const getVehicules = createAsyncThunk(
  "vehicules/getVehicules",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/vehicules/getAllVeh");
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: err.message });
      }
    }
  }
);

export const updateVehicule = createAsyncThunk(
  "vehicules/updateVehicule",
  async ({ vehiculeId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/vehicules/updateVeh?vehiculeid=${vehiculeId}`, // Ajout de l'ID dans la query string
        updatedData
      );
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: err.message });
      }
    }
  }
);

// 📌 Supprimer un véhicule (DELETE)
export const deleteVehicule = createAsyncThunk(
  "vehicules/deleteVehicule",
  async (vehiculeId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/vehicules/deleteVeh?vehiculeid=${vehiculeId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
const vehiculeSlice = createSlice({
  name: "vehicules",
  initialState: {
    listVehicule: [],
    loading: false,
    error: null,
    updatedVehicule: null, // ajouter la propriété pour l'objet mis à jour
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVehicule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicule.fulfilled, (state, action) => {
        state.loading = false;
        state.listVehicule.push(action.payload);
      })
      .addCase(createVehicule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // getVehicules
      .addCase(getVehicules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVehicules.fulfilled, (state, action) => {
        state.loading = false;
        state.listVehicule = action.payload;
      })
      .addCase(getVehicules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // updateVehicule
      .addCase(updateVehicule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicule.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVehicule = action.payload;
        // Remplacer le véhicule mis à jour dans la liste
        const index = state.listVehicule.findIndex(
          (vehicule) => vehicule._id === updatedVehicule._id
        );
        if (index !== -1) {
          state.listVehicule[index] = updatedVehicule;
        }
      })
      .addCase(updateVehicule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // Handle deleteVehicule
      .addCase(deleteVehicule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicule.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out the deleted vehicle from the list
        state.listVehicule = state.listVehicule.filter(
          (vehicule) => vehicule._id !== action.payload._id
        );
      })
      .addCase(deleteVehicule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      });
  },
});

export default vehiculeSlice.reducer;
