// src/redux/slices/missionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 📌 Créer une mission (POST)
export const createMission = createAsyncThunk(
  "missions/createMission",
  async (missionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/missions/createMission",
        missionData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Obtenir toutes les missions (GET)
export const getMissions = createAsyncThunk(
  "missions/getMissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/missions/getAllMissions"
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

export const getMissionsByUserId = createAsyncThunk(
  'missions/getMissionsByUserId',
  async (userId) => {
      const response = await axios.get(`/api/missions/${userId}`); // Appel API pour récupérer les missions
      return response.data; // Retourner les données de mission
  }
);



// 📌 Mettre à jour une mission (PUT)
export const updateMission = createAsyncThunk(
  "missions/updateMission",
  async ({ missionId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/missions/updateMission?missionid=${missionId}`,
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

// 📌 Supprimer une mission (DELETE)
export const deleteMission = createAsyncThunk(
  "missions/deleteMission",
  async (missionId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/missions/deleteMission?missionid=${missionId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const missionSlice = createSlice({
  name: "missions",
  initialState: {
    listMission: [],
    loading: false,
    error: null,
    updatedMission: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMission.fulfilled, (state, action) => {
        state.loading = false;
        state.listMission.push(action.payload);
      })
      .addCase(createMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // getMissions
      .addCase(getMissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.listMission = action.payload;
      })
      .addCase(getMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      .addCase(getMissionsByUserId.pending, (state) => {
        state.status = 'loading';
    })
    .addCase(getMissionsByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.missions = action.payload; // Mettre les missions récupérées dans l'état
    })
    .addCase(getMissionsByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
    })

      // updateMission
      .addCase(updateMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMission.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMission = action.payload;
        const index = state.listMission.findIndex(
          (mission) => mission._id === updatedMission._id
        );
        if (index !== -1) {
          state.listMission[index] = updatedMission;
        }
      })
      .addCase(updateMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      })
      // deleteMission
      .addCase(deleteMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMission.fulfilled, (state, action) => {
        state.loading = false;
        state.listMission = state.listMission.filter(
          (mission) => mission._id !== action.payload._id
        );
      })
      .addCase(deleteMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Une erreur s'est produite";
      });
  },
});

export default missionSlice.reducer;
