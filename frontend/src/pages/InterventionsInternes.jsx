import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteIntervention, updateIntervention } from "../redux/interventionSlice/interventionSlice";
import { getInterventions } from "../redux/interventionSlice/interventionSlice"; // Assuming this fetches the interventions

const ListeInterventionsInternes = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIntervention, setCurrentIntervention] = useState(null);
  const { listIntervention } = useSelector((state) => state.interventions);

  useEffect(() => {
    dispatch(getInterventions());
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

    const handleDelete = async (interventionId) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce intervention ?")) {
        try {
          await dispatch(deleteIntervention(interventionId));
          // After deletion, re-fetch the list of vehicles
          dispatch(getInterventions());
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      }
    };
  
  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Interventions Internes
      </h1>

      {/* Affichage des erreurs */}
      {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}

      {/* Liste des interventions */}
      <div className="w-full p-6 bg-gray-100 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Interventions Internes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(listIntervention) && listIntervention.length > 0 ? (
            listIntervention.map((intervention) => (
              <div
                key={intervention._id}
                className="p-4 bg-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-xl text-gray-800">
                    {intervention.description}
                  </h3>

                  <p className="text-sm text-gray-600">
                    <strong>Technicien:</strong>{" "}
                    {intervention.technicien
                      ? intervention.technicien.nom ||
                        intervention.technicien.name
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
                  {storedUser?.role === "technicien" && (
                    <>
                      <button
                        onClick={() => handleEditClick(intervention)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-full mt-4 hover:bg-yellow-600"
                      >
                        Modifier
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full"
                        onClick={() => handleDelete(intervention._id)}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
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
      {isEditing && currentIntervention && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-1/2">
            <h3 className="text-2xl font-semibold mb-4">
              Modifier l'Intervention
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={currentIntervention.description}
                  onChange={(e) =>
                    setCurrentIntervention({
                      ...currentIntervention,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Type
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={currentIntervention.type}
                  onChange={(e) =>
                    setCurrentIntervention({
                      ...currentIntervention,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="Urgente">Urgente</option>
                  <option value="Curative">Curative</option>
                  <option value="Preventive">Preventive</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Statut
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={currentIntervention.statut}
                  onChange={(e) =>
                    setCurrentIntervention({
                      ...currentIntervention,
                      statut: e.target.value,
                    })
                  }
                >
                  <option value="en cours">En cours</option>
                  <option value="terminée">Terminée</option>
                  <option value="annulée">Annulée</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Kilométrage
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={currentIntervention.kilometrage}
                  onChange={(e) =>
                    setCurrentIntervention({
                      ...currentIntervention,
                      kilometrage: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Date de l'intervention
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={
                    new Date(currentIntervention.dateIntervention)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    setCurrentIntervention({
                      ...currentIntervention,
                      dateIntervention: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-full"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-full"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeInterventionsInternes;
