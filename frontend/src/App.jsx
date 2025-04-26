// src/App.jsx
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Techniciens from "./pages/Techniciens";
import Vehicules from "./pages/Vehicules";
import Fourrnitures from "./pages/Fourrnitures";
import InterventionsInternes from "./pages/InterventionsInternes";
import InterventionsExternes from "./pages/InterventionsExternes";
import Missions from "./pages/Missions";
import Plan from "./pages/Plan";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import ProtectRoute from './components/ProtectRoute';
import AdminAccueil from './pages/AdminAccueil'; // Casse respectée
import EmployeeAccueil from './pages/EmployeeAccueil';
import TechAccueil from './pages/TechAccueil';
import Notifications from './pages/Notifications';
import AjoutEmploye from './pages/AjoutEmploye';
import AjoutTechnicien from './pages/AjoutTechnicien'; 
import AjoutVehicule from './pages/AjoutVehicule'; // Le formulaire d'ajout
import AjoutIntervention from './pages/AjouterIntervention';
import AjoutFourniture from './pages/AjouterFourniture';
// Le formulaire d'ajout


function App() {
  return (
    <Routes>
      {/* Route racine qui affiche directement la page de login */}
      <Route path="/" element={<Login />} />

      {/* Route explicite pour la page de login */}
      <Route path="/login" element={<Login />} />

      {/* Routes protégées avec Layout comme parent */}
      <Route path="/" element={<Layout />}>
        <Route
          path="AdminAccueil"
          element={
            <ProtectRoute>
              <AdminAccueil />
            </ProtectRoute>
          }
        />
        <Route
          path="employeeaccueil"
          element={
            <ProtectRoute>
              <EmployeeAccueil />
            </ProtectRoute>
          }
        />
        <Route
          path="techaccueil"
          element={
            <ProtectRoute>
              <TechAccueil />
            </ProtectRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectRoute>
              <Dashboard />
            </ProtectRoute>
          }
        />
        <Route
          path="employes"
          element={
            <ProtectRoute>
              <Employee />
            </ProtectRoute>
          }
        />
        <Route
          path="techniciens"
          element={
            <ProtectRoute>
              <Techniciens />
            </ProtectRoute>
          }
        />
        <Route
          path="vehicules"
          element={
            <ProtectRoute>
              <Vehicules />
            </ProtectRoute>
          }
        />
        <Route
          path="fournitures"
          element={
            <ProtectRoute>
              <Fourrnitures />
            </ProtectRoute>
          }
        />
        <Route
          path="interventions/interne"
          element={
            <ProtectRoute>
              <InterventionsInternes />
            </ProtectRoute>
          }
        />
        <Route
          path="interventions/externe"
          element={
            <ProtectRoute>
              <InterventionsExternes />
            </ProtectRoute>
          }
        />
        <Route
          path="missions"
          element={
            <ProtectRoute>
              <Missions />
            </ProtectRoute>
          }
        />
        <Route
          path="plan"
          element={
            <ProtectRoute>
              <Plan />
            </ProtectRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectRoute>
              <Profile />
            </ProtectRoute>
          }
        />
        <Route
          path="logout"
          element={
            <ProtectRoute>
              <Logout />
            </ProtectRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectRoute>
              <Notifications />
            </ProtectRoute>
          }
        />
        <Route path="/employes/ajouter" element={<AjoutEmploye />} />
        <Route path="/techniciens/ajouter" element={<AjoutTechnicien />} />
        <Route path="/vehicules/ajouter" element={<AjoutVehicule />} />
        <Route path="/intervention/ajouter" element={<AjoutIntervention />} />
        <Route path="/fourniture/ajouter" element={<AjoutFourniture />} />
      </Route>
    </Routes>
  );
}

export default App;