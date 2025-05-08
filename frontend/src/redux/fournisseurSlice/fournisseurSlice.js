import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL de l'API backend
const API_URL = 'http://localhost:5000/api/fournisseurs';

// THUNKS

export const getFournisseurs = createAsyncThunk('fournisseur/getAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const addFournisseur = createAsyncThunk('fournisseur/add', async (fournisseurData, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, fournisseurData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const updateFournisseur = createAsyncThunk('fournisseur/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const deleteFournisseur = createAsyncThunk('fournisseur/delete', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

// SLICE

const fournisseurSlice = createSlice({
  name: 'fournisseurs', // Changé de 'fournisseur' à 'fournisseurs' pour correspondre à l'accès dans le composant
  initialState: {
    listFournisseur: [], // Changé de 'fournisseurs' à 'listFournisseur'
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(getFournisseurs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFournisseurs.fulfilled, (state, action) => {
        state.loading = false;
        state.listFournisseur = action.payload; // Changé de 'fournisseurs' à 'listFournisseur'
      })
      .addCase(getFournisseurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addFournisseur.fulfilled, (state, action) => {
        state.listFournisseur.push(action.payload); // Changé de 'fournisseurs' à 'listFournisseur'
      })

      // Update
      .addCase(updateFournisseur.fulfilled, (state, action) => {
        const index = state.listFournisseur.findIndex(f => f._id === action.payload._id); // Changé de 'fournisseurs' à 'listFournisseur'
        if (index !== -1) state.listFournisseur[index] = action.payload; // Changé de 'fournisseurs' à 'listFournisseur'
      })

      // Delete
      .addCase(deleteFournisseur.fulfilled, (state, action) => {
        state.listFournisseur = state.listFournisseur.filter(f => f._id !== action.payload); // Changé de 'fournisseurs' à 'listFournisseur'
      });
  }
});

export default fournisseurSlice.reducer;