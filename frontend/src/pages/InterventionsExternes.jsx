import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteInterventionExterne, updateInterventionExterne } from "../redux/interventionexterneSlice/interventionexterneSlice"; // Importer les actions pour interventions externes
import { getInterventionsExternes } from "../redux/interventionexterneSlice/interventionexterneSlice"; // Assurez-vous que cette action récupère les interventions externes

const ListeInterventionsExternes = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIntervention, setCurrentIntervention] = useState(null);
  
  // Correction ici : utiliser InterventionExterne au lieu de interventions
  const { InterventionExterne = [], loading, error: stateError } = useSelector((state) => state.interventionexternes || {});

  useEffect(() => {
    dispatch(getInterventionsExternes()); // Récupérer les interventions externes
  }, [dispatch]);

  const storedUser = JSON.parse(localStorage.getItem("user"));

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

  const handleDelete = async (interventionId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette intervention externe ?")) {
      try {
        await dispatch(deleteInterventionExterne(interventionId));
        // After deletion, re-fetch the list of interventions externes
        dispatch(getInterventionsExternes());
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">Liste des Interventions Externes</h1>

      {/* Affichage des erreurs */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Carte centrale avec les petites cartes */}
      <div className="w-full p-6 bg-gray-100 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interventions Externes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(InterventionExterne) && InterventionExterne.length > 0 ? (
            InterventionExterne.map((intervention) => (
              <div
                key={intervention._id}
                className="p-4 bg-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div className="flex flex-col">
                  <h3 className="font-semibold text-xl text-gray-800">Description: {intervention.description}</h3>
                  <p className="text-sm text-gray-600">Véhicule: {intervention.vehicule?.immatriculation}</p>
                  <p className="text-sm text-gray-600">Prestataire: {intervention.prestataire?.nom}</p>
                  <p className="text-sm text-gray-600">Coût: {intervention.cout} TND</p>
                  <p className="text-sm text-gray-600">Facture: {intervention.factureNumero || 'N/A'}</p>
                  <p className="text-sm text-gray-600">État: {intervention.etat}</p>
                  <p className="text-sm text-gray-600">
                    Période: {new Date(intervention.dateDebut).toLocaleDateString()} - {new Date(intervention.dateFin).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <button onClick={() => handleEditClick(intervention)} className="text-blue-500 hover:text-blue-700">Éditer</button>
                  <button onClick={() => handleDelete(intervention._id)} className="text-red-500 hover:text-red-700">Supprimer</button>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune intervention externe disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeInterventionsExternes;
