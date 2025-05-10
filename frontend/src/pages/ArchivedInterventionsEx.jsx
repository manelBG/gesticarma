import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  archiveInterventionExterne,
  deleteInterventionExterne,
  updateInterventionExterne,
} from "../redux/interventionexterneSlice/interventionexterneSlice"; // Importer les actions pour interventions externes
import { getInterventionsExternes } from "../redux/interventionexterneSlice/interventionexterneSlice"; // Assurez-vous que cette action récupère les interventions externes
import { getVehicules } from "../redux/vehiculeSlice/vehiculeSlice";
import { getPrestataires } from "../redux/prestataireSlice/prestataireSlice";

const ArchivedInterventionsEx = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIntervention, setCurrentIntervention] = useState(null);

  // Correction ici : utiliser InterventionExterne au lieu de interventions
  const { listInterventionExterne = [] } = useSelector(
    (state) => state.interventionExternes || {} // ✅ Nom exact du slice
  );
  console.log(listInterventionExterne, "listInterventionExterne");
  useEffect(() => {
    dispatch(getInterventionsExternes()); // Récupérer les interventions externes
  }, [dispatch]);
  const { listVehicule } = useSelector((state) => state.vehicules);

  const { prestataires = [] } = useSelector((state) => state.prestataire || {});
  console.log(prestataires, "listPrestataire");
  // Liste des prestataires

  useEffect(() => {
    dispatch(getVehicules());
    dispatch(getPrestataires()); // Charger les prestataires
  }, [dispatch]);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const handleEditClick = (intervention) => {
    setCurrentIntervention({
      ...intervention,
      prestataire: intervention.prestataire?._id || intervention.prestataire,
      vehicule: intervention.vehicule?._id || intervention.vehicule,
    });
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setCurrentIntervention(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch the updateInterventionExterne action
      await dispatch(
        updateInterventionExterne({
          interventionExterneId: currentIntervention._id,
          updatedData: currentIntervention,
        })
      ).unwrap(); // Unwrap to handle fulfilled/rejected status

      setIsEditing(false);
      dispatch(getInterventionsExternes()); // Re-fetch interventions after the update
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'intervention.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentIntervention((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const handleDelete = async (interventionId) => {
  //   if (
  //     window.confirm(
  //       "Êtes-vous sûr de vouloir supprimer cette intervention externe ?"
  //     )
  //   ) {
  //     try {
  //       await dispatch(deleteInterventionExterne(interventionId));
  //       // After deletion, re-fetch the list of interventions externes
  //       dispatch(getInterventionsExternes());
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
      await dispatch(deleteInterventionExterne(selectedInterventionId));
      dispatch(getInterventionsExternes());
      setShowDeleteModal(false);
      setSelectedInterventionId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
  const visibleInterventionsEx = listInterventionExterne.filter(
    (i) => i.isArchived
  );
  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Interventions Externes Archivés
      </h1>

      {/* Carte centrale avec les petites cartes */}
      <div className="w-full p-6 bg-gray-100 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Interventions Externes Archivés
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(visibleInterventionsEx) &&
          visibleInterventionsEx.length > 0 ? (
            visibleInterventionsEx.map((intervention) => (
              <div
                key={intervention._id}
                className="p-4 bg-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div className="flex flex-col">
                  <h3 className="font-semibold text-xl text-gray-800">
                    Description: {intervention.description}
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
                    Véhicule: {intervention.vehicule?.immatriculation}
                  </p>
                  <p className="text-sm text-gray-600">
                    Prestataire: {intervention.prestataire?.nom}
                  </p>
                  <p className="text-sm text-gray-600">
                    Coût: {intervention.cout} TND
                  </p>
                  <p className="text-sm text-gray-600">
                    Facture: {intervention.factureNumero || "N/A"}
                  </p>
                  {intervention.rapport && (
                    <p className="text-sm text-gray-600">
                      Rapport :{" "}
                      <a
                        href={`http://localhost:5000/uploads/${intervention.rapport}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Ouvrir
                      </a>
                    </p>
                  )}

                  <p className="text-sm text-gray-600">
                    État: {intervention.etat}
                  </p>
                  <p className="text-sm text-gray-600">
                    Période:{" "}
                    {new Date(intervention.dateDebut).toLocaleDateString()} -{" "}
                    {new Date(intervention.dateFin).toLocaleDateString()}
                  </p>
                </div>
                {(storedUser.role === "admin" ||
                  (storedUser.role === "technicien" &&
                    storedUser._id === intervention.technicien?._id)) && (
                  <div>
                    {storedUser?.role === "admin" && (
                      <button
                        onClick={() => handleDeleteClick(intervention._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Aucune intervention externe disponible.</p>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Confirmer la suppression
            </h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer cette intervention externe ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-full"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivedInterventionsEx;
