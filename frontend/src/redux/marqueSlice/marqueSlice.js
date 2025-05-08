import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL de ton backend
const API_URL = 'http://localhost:5000/api/marques';

// Thunks
export const getMarques = createAsyncThunk('marque/getAllMarques', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const addMarque = createAsyncThunk('marque/addMarque', async (marqueData, thunkAPI) => {
  try {
    const res = await axios.post(API_URL, marqueData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const updateMarque = createAsyncThunk('marque/updateMarque', async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const deleteMarque = createAsyncThunk('marque/deleteMarque', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

// Slice
const marqueSlice = createSlice({
  name: 'marques', // Changé de 'marque' à 'marques' pour correspondre à l'accès dans le composant
  initialState: {
    listMarque: [], // Changé de 'marques' à 'listMarque'
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMarques.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarques.fulfilled, (state, action) => {
        state.loading = false;
        state.listMarque = action.payload; // Changé de 'marques' à 'listMarque'
      })
      .addCase(getMarques.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMarque.fulfilled, (state, action) => {
        state.listMarque.push(action.payload); // Changé de 'marques' à 'listMarque'
      })

      .addCase(updateMarque.fulfilled, (state, action) => {
        const index = state.listMarque.findIndex(m => m._id === action.payload._id); // Changé de 'marques' à 'listMarque'
        if (index !== -1) state.listMarque[index] = action.payload; // Changé de 'marques' à 'listMarque'
      })

      .addCase(deleteMarque.fulfilled, (state, action) => {
        state.listMarque = state.listMarque.filter(m => m._id !== action.payload); // Changé de 'marques' à 'listMarque'
      });
  },
});

export default marqueSlice.reducer;