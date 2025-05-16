import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMission,
  updateMission,
  getMissions,
  getMissionsByUserId,
  updateMissionStatut,
  uploadRapport,
} from "../redux/missionSlice/missionSlice";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth"; // récupère l'utilisateur connecté
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Clock,
  Loader2,
  CheckCircle,
  ClipboardList,
  Calendar,
  XCircle,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ListeMissions = () => {
  const dispatch = useDispatch();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFile, setReportFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const { listMission, error, listMissionByUserId } = useSelector(
    (state) => state.missions
  );
  console.log(listMission, "listMissionlistMission");
  const missionCount = listMission?.length || 0;
  const enCoursCount =
    listMission?.filter((m) => m.statut === "en cours").length || 0;
  const enAttenteCount =
    listMission?.filter((m) => m.statut === "en attente").length || 0;
  const doneMissionCount =
    listMission?.filter((m) => m.statut === "terminée").length || 0;
  const refusedMissionCount =
    listMission?.filter((m) => m.statut === "refuser").length || 0;

  console.log(enCoursCount, "✅ Missions en cours");

  const [loading, setLoading] = useState(false);

  const handleSwitchStatut = async (missionId, statut, raisonRefus = "") => {
    if (loading) return; // Prevents dispatching if already in progress
    setLoading(true);

    try {
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
    } catch (error) {
      console.error("Error updating mission status:", error);
    } finally {
      setLoading(false); // Reset loading state after operation is complete
    }
  };
  const handleTerminerClick = (missionId) => {
    setSelectedMissionId(missionId);
    setShowReportModal(true);
  };

  // const handleReportSubmit = async () => {
  //   if (!reportFile) {
  //     alert("Veuillez importer un rapport avant de continuer.")
  //     return
  //   }

  //   setUploadLoading(true)
  //   setUploadError("")

  //   // Création du FormData pour l'upload du fichier
  //   const formData = new FormData()
  //   formData.append("rapport", reportFile)
  //   formData.append("missionId", selectedMissionId)

  //   try {
  //     // Remplacez cette URL par l'endpoint de votre API
  //     const response = await fetch("http://localhost:5000/uploads/${mission.rapport}", {
  //       method: "POST",
  //       body: formData,
  //       // Si votre API nécessite une authentification
  //       headers: {
  //         // Supprimez Content-Type pour que le navigateur définisse correctement le boundary pour FormData
  //         // 'Content-Type': 'multipart/form-data',
  //         // Si vous avez besoin d'un token d'authentification
  //         // 'Authorization': `Bearer ${votre_token}`
  //       },
  //     })

  //     if (!response.ok) {
  //       throw new Error(`Erreur lors de l'upload: ${response.status}`)
  //     }

  //     const data = await response.json()

  //     // Mise à jour du statut de la mission avec le nom du fichier retourné par l'API
  //     handleSwitchStatut(selectedMissionId, "terminée", "", data.filename)

  //     // Fermeture de la modale et réinitialisation des états
  //     setShowReportModal(false)
  //     setReportFile(null)
  //   } catch (error) {
  //     console.error("Erreur lors de l'upload du rapport:", error)
  //     setUploadError("Une erreur est survenue lors de l'upload du rapport. Veuillez réessayer.")
  //   } finally {
  //     setUploadLoading(false)
  //   }
  // }
  const { user } = useAuth(); 
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

  const handleReportSubmit = async () => {
    if (!reportFile) {
      alert("Veuillez importer un rapport avant de continuer.");
      return;
    }

    setUploadLoading(true);
    try {
      const resultAction = await dispatch(
        uploadRapport({ missionId: selectedMissionId, rapportFile: reportFile })
      );

      if (uploadRapport.fulfilled.match(resultAction)) {
        setShowReportModal(false);
        setReportFile(null);

        // Rafraîchir les missions
        if (user?.role === "admin") {
          dispatch(getMissions());
        } else {
          dispatch(getMissionsByUserId(user._id));
        }
      }
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Missions
      </h1>

      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-7xl mx-auto border border-gray-200">
        <h2 className="text-2xl font-semibold text-blue-900">
          🔍 Aperçu global des missions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <DashboardCard
            icon={ClipboardList}
            label="Toutes les missions"
            value={missionCount}
            to="/missions"
          />
          <DashboardCard
            icon={Clock}
            label="En attente"
            value={enAttenteCount}
            to="/missions?filtre=attente"
          />
          <DashboardCard
            icon={Loader2}
            label="En cours"
            value={enCoursCount}
            to="/missions?filtre=encours"
          />
          <DashboardCard
            icon={CheckCircle}
            label="Terminées"
            value={doneMissionCount}
            to="/missions?filtre=terminee"
          />
          <DashboardCard
            icon={XCircle}
            label="Refusées"
            value={refusedMissionCount}
            to="/missions?filtre=refusee"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 ">
        {["en attente", "en cours", "terminée"].map((statut) => {
          const missionsStatut = listMission
            .filter((m) => m.statut === statut)
            .reverse();

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
                        Nom et prenom:{mission.employee?.nom}{" "}
                        {mission.employee?.prenom}
                      </p>
                      <p className="text-sm text-gray-600">
                        Role:{mission.employee?.role}
                      </p>
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
                      {mission.rapport && (
                        <p className="text-sm text-gray-600">
                          Rapport :{" "}
                          <a
                            href={`http://localhost:5000/uploads/${mission.rapport}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            Ouvrir
                          </a>
                        </p>
                      )}
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
                            onClick={() => handleTerminerClick(mission._id)}
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
      {/* Nouvelle modal pour l'importation du rapport */}
      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Importation du rapport
            </h2>
            <p className="mb-4 text-gray-600">
              Vous devez importer un rapport pour terminer cette mission.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rapport de mission
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Cliquez pour importer
                      </span>{" "}
                      ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX ou autres formats (max. 10 MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setReportFile(e.target.files[0])}
                  />
                </label>
              </div>
              {reportFile && (
                <p className="mt-2 text-sm text-green-600">
                  Fichier sélectionné: {reportFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportFile(null);
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Annuler
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function DashboardCard({ icon: Icon, label, value, to }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center space-y-2 text-blue-900"
    >
      <Icon className="w-7 h-7 text-blue-600" />
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </Link>
  );
}
export default ListeMissions;
