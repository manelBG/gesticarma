// src/redux/slices/interventionExterneSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 📌 Créer une intervention externe (POST)
export const createInterventionExterne = createAsyncThunk(
  "interventionExternes/createInterventionExterne",
  async (interventionExterneData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/interventions-externes/createinterventionsExterne",
        interventionExterneData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Obtenir toutes les interventions externes (GET)
export const getInterventionsExternes = createAsyncThunk(
  "interventionExternes/getInterventionsExternes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/interventions-externes/allinterventionsExterne"
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Mettre à jour une intervention externe (PUT)
export const updateInterventionExterne = createAsyncThunk(
  "interventionExternes/updateInterventionExterne",
  async ({ interventionExterneId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/interventions-externes/updateInterventionExterne/${interventionExterneId}`,
        updatedData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Supprimer une intervention externe (DELETE)
export const deleteInterventionExterne = createAsyncThunk(
  "interventionExternes/deleteInterventionExterne",
  async (interventionExterneId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/interventions-externes/deleteInterventionExterne/${interventionExterneId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const archiveInterventionExterne = createAsyncThunk(
  "interventionExternes/archiveInterventionExterne",
  async (interventionExterneId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/interventions-externes/archiveInterventionExterne/${interventionExterneId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const interventionExterneSlice = createSlice({
  name: "interventionExternes",
  initialState: {
    listInterventionExterne: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInterventionExterne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInterventionExterne.fulfilled, (state, action) => {
        state.loading = false;
        state.listInterventionExterne.push(action.payload);
      })
      .addCase(createInterventionExterne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // getInterventionsExternes
      .addCase(getInterventionsExternes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInterventionsExternes.fulfilled, (state, action) => {
        state.loading = false;
        state.listInterventionExterne = action.payload;
      })
      .addCase(getInterventionsExternes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // updateInterventionExterne
      .addCase(updateInterventionExterne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterventionExterne.fulfilled, (state, action) => {
        state.loading = false;
        const updatedInterventionExterne = action.payload;
        const index = state.listInterventionExterne.findIndex(
          (intervention) => intervention._id === updatedInterventionExterne._id
        );
        if (index !== -1) {
          state.listInterventionExterne[index] = updatedInterventionExterne;
        }
      })
      .addCase(updateInterventionExterne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // Handle deleteInterventionExterne
      .addCase(deleteInterventionExterne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInterventionExterne.fulfilled, (state, action) => {
        state.loading = false;
        state.listInterventionExterne = state.listInterventionExterne.filter(
          (intervention) => intervention._id !== action.payload._id
        );
      })
      .addCase(deleteInterventionExterne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      .addCase(archiveInterventionExterne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveInterventionExterne.fulfilled, (state, action) => {
        state.loading = false;
        state.listInterventionExterne = state.listInterventionExterne.map(
          (intervention) =>
            intervention._id === action.payload._id
              ? { ...intervention, isArchived: true }
              : intervention
        );
      })
      .addCase(archiveInterventionExterne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      });
  },
});

export default interventionExterneSlice.reducer;
