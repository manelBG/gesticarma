// src/redux/slices/interventionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 📌 Créer un véhicule (POST)
export const createIntervention = createAsyncThunk(
  "interventions/createIntervention",
  async (interventionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/interventions/createInter",
        interventionData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Obtenir tous les véhicules (GET)
export const getInterventions = createAsyncThunk(
  "interventions/getInterventions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/interventions/allInterventions"
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

export const updateIntervention = createAsyncThunk(
  "interventions/updateIntervention",
  async ({ interventionId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/interventions/updateIntervention?interventionid=${interventionId}`, // Ajout de l'ID dans la query string
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
export const deleteIntervention = createAsyncThunk(
  "interventions/deleteIntervention",
  async (interventionId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/interventions/deleteIntervention?interventionid=${interventionId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const archiveIntervention = createAsyncThunk(
  "interventions/archiveIntervention",
  async (interventionId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/interventions/archiveIntervention?interventionid=${interventionId}`
      );
      return response.data.archived; // only return the updated intervention
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const interventionSlice = createSlice({
  name: "interventions",
  initialState: {
    listIntervention: [],
    loading: false,
    error: null,
    updatedIntervention: null, // ajouter la propriété pour l'objet mis à jour
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createIntervention.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIntervention.fulfilled, (state, action) => {
        state.loading = false;
        state.listIntervention.push(action.payload);
      })
      .addCase(createIntervention.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // getInterventions
      .addCase(getInterventions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInterventions.fulfilled, (state, action) => {
        state.loading = false;
        state.listIntervention = action.payload;
      })
      .addCase(getInterventions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // updateIntervention
      .addCase(updateIntervention.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIntervention.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIntervention = action.payload;
        // Remplacer le véhicule mis à jour dans la liste
        const index = state.listIntervention.findIndex(
          (intervention) => intervention._id === updatedIntervention._id
        );
        if (index !== -1) {
          state.listIntervention[index] = updatedIntervention;
        }
      })
      .addCase(updateIntervention.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // Handle deleteIntervention
      // .addCase(deleteIntervention.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(deleteIntervention.fulfilled, (state, action) => {
      //   state.loading = false;
      //   // Filter out the deleted inter from the list
      //   state.listIntervention = state.listIntervention.filter(
      //     (intervention) => intervention._id !== action.payload._id
      //   );
      // })
      // .addCase(deleteIntervention.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload?.message || "Une erreur s'est produite";
      // });
      .addCase(archiveIntervention.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveIntervention.fulfilled, (state, action) => {
        state.loading = false;
        // Marquer comme archivée plutôt que supprimer
        state.listIntervention = state.listIntervention.map((intervention) =>
          intervention._id === action.payload._id
            ? { ...intervention, isArchived: true }
            : intervention
        );
      })

      .addCase(archiveIntervention.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      });
  },
});

export default interventionSlice.reducer;
