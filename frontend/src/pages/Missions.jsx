import React, { useState, useEffect } from "react";
import axios from "axios";
import { getMissions } from "../redux/missionSlice/missionSlice";
import { useDispatch, useSelector } from "react-redux";

const ListeMissions = () => {
  const [missions, setMissions] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const { listMission } = useSelector((state) => state.missions);
  console.log(listMission, "listMission");
  useEffect(() => {
    dispatch(getMissions());
  }, [dispatch]);
  // useEffect(() => {
  //   const fetchMissions = async () => {
  //     try {
  //       const response = await axios.get('/api/missions');
  //       console.log(response.data); // Vérifie la structure de la réponse
  //       if (Array.isArray(response.data)) {
  //         setMissions(response.data);
  //       } else {
  //         setError('La réponse n\'est pas un tableau.');
  //       }
  //     } catch (err) {
  //       setError('Erreur lors de la récupération des missions');
  //       console.error(err);
  //     }
  //   };

  //   fetchMissions();
  // }, []);

  // Classes de couleur pour chaque statut
  const statutCouleurs = {
    "en attente": "bg-blue-100 border-blue-300", // Bleu clair
    "en cours": "bg-gray-100 border-gray-300", // Gris clair
    terminée: "bg-indigo-100 border-indigo-300", // Indigo clair
  };

  const handleSwitchStatut = async (missionId, newStatut) => {
    try {
      const response = await axios.put(`/api/missions/${missionId}`, {
        statut: newStatut,
      });
      setMissions((prevMissions) =>
        prevMissions.map((mission) =>
          mission._id === missionId
            ? { ...mission, statut: newStatut }
            : mission
        )
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut", err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Missions
      </h1>

      {/* Affichage des erreurs */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Grand carré regroupant les statuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {["en attente", "en cours", "terminée"].map((statut) => {
          const missionsStatut = missions.filter(
            (mission) => mission.statut === statut
          );
          return (
            <div
              key={statut}
              className={`p-6 rounded-lg shadow-md ${statutCouleurs[statut]} border-2`}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">
                {statut}
              </h2>
              <div className="space-y-4">
                {listMission.filter((mission) => mission.statut === statut)
                  .length > 0 ? (
                  listMission
                    .filter((mission) => mission.statut === statut)
                    .map((mission) => (
                      <div
                        key={mission._id}
                        className="p-4 mb-4 bg-white rounded-lg shadow-sm"
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          {mission.description}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Véhicule: {mission.vehicule.marque}:
                          {mission.vehicule.immatriculation}
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

                        {/* <p className="text-sm text-gray-600">
                          Kilométrage de début: {mission.kilometrageDebut} km
                        </p> */}

                        {/* Switch Button pour changer le statut */}
                        <div className="mt-4 flex items-center space-x-4">
                          {statut !== "terminée" && (
                            <button
                              onClick={() =>
                                handleSwitchStatut(
                                  mission._id,
                                  statut === "en attente"
                                    ? "en cours"
                                    : "terminée"
                                )
                              }
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                              {statut === "en attente"
                                ? "Démarrer"
                                : "Marquer comme Terminée"}
                            </button>
                          )}

                          {statut !== "en attente" && (
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
    </div>
  );
};

export default ListeMissions;
