import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Vehicules = () => {
  const [vehicules, setVehicules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newVehicule, setNewVehicule] = useState({
    marque: '',
    modele: '',
    immatriculation: '',
    statut: 'Disponible',
    carburant: '',
    dateMiseEnCirculation: '',
  });

  useEffect(() => {
    fetchVehicules();
  }, []);

  const fetchVehicules = async () => {
    try {
      const response = await axios.get('/api/vehicules');
      const data = Array.isArray(response.data) ? response.data : [];
      setVehicules(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules", error);
      setVehicules([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      try {
        await axios.delete(`/api/vehicules/${id}`);
        fetchVehicules();
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
      }
    }
  };

  const handleAddVehicule = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/vehicules', newVehicule);
      setNewVehicule({
        marque: '',
        modele: '',
        immatriculation: '',
        statut: 'Disponible',
        carburant: '',
        dateMiseEnCirculation: '',
      });
      setShowForm(false);
      fetchVehicules();
    } catch (error) {
      console.error("Erreur lors de l'ajout du véhicule", error);
    }
  };

  const filteredVehicules = vehicules.filter((vehicule) =>
    `${vehicule.marque} ${vehicule.modele} ${vehicule.immatriculation}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
              onChange={(e) => setNewVehicule({ ...newVehicule, marque: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Modèle"
              className="p-2 border rounded"
              value={newVehicule.modele}
              onChange={(e) => setNewVehicule({ ...newVehicule, modele: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Immatriculation"
              className="p-2 border rounded"
              value={newVehicule.immatriculation}
              onChange={(e) => setNewVehicule({ ...newVehicule, immatriculation: e.target.value })}
              required
            />
            <select
              value={newVehicule.statut}
              onChange={(e) => setNewVehicule({ ...newVehicule, statut: e.target.value })}
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
              onChange={(e) => setNewVehicule({ ...newVehicule, carburant: e.target.value })}
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
              onChange={(e) => setNewVehicule({ ...newVehicule, dateMiseEnCirculation: e.target.value })}
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
              <th className="px-4 py-3 border-b">Date de mise en circulation</th>
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
                  <td className="px-4 py-3 border-b">{vehicule.immatriculation}</td>
                  <td className="px-4 py-3 border-b">{vehicule.statut}</td>
                  <td className="px-4 py-3 border-b">{vehicule.carburant}</td>
                  <td className="px-4 py-3 border-b">
                    {vehicule.dateMiseEnCirculation
                      ? new Date(vehicule.dateMiseEnCirculation).toLocaleDateString()
                      : 'Non spécifiée'}
                  </td>
                  <td className="px-4 py-3 border-b flex gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded-full"
                      onClick={() => alert('Page de modification à créer')}
                    >
                      Modifier
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full"
                      onClick={() => handleDelete(vehicule._id)}
                    >
                      Supprimer
                    </button>
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
    </div>
  );
};

export default Vehicules;
