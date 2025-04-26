import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListeFournituresGroupées = () => {
  const [fournitures, setFournitures] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFournitures = async () => {
      try {
        const response = await axios.get('/api/fournitures');
        console.log(response.data); // Vérifie la structure de la réponse
        if (Array.isArray(response.data)) {
          setFournitures(response.data);
        } else {
          setError('La réponse n\'est pas un tableau.');
        }
      } catch (err) {
        setError('Erreur lors de la récupération des fournitures');
        console.error(err);
      }
    };

    fetchFournitures();
  }, []);

  const typeCouleurs = {
    PieceDetachee: 'bg-blue-100 border-blue-300',
    Pneumatique: 'bg-gray-100 border-gray-300',
    Filtre: 'bg-indigo-100 border-indigo-300',
    LubrifiantFluide: 'bg-cyan-100 border-cyan-300',
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">Liste des Fournitures</h1>

      {/* Affichage des erreurs */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Grand carré contenant les petits carrés de fournitures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Groupes de fournitures par type */}
        {Object.keys(typeCouleurs).map((type) => {
          const fournituresType = fournitures.filter(f => f.typeFourniture === type);
          return (
            <div
              key={type}
              className={`p-6 rounded-xl shadow-lg ${typeCouleurs[type]} border-2`}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">{type}</h2>
              {/* Affichage des fournitures pour ce type */}
              <div className="space-y-4">
                {fournituresType.length > 0 ? (
                  fournituresType.map((fourniture) => (
                    <div key={fourniture._id} className="p-4 bg-white rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-gray-800">{fourniture.nom}</h3>
                      <p className="text-sm text-gray-600">Marque: {fourniture.marque.nom}</p>
                      <p className="text-sm text-gray-600">Quantité: {fourniture.quantite}</p>
                      <p className="text-sm text-gray-600">Date d'ajout: {new Date(fourniture.dateAjout).toLocaleDateString()}</p>
                      {/* Affichage spécifique selon le type */}
                      {fourniture.typeFourniture === 'PieceDetachee' && (
                        <p className="text-sm text-gray-600">Référence: {fourniture.reference}</p>
                      )}
                      {fourniture.typeFourniture === 'Filtre' && (
                        <p className="text-sm text-gray-600">Type de filtre: {fourniture.typeFiltre}</p>
                      )}
                      {fourniture.typeFourniture === 'Pneumatique' && (
                        <p className="text-sm text-gray-600">Dimension: {fourniture.dimension}</p>
                      )}
                      {fourniture.typeFourniture === 'LubrifiantFluide' && (
                        <p className="text-sm text-gray-600">Type de lubrifiant: {fourniture.typeLubrifiant}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>Aucune fourniture disponible pour ce type.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListeFournituresGroupées;
