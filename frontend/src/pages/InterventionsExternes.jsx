import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteInterventionExterne,
  updateInterventionExterne,
} from "../redux/interventionexterneSlice/interventionexterneSlice"; // Importer les actions pour interventions externes
import { getInterventionsExternes } from "../redux/interventionexterneSlice/interventionexterneSlice"; // Assurez-vous que cette action récupère les interventions externes
import { getVehicules } from "../redux/vehiculeSlice/vehiculeSlice";
import { getPrestataires } from "../redux/prestataireSlice/prestataireSlice";

const ListeInterventionsExternes = () => {
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

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Interventions Externes
      </h1>

      {/* Affichage des erreurs */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {(storedUser?.role === "technicien" || storedUser?.role === "admin") && (
        <div className="flex justify-end mb-4">
          <a
            href="/interventionexterne/ajouter"
            className="bg-gray-600 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center gap-2"
          >
            + Créer une intervention externe
          </a>
        </div>
      )}
      {isEditing && currentIntervention && (
        <form
          onSubmit={handleSubmit}
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Modifier l'intervention
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={currentIntervention.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                    placeholder="Décrivez l'intervention"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coût
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="cout"
                      value={currentIntervention.cout}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facture
                  </label>
                  <input
                    type="text"
                    name="factureNumero"
                    value={currentIntervention.factureNumero || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="N° de facture"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État
                  </label>
                  <select
                    name="etat"
                    value={currentIntervention.etat}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                  >
                    <option value="en attente">⭕ En attente</option>
                    <option value="en cours">🔄 En cours</option>
                    <option value="terminée">✅ Terminée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Début
                  </label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={currentIntervention.dateDebut?.split("T")[0] || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Fin
                  </label>
                  <input
                    type="date"
                    name="dateFin"
                    value={currentIntervention.dateFin?.split("T")[0] || ""}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="col-span-1 lg:col-span-3">
                  <div className="h-px bg-gray-200 my-6"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Véhicule
                  </label>
                  <select
                    name="vehicule"
                    value={currentIntervention.vehicule}
                    onChange={(e) =>
                      setCurrentIntervention((prev) => ({
                        ...prev,
                        vehicule: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                    required
                  >
                    <option value="">Sélectionner un véhicule</option>
                    {listVehicule
                      .filter(
                        (vehicule) =>
                          vehicule.statut === "Disponible" ||
                          vehicule._id === currentIntervention.vehicule
                      )
                      .map((vehicule) => (
                        <option key={vehicule._id} value={vehicule._id}>
                          {vehicule.marque} {vehicule.modele} ({vehicule.statut}
                          )
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prestataire
                  </label>
                  <select
                    name="prestataire"
                    value={currentIntervention.prestataire}
                    onChange={(e) =>
                      setCurrentIntervention((prev) => ({
                        ...prev,
                        prestataire: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                    required
                  >
                    <option value="">Sélectionner un prestataire</option>
                    {prestataires.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-sm transition-all flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Carte centrale avec les petites cartes */}
      <div className="w-full p-6 bg-gray-100 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Interventions Externes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(listInterventionExterne) &&
          listInterventionExterne.length > 0 ? (
            listInterventionExterne.map((intervention) => (
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
                    <button
                      onClick={() => handleEditClick(intervention)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-full mt-4 hover:bg-yellow-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteClick(intervention._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full"
                    >
                      Supprimer
                    </button>
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

export default ListeInterventionsExternes;
