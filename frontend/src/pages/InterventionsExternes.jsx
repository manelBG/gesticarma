import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListeInterventionsExternes = () => {
  const [interventions, setInterventions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await axios.get('/api/interventions-externes');
        console.log("Réponse reçue :", response.data);

        const data = response.data.interventions || response.data.data || response.data;

        if (Array.isArray(data)) {
          setInterventions(data);
        } else {
          setError("La réponse du serveur n'est pas un tableau.");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des interventions externes");
        console.error(err);
      }
    };

    fetchInterventions();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">Liste des Interventions Externes</h1>

      {/* Affichage des erreurs */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Carte centrale avec les petites cartes */}
      <div className="w-full p-6 bg-gray-100 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interventions Externes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(interventions) && interventions.length > 0 ? (
            interventions.map((intervention) => (
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
