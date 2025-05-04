import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  deleteVehicule,
  getVehicules,
  updateVehicule,
} from "../redux/vehiculeSlice/vehiculeSlice";
import { useDispatch, useSelector } from "react-redux";

const Vehicules = () => {
  const [vehicules, setVehicules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newVehicule, setNewVehicule] = useState({
    marque: "",
    modele: "",
    immatriculation: "",
    statut: "Disponible",
    carburant: "",
    dateMiseEnCirculation: "",
  });

  const [formData, setFormData] = useState({
    marque: "",
    modele: "",
    immatriculation: "",
    statut: "Disponible",
    carburant: "",
    dateMiseEnCirculation: "",
  });
  const [selectedVehicule, setSelectedVehicule] = useState(null);

  const dispatch = useDispatch();
  const { listVehicule, loading, error } = useSelector(
    (state) => state.vehicules
  );
  useEffect(() => {
    dispatch(getVehicules());
  }, [dispatch]);

  const fetchVehicules = async () => {
    try {
      const response = await axios.get("/api/vehicules");
      const data = Array.isArray(response.data) ? response.data : [];
      setVehicules(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules", error);
      setVehicules([]);
    }
  };

  // const handleDelete = async (id) => {
  //   if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
  //     try {
  //       await axios.delete(`/api/vehicules/${id}`);
  //       fetchVehicules();
  //     } catch (error) {
  //       console.error("Erreur lors de la suppression", error);
  //     }
  //   }
  // };

  const handleAddVehicule = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/vehicules", newVehicule);
      setNewVehicule({
        marque: "",
        modele: "",
        immatriculation: "",
        statut: "Disponible",
        carburant: "",
        dateMiseEnCirculation: "",
      });
      setShowForm(false);
      fetchVehicules();
    } catch (error) {
      console.error("Erreur lors de l'ajout du véhicule", error);
    }
  };

  // const handleDelete = async (vehiculeId) => {
  //   if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
  //     try {
  //       await dispatch(deleteVehicule(vehiculeId));
  //       // After deletion, re-fetch the list of vehicles
  //       dispatch(getVehicules());
  //     } catch (error) {
  //       console.error("Erreur lors de la suppression :", error);
  //     }
  //   }
  // };

  const [selectedVehiculeId, setSelectedVehiculeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (vehiculeId) => {
    setSelectedVehiculeId(vehiculeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteVehicule(selectedVehiculeId));
      dispatch(getVehicules());
      setShowDeleteModal(false);
      setSelectedVehiculeId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const filteredVehicules = listVehicule.filter(
    (vehicule) =>
      vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by marque
  );
  // edit
  // Handle form submit for update
  const handleUpdateVehicule = async (e) => {
    e.preventDefault();
    try {
      // Dispatch the update action
      await dispatch(
        updateVehicule({
          vehiculeId: selectedVehicule._id,
          updatedData: formData,
        })
      );
      setSelectedVehicule(null); // Close the form after successful update
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  // Open form to update vehicule
  const handleEditClick = (vehicule) => {
    setSelectedVehicule(vehicule);
    setFormData({
      marque: vehicule.marque,
      modele: vehicule.modele,
      immatriculation: vehicule.immatriculation,
      statut: vehicule.statut,
      carburant: vehicule.carburant,
      dateMiseEnCirculation: vehicule.dateMiseEnCirculation,
    });
  };
  return (
    <div className="w-full max-w-6xl bg-white-100 rounded-2xl shadow-2xl p-8">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Véhicules
      </h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            className="border border-gray-300 rounded-md py-2 pl-6 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm text-center"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 font-semibold">
            Search:
          </span>
        </div>

        <div className="flex justify-end mb-4">
          <a
            href="/vehicules/ajouter"
            className="bg-gray-600 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center gap-2"
          >
            + Ajouter un Véhicule
          </a>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddVehicule}
          className="mb-6 bg-gray-100 p-6 rounded-xl shadow-inner"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Marque"
              className="p-2 border rounded"
              value={newVehicule.marque}
              onChange={(e) =>
                setNewVehicule({ ...newVehicule, marque: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Modèle"
              className="p-2 border rounded"
              value={newVehicule.modele}
              onChange={(e) =>
                setNewVehicule({ ...newVehicule, modele: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Immatriculation"
              className="p-2 border rounded"
              value={newVehicule.immatriculation}
              onChange={(e) =>
                setNewVehicule({
                  ...newVehicule,
                  immatriculation: e.target.value,
                })
              }
              required
            />
            <select
              value={newVehicule.statut}
              onChange={(e) =>
                setNewVehicule({ ...newVehicule, statut: e.target.value })
              }
              className="p-2 border rounded"
              required
            >
              <option value="Disponible">Disponible</option>
              <option value="En mission">En mission</option>
              <option value="En panne">En panne</option>
              <option value="En maintenance">En maintenance</option>
            </select>
            <select
              value={newVehicule.carburant}
              onChange={(e) =>
                setNewVehicule({ ...newVehicule, carburant: e.target.value })
              }
              className="p-2 border rounded"
              required
            >
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Électrique">Électrique</option>
              <option value="Hybride">Hybride</option>
            </select>
            <input
              type="date"
              placeholder="Date de mise en circulation"
              className="p-2 border rounded"
              value={newVehicule.dateMiseEnCirculation}
              onChange={(e) =>
                setNewVehicule({
                  ...newVehicule,
                  dateMiseEnCirculation: e.target.value,
                })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full"
          >
            Enregistrer
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full table-auto bg-white border border-gray-300 text-gray-800 rounded-xl shadow-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-3 border-b">#</th>
              <th className="px-4 py-3 border-b">Marque</th>
              <th className="px-4 py-3 border-b">Modèle</th>
              <th className="px-4 py-3 border-b">Immatriculation</th>
              <th className="px-4 py-3 border-b">Statut</th>
              <th className="px-4 py-3 border-b">Carburant</th>
              <th className="px-4 py-3 border-b">
                Date de mise en circulation
              </th>
              <th className="px-4 py-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicules.length > 0 ? (
              filteredVehicules.map((vehicule, index) => (
                <tr
                  key={vehicule._id}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  <td className="px-4 py-3 border-b">{vehicule.marque}</td>
                  <td className="px-4 py-3 border-b">{vehicule.modele}</td>
                  <td className="px-4 py-3 border-b">
                    {vehicule.immatriculation}
                  </td>
                  <td className="px-4 py-3 border-b">{vehicule.statut}</td>
                  <td className="px-4 py-3 border-b">{vehicule.carburant}</td>
                  <td className="px-4 py-3 border-b">
                    {vehicule.dateMiseEnCirculation
                      ? new Date(
                          vehicule.dateMiseEnCirculation
                        ).toLocaleDateString()
                      : "Non spécifiée"}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded-full"
                        onClick={() => handleEditClick(vehicule)}
                      >
                        Modifier
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full"
                        onClick={() => handleDeleteClick(vehicule._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  Aucun véhicule trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulaire de mise à jour */}
      {selectedVehicule && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Modifier le véhicule
              </h2>
              <button
                onClick={() => setSelectedVehicule(null)}
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

            <form onSubmit={handleUpdateVehicule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marque
                  </label>
                  <input
                    type="text"
                    value={formData.marque}
                    onChange={(e) =>
                      setFormData({ ...formData, marque: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modèle
                  </label>
                  <input
                    type="text"
                    value={formData.modele}
                    onChange={(e) =>
                      setFormData({ ...formData, modele: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immatriculation
                  </label>
                  <input
                    type="text"
                    value={formData.immatriculation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        immatriculation: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) =>
                      setFormData({ ...formData, statut: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                    required
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En mission">En mission</option>
                    <option value="En panne">En panne</option>
                    <option value="En maintenance">En maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carburant
                  </label>
                  <select
                    value={formData.carburant}
                    onChange={(e) =>
                      setFormData({ ...formData, carburant: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                    required
                  >
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Électrique">Électrique</option>
                    <option value="Hybride">Hybride</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de mise en circulation
                  </label>
                  <input
                    type="date"
                    value={formData.dateMiseEnCirculation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateMiseEnCirculation: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedVehicule(null)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 font-medium transition"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Confirmer la suppression
            </h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer ce véhicule ?
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

export default Vehicules;
