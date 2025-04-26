import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListeInterventionsInternes = () => {
  const [interventions, setInterventions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await axios.get('/api/interventions-internes');
        console.log(response.data); // Vérifie la structure de la réponse
        if (Array.isArray(response.data)) {
          setInterventions(response.data);
        } else {
          setError('La réponse n\'est pas un tableau.');
        }
      } catch (err) {
        setError('Erreur lors de la récupération des interventions internes');
        console.error(err);
      }
    };

    fetchInterventions();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">Liste des Interventions Internes</h1>

      {/* Affichage des erreurs */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Carte centrale avec les petites cartes */}
      <div className="w-full p-6 bg-gray-100 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interventions Internes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Vérifier si interventions est un tableau */}
          {Array.isArray(interventions) && interventions.length > 0 ? (
            interventions.map((intervention) => (
              <div
                key={intervention._id}
                className="p-4 bg-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div className="flex flex-col">
                  <h3 className="font-semibold text-xl text-gray-800">Description: {intervention.description}</h3>
                  <p className="text-sm text-gray-600">Technicien: {intervention.technicien.nom}</p>
                  <p className="text-sm text-gray-600">Véhicule: {intervention.vehicule.immatriculation}</p>
                  <p className="text-sm text-gray-600">Statut: {intervention.statut}</p>
                  <p className="text-sm text-gray-600">Kilométrage: {intervention.kilometrage} km</p>
                  <p className="text-sm text-gray-600">Date: {new Date(intervention.dateIntervention).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune intervention interne disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeInterventionsInternes;
