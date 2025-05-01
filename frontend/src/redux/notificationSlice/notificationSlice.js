// redux/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Récupération des notifications de l'utilisateur
// redux/notificationSlice.js
export const getUserNotifications = createAsyncThunk(
  "notifications/fetch",
  async ({ destinataireId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notifications/getUserNotifications/${destinataireId}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Erreur inconnue");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default notificationSlice.reducer;
