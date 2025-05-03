import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk pour récupérer les prestataires depuis le backend
export const getPrestataires = createAsyncThunk(
  "prestataire/getPrestataires",
  async (_, thunkAPI) => {
    try {
      // Correction de l'URL
      const response = await axios.get(
        "http://localhost:5000/api/prestataires/getAllPrestataires"
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Erreur lors du chargement des prestataires"
      );
    }
  }
);

// Slice
const prestataireSlice = createSlice({
  name: "prestataire",
  initialState: {
    prestataires: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPrestataires.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrestataires.fulfilled, (state, action) => {
        state.loading = false;
        state.prestataires = action.payload;
      })
      .addCase(getPrestataires.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default prestataireSlice.reducer;
