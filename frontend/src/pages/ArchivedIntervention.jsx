import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  archiveIntervention,
  deleteIntervention,
  updateIntervention,
} from "../redux/interventionSlice/interventionSlice";
import { getInterventions } from "../redux/interventionSlice/interventionSlice"; // Assuming this fetches the interventions

const ArchivedIntervention = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIntervention, setCurrentIntervention] = useState(null);
  const { listIntervention } = useSelector((state) => state.interventions);
  console.log(listIntervention, "listIntervention");
  useEffect(() => {
    dispatch(getInterventions());
  }, [dispatch]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log(storedUser?._id, "storedUserstoredUserstoredUser");
  const handleEditClick = (intervention) => {
    setCurrentIntervention(intervention);
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setCurrentIntervention(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch the updateIntervention action from the slice
      await dispatch(
        updateIntervention({
          interventionId: currentIntervention._id,
          updatedData: currentIntervention,
        })
      ).unwrap(); // Unwrap to handle fulfilled/rejected status

      setIsEditing(false);
      dispatch(getInterventions()); // Re-fetch interventions after the update
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'intervention.");
    }
  };

  // const handleDelete = async (interventionId) => {
  //   if (
  //     window.confirm("Êtes-vous sûr de vouloir supprimer ce intervention ?")
  //   ) {
  //     try {
  //       await dispatch(deleteIntervention(interventionId));
  //       // After deletion, re-fetch the list of vehicles
  //       dispatch(getInterventions());
  //     } catch (error) {
  //       console.error("Erreur lors de la suppression :", error);
  //     }
  //   }
  // };

  const [selectedInterventionId, setSelectedInterventionId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (interventionId) => {
    setSelectedInterventionId(interventionId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteIntervention(selectedInterventionId));
      dispatch(getInterventions());
      setShowDeleteModal(false);
      setSelectedInterventionId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const visibleInterventions = listIntervention.filter((i) => i.isArchived);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
      Liste des Interventions Internes Archivés
      </h1>
      {/* Affichage des erreurs */}
      {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}
      {/* Liste des interventions */}
      <div className="w-full p-6 bg-gray-100 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Interventions Internes Archivés
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(visibleInterventions) &&
          visibleInterventions.length > 0 ? (
            visibleInterventions
              .filter((intervention) => {
                // Si directeur, il voit tout
                if (storedUser?.role === "admin") return true;
                // Sinon, il voit uniquement ses propres interventions
                return intervention?.technicien?._id === storedUser?._id;
              })
              .map((intervention) => (
                <div
                  key={intervention._id}
                  className="p-4 bg-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-xl text-gray-800">
                      {intervention.description}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {intervention?.technicien?.role === "admin" ? (
                        <strong>Admin:</strong>
                      ) : (
                        <strong>Technicien:</strong>
                      )}
                      {intervention.technicien
                        ? intervention.technicien.role === "admin"
                          ? `${intervention.technicien.nom} ${intervention.technicien.prenom}`
                          : `${intervention.technicien.nom} ${intervention.technicien.prenom}`
                        : "Non assigné"}
                    </p>

                    <p className="text-sm text-gray-600">
                      <strong>Véhicule:</strong>{" "}
                      {intervention.vehicule
                        ? `${intervention.vehicule.marque} ${intervention.vehicule.modele}`
                        : "Non assigné"}
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Statut:</span>{" "}
                      {intervention.statut}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Type:</span>{" "}
                      {intervention.type}
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Kilométrage:</span>{" "}
                      {intervention.kilometrage} km
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(
                        intervention.dateIntervention
                      ).toLocaleDateString()}
                    </p>

                    {/* Edit button */}

                    <>
                      {storedUser?.role === "admin" && (
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full"
                          onClick={() => handleDeleteClick(intervention._id)}
                        >
                          Supprimer
                        </button>
                      )}
                    </>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center col-span-3">
              Aucune intervention interne disponible.
            </p>
          )}
        </div>
      </div>

      {/* Form to edit intervention */}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Confirmer la suppression
            </h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer cette intervention ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-full"
              >
                Annuler
              </button>
              {storedUser?.role === "admin" && (
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivedIntervention;
