// src/redux/slices/fournitureSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 📌 Créer un véhicule (POST)
export const createFourniture = createAsyncThunk(
  "fournitures/createFourniture",
  async (fournitureData, { rejectWithValue }) => {
    console.log(fournitureData, "fournitureData");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/fournitures/createFourniture",
        fournitureData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Obtenir tous les véhicules (GET)
export const getFournitures = createAsyncThunk(
  "fournitures/getFournitures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fournitures/getAllFournitures"
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

export const updateFourniture = createAsyncThunk(
  "fournitures/updateFourniture",
  async ({ fournitureId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/fournitures/updateFournitures?fournitureid=${fournitureId}`, // Ajout de l'ID dans la query string
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
export const deleteFourniture = createAsyncThunk(
  "fournitures/deleteFourniture",
  async (fournitureId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/fournitures/deleteFourniture?fournitureid=${fournitureId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
const fournitureSlice = createSlice({
  name: "fournitures",
  initialState: {
    listFourniture: [],
    loading: false,
    error: null,
    updatedFourniture: null, // ajouter la propriété pour l'objet mis à jour
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFourniture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFourniture.fulfilled, (state, action) => {
        state.loading = false;
        state.listFourniture.push(action.payload);
      })
      .addCase(createFourniture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // getFournitures
      .addCase(getFournitures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFournitures.fulfilled, (state, action) => {
        state.loading = false;
        state.listFourniture = action.payload;
      })
      .addCase(getFournitures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // updateFourniture
      .addCase(updateFourniture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFourniture.fulfilled, (state, action) => {
        state.loading = false;
        const updatedFourniture = action.payload;
        // Remplacer le véhicule mis à jour dans la liste
        const index = state.listFourniture.findIndex(
          (fourniture) => fourniture._id === updatedFourniture._id
        );
        if (index !== -1) {
          state.listFourniture[index] = updatedFourniture;
        }
      })
      .addCase(updateFourniture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // Handle deleteFourniture
      .addCase(deleteFourniture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFourniture.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out the deleted inter from the list
        state.listFourniture = state.listFourniture.filter(
          (fourniture) => fourniture._id !== action.payload._id
        );
      })
      .addCase(deleteFourniture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      });
  },
});

export default fournitureSlice.reducer;
