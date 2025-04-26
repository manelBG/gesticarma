import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjoutVehicule = () => {
  const [vehicule, setVehicule] = useState({
    marque: '',
    modele: '',
    immatriculation: '',
    statut: '', // Valeur vide par défaut
    carburant: '', // Valeur vide par défaut
    dateMiseEnCirculation: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/vehicules', vehicule);
      navigate('/vehicules'); // Redirige vers la page des véhicules après l'ajout
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
      console.error('Erreur lors de l\'ajout du véhicule :', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Ajouter un Véhicule
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="marque" className="block text-gray-700 font-semibold mb-2">
            Marque
          </label>
          <input
            type="text"
            id="marque"
            name="marque"
            value={vehicule.marque}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="modele" className="block text-gray-700 font-semibold mb-2">
            Modèle
          </label>
          <input
            type="text"
            id="modele"
            name="modele"
            value={vehicule.modele}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="immatriculation" className="block text-gray-700 font-semibold mb-2">
            Immatriculation
          </label>
          <input
            type="text"
            id="immatriculation"
            name="immatriculation"
            value={vehicule.immatriculation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="statut" className="block text-gray-700 font-semibold mb-2">
            Statut
          </label>
          <select
            id="statut"
            name="statut"
            value={vehicule.statut}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sélectionner un statut</option> {/* Option vide par défaut */}
            <option value="Disponible">Disponible</option>
            <option value="En mission">En mission</option>
            <option value="En panne">En panne</option>
            <option value="En maintenance">En maintenance</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="carburant" className="block text-gray-700 font-semibold mb-2">
            Type de carburant
          </label>
          <select
            id="carburant"
            name="carburant"
            value={vehicule.carburant}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Sélectionner un carburant</option> {/* Option vide par défaut */}
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Électrique">Électrique</option>
            <option value="Hybride">Hybride</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="dateMiseEnCirculation" className="block text-gray-700 font-semibold mb-2">
            Date de mise en circulation
          </label>
          <input
            type="date"
            id="dateMiseEnCirculation"
            name="dateMiseEnCirculation"
            value={vehicule.dateMiseEnCirculation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4 flex justify-end">
          <button
            type="submit"
            className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-gray-700"
          >
            Ajouter le Véhicule
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjoutVehicule;
