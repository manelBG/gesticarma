import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMission, updateMission, getMissions, getMissionsByUserId } from "../redux/missionSlice/missionSlice";
import { useAuth } from "../hooks/useAuth"; // récupère l'utilisateur connecté

const ListeMissions = () => {
  const dispatch = useDispatch();
  const { listMission, error } = useSelector((state) => state.missions);
  const { user } = useAuth(); // Assure-toi que ton hook renvoie bien l'objet user

  useEffect(() => {
    if (!user) return;

    // Si admin ou technicien → toutes les missions
    if (user.role === "admin" || user.role === "technicien") {
      dispatch(getMissions());
    } 
    // Sinon (employé) → missions par userId
    else {
      dispatch(getMissionsByUserId(user._id));
    }
  }, [dispatch, user]);

  const statutCouleurs = {
    "en attente": "bg-blue-100 border-blue-300",
    "en cours": "bg-gray-100 border-gray-300",
    "terminée": "bg-teal-100 border-teal-300",
  };

  const handleSwitchStatut = (missionId, newStatut) => {
    dispatch(updateMission({ missionId, updatedData: { statut: newStatut } }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Missions
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {["en attente", "en cours", "terminée"].map((statut) => {
          const missionsStatut = listMission.filter((m) => m.statut === statut);

          return (
            <div
              key={statut}
              className={`p-6 rounded-lg shadow-md ${statutCouleurs[statut]} border-2`}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">
                {statut}
              </h2>
              <div className="space-y-4">
                {missionsStatut.length > 0 ? (
                  missionsStatut.map((mission) => (
                    <div
                      key={mission._id}
                      className="p-4 mb-4 bg-white rounded-lg shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        {mission.description}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Véhicule: {mission.vehicule?.marque} : {mission.vehicule?.immatriculation}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date de début: {new Date(mission.dateDebut).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date de fin:{" "}
                        {mission.dateFin ? new Date(mission.dateFin).toLocaleString() : "Non définie"}
                      </p>

                      <div className="mt-4 flex items-center space-x-4">
                        {statut !== "terminée" && (
                          <button
                            onClick={() =>
                              handleSwitchStatut(
                                mission._id,
                                statut === "en attente" ? "en cours" : "terminée"
                              )
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          >
                            {statut === "en attente" ? "Démarrer" : "Terminer"}
                          </button>
                        )}

                        {statut !== "en attente" && (
                          <button
                            onClick={() => handleSwitchStatut(mission._id, "en attente")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                          >
                            Revenir à l'attente
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Aucune mission {statut} disponible.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListeMissions;
