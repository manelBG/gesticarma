// src/redux/slices/technicienSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 📌 Créer un technicien (POST)
export const createTechnicien = createAsyncThunk(
  "techniciens/createTechnicien",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/techniciens/createTechnicien",
        formData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Obtenir tous les techniciens (GET)
export const getTechniciens = createAsyncThunk(
  "techniciens/getTechniciens",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/techniciens/getAllTechniciens");
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

// 📌 Mettre à jour un technicien (PUT)
export const updateTechnicien = createAsyncThunk(
  "techniciens/updateTechnicien",
  async ({ technicienId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/techniciens/updateTechnicien/${technicienId}`,
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

// 📌 Supprimer un technicien (DELETE)
export const deleteTechnicien = createAsyncThunk(
  "techniciens/deleteTechnicien",
  async (technicienId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/techniciens/deleteTechnicien/${technicienId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const technicienSlice = createSlice({
  name: "techniciens",
  initialState: {
    listTechnicien: [],
    loading: false,
    error: null,
    updatedTechnicien: null, // pour l'objet mis à jour
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createTechnicien
      .addCase(createTechnicien.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTechnicien.fulfilled, (state, action) => {
        state.loading = false;
        state.listTechnicien.push(action.payload);
      })
      .addCase(createTechnicien.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // getTechniciens
      .addCase(getTechniciens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTechniciens.fulfilled, (state, action) => {
        state.loading = false;
        state.listTechnicien = action.payload;
      })
      .addCase(getTechniciens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // updateTechnicien
      .addCase(updateTechnicien.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTechnicien.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTechnicien = action.payload;
        const index = state.listTechnicien.findIndex(
          (technicien) => technicien._id === updatedTechnicien._id
        );
        if (index !== -1) {
          state.listTechnicien[index] = updatedTechnicien;
        }
      })
      .addCase(updateTechnicien.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // deleteTechnicien
      .addCase(deleteTechnicien.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTechnicien.fulfilled, (state, action) => {
        state.loading = false;
        state.listTechnicien = state.listTechnicien.filter(
          (technicien) => technicien._id !== action.payload._id
        );
      })
      .addCase(deleteTechnicien.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      });
  },
});

export default technicienSlice.reducer;
