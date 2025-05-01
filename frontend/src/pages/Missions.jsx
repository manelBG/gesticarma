import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMission,
  updateMission,
  getMissions,
  getMissionsByUserId,
  updateMissionStatut,
} from "../redux/missionSlice/missionSlice";
import { useAuth } from "../hooks/useAuth"; // récupère l'utilisateur connecté

const ListeMissions = () => {
  const dispatch = useDispatch();
  const { listMission, error, listMissionByUserId } = useSelector(
    (state) => state.missions
  );

const handleSwitchStatut = async (missionId, statut, raisonRefus = "") => {
  const resultAction = await dispatch(
    updateMissionStatut({ missionId, statut, raisonRefus })
  );

  if (updateMissionStatut.fulfilled.match(resultAction)) {
    if (user?.role === "admin") {
      dispatch(getMissions());
    } else {
      dispatch(getMissionsByUserId(user._id));
    }
  }
};


  const { user } = useAuth(); // Assure-toi que ton hook renvoie bien l'objet user
  console.log(user, "useruseruser");
  useEffect(() => {
    if (!user) return;

    // Si admin ou technicien → toutes les missions
    if (user.role === "admin") {
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
    terminée: "bg-teal-100 border-teal-300",
  };
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [refusReason, setRefusReason] = useState("");
  const [selectedMissionId, setSelectedMissionId] = useState(null);

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
                        {mission.missionName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Véhicule: {mission.vehicule?.marque} :{" "}
                        {mission.vehicule?.immatriculation}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date de début:{" "}
                        {new Date(mission.dateDebut).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date de fin:{" "}
                        {mission.dateFin
                          ? new Date(mission.dateFin).toLocaleString()
                          : "Non définie"}
                      </p>

                      <div className="mt-4 flex items-center space-x-4">
                        {/* Accepter ou Refuser une mission */}
                        {statut === "en attente" && user?.role === "admin" && (
                          <>
                            <button
                              onClick={() =>
                                handleSwitchStatut(mission._id, "en cours")
                              }
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                              Accepter
                            </button>
                            <button
                              onClick={() => {
                                setSelectedMissionId(mission._id);
                                setShowRefusModal(true);
                              }}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                              Refuser
                            </button>
                          </>
                        )}

                        {/* Passer de "en cours" à "terminée" */}
                        {statut === "en cours" && (
                          <button
                            onClick={() =>
                              handleSwitchStatut(mission._id, "terminée")
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          >
                            Terminer
                          </button>
                        )}

                        {/* Revenir à "en attente" si ce n'est pas déjà le cas */}
                        {statut !== "en attente" &&
                          statut !== "terminée" &&
                          statut !== "refuser" && (
                            <button
                              onClick={() =>
                                handleSwitchStatut(mission._id, "en attente")
                              }
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
      {showRefusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Raison du refus</h2>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows="4"
              value={refusReason}
              onChange={(e) => setRefusReason(e.target.value)}
              placeholder="Entrez la raison du refus..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRefusModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleSwitchStatut(selectedMissionId, "refuser", refusReason);
                  setShowRefusModal(false);
                  setRefusReason("");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeMissions;
