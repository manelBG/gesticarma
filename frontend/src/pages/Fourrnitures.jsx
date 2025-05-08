import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  deleteFourniture,
  getFournitures,
  updateFourniture,
} from "../redux/fournitureSlice/fournitureSlice";
import { useDispatch, useSelector } from "react-redux";

const ListeFournituresGroupées = () => {
  const dispatch = useDispatch();
  const [fournitures, setFournitures] = useState([]);
  const [error, setError] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [selectedFourniture, setSelectedFourniture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleEditClick = (fourniture) => {
    setSelectedFourniture(fourniture);
    setShowModal(true);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateFourniture({
          fournitureId: selectedFourniture._id,
          updatedData: selectedFourniture,
        })
      );
      setShowModal(false);
      dispatch(getFournitures()); // Refresh la liste
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const { listFourniture } = useSelector((state) => state.fournitures);
  console.log(listFourniture, "listFourniture");
  useEffect(() => {
    dispatch(getFournitures());
  }, [dispatch]);
  useEffect(() => {
    const fetchFournitures = async () => {
      try {
        const response = await axios.get("/api/fournitures");
        console.log(response.data); // Vérifie la structure de la réponse
        if (Array.isArray(response.data)) {
          setFournitures(response.data);
        } else {
          setError("La réponse n'est pas un tableau.");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des fournitures");
        console.error(err);
      }
    };

    fetchFournitures();
  }, []);

  const typeCouleurs = {
    PieceDetachee: "bg-blue-100 border-blue-300",
    Pneumatique: "bg-gray-100 border-gray-300",
    Filtre: "bg-indigo-100 border-indigo-300",
    LubrifiantFluide: "bg-cyan-100 border-cyan-300",
  };

  //  const handleDelete = async (fournitureId) => {
  //    if (
  //      window.confirm("Êtes-vous sûr de vouloir supprimer ce fourniture ?")
  //    ) {
  //      try {
  //        await dispatch(deleteFourniture(fournitureId));
  //        // After deletion, re-fetch the list of vehicles
  //        dispatch(getFournitures());
  //      } catch (error) {
  //        console.error("Erreur lors de la suppression :", error);
  //      }
  //    }
  //  };

  // État local
  const [selectedFournitureId, setSelectedFournitureId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Ouvre la modale
  const handleDeleteClick = (fournitureId) => {
    setSelectedFournitureId(fournitureId);
    setShowDeleteModal(true);
  };

  // Confirme la suppression
  const confirmDelete = async () => {
    try {
      await dispatch(deleteFourniture(selectedFournitureId));
      dispatch(getFournitures());
      setShowDeleteModal(false);
      setSelectedFournitureId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Fournitures
      </h1>
      {storedUser?.role === "technicien" && (
        <div className="flex justify-end mb-4">
          <a
            href="/fourniture/ajouter"
            className="bg-gray-600 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center gap-2"
          >
            + Ajouter une fourniture
          </a>
        </div>
      )}

      {/* Affichage des erreurs */}
      {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}

      {/* Grand carré contenant les petits carrés de fournitures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Groupes de fournitures par type */}
        {Object.keys(typeCouleurs).map((type) => {
          const fournituresType = fournitures.filter(
            (f) => f.typeFourniture === type
          );
          return (
            <div
              key={type}
              className={`p-6 rounded-xl shadow-lg ${typeCouleurs[type]} border-2`}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">
                {type}
              </h2>
              {/* Affichage des fournitures pour ce type */}
              <div className="space-y-4">
                {listFourniture?.filter((f) => f.typeFourniture === type)
                  ?.length > 0 ? (
                  listFourniture
                    ?.filter((f) => f.typeFourniture === type)
                    .map((fourniture) => (
                      <div
                        key={fourniture._id}
                        className="p-4 bg-white rounded-lg shadow-md"
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          {fourniture?.nom}
                        </h3>
                        <p className="text-sm text-gray-600">
                        Technicien: {fourniture.technicien ? `${fourniture.technicien.prenom} ${fourniture.technicien.nom}` : 'Non défini'}
                        </p>
                        <p className="text-sm text-gray-600">
                         Marque: {fourniture.marque?.nom || 'Non définie'}
                        </p>
                        <p className="text-sm text-gray-600">
                         Fournisseur: {fourniture.fournisseur?.nom || 'non définie'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantité: {fourniture.quantite}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date d'ajout:{" "}
                          {new Date(fourniture.dateAjout).toLocaleDateString()}
                        </p>
                        {/* Affichage spécifique selon le type */}
                        {fourniture.typeFourniture === "PieceDetachee" && (
                          <p className="text-sm text-gray-600">
                            Référence: {fourniture.reference}
                          </p>
                        )}
                        {fourniture.typeFourniture === "Filtre" && (
                          <p className="text-sm text-gray-600">
                            Type de filtre: {fourniture.typeFiltre}
                          </p>
                        )}
                        {fourniture.typeFourniture === "Pneumatique" && (
                          <p className="text-sm text-gray-600">
                            Dimension: {fourniture.dimension}
                          </p>
                        )}
                        {fourniture.typeFourniture === "LubrifiantFluide" && (
                          <p className="text-sm text-gray-600">
                            Type de lubrifiant: {fourniture.typeLubrifiant}
                          </p>
                        )}
                        <button
                          onClick={() => handleEditClick(fourniture)}
                          className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded-full"
                        >
                          Modifier
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full"
                          onClick={() => handleDeleteClick(fourniture._id)}
                        >
                          Supprimer
                        </button>
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
      {showModal && selectedFourniture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md overflow-y-auto max-h-screen">
            <h2 className="text-2xl font-bold mb-4">Modifier la Fourniture</h2>
            <form onSubmit={handleUpdate}>
              {/* Nom */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={selectedFourniture.nom || ""}
                  onChange={(e) =>
                    setSelectedFourniture({
                      ...selectedFourniture,
                      nom: e.target.value,
                    })
                  }
                  className="border rounded w-full py-2 px-3"
                />
              </div>

              {/* Quantité */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  value={selectedFourniture.quantite || ""}
                  onChange={(e) =>
                    setSelectedFourniture({
                      ...selectedFourniture,
                      quantite: e.target.value,
                    })
                  }
                  className="border rounded w-full py-2 px-3"
                />
              </div>

              {/* Type de fourniture */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Type de Fourniture
                </label>
                <select
                  value={selectedFourniture.typeFourniture || ""}
                  onChange={(e) =>
                    setSelectedFourniture({
                      ...selectedFourniture,
                      typeFourniture: e.target.value,
                    })
                  }
                  className="border rounded w-full py-2 px-3"
                >
                  <option value="">-- Choisir --</option>
                  <option value="PieceDetachee">Pièce Détachée</option>
                  <option value="Pneumatique">Pneumatique</option>
                  <option value="Filtre">Filtre</option>
                  <option value="LubrifiantFluide">Lubrifiant/Fluide</option>
                </select>
              </div>

              {/* Référence (pour PieceDetachee) */}
              {selectedFourniture.typeFourniture === "PieceDetachee" && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Référence
                  </label>
                  <input
                    type="text"
                    value={selectedFourniture.reference || ""}
                    onChange={(e) =>
                      setSelectedFourniture({
                        ...selectedFourniture,
                        reference: e.target.value,
                      })
                    }
                    className="border rounded w-full py-2 px-3"
                  />
                </div>
              )}

              {/* Type de filtre (pour Filtre) */}
              {selectedFourniture.typeFourniture === "Filtre" && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Type de Filtre
                  </label>
                  <input
                    type="text"
                    value={selectedFourniture.typeFiltre || ""}
                    onChange={(e) =>
                      setSelectedFourniture({
                        ...selectedFourniture,
                        typeFiltre: e.target.value,
                      })
                    }
                    className="border rounded w-full py-2 px-3"
                  />
                </div>
              )}

              {/* Dimension (pour Pneumatique) */}
              {selectedFourniture.typeFourniture === "Pneumatique" && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Dimension
                  </label>
                  <input
                    type="text"
                    value={selectedFourniture.dimension || ""}
                    onChange={(e) =>
                      setSelectedFourniture({
                        ...selectedFourniture,
                        dimension: e.target.value,
                      })
                    }
                    className="border rounded w-full py-2 px-3"
                  />
                </div>
              )}

              {/* Type de lubrifiant (pour LubrifiantFluide) */}
              {selectedFourniture.typeFourniture === "LubrifiantFluide" && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Type de Lubrifiant
                  </label>
                  <input
                    type="text"
                    value={selectedFourniture.typeLubrifiant || ""}
                    onChange={(e) =>
                      setSelectedFourniture({
                        ...selectedFourniture,
                        typeLubrifiant: e.target.value,
                      })
                    }
                    className="border rounded w-full py-2 px-3"
                  />
                </div>
              )}

              {/* Date d'ajout (readonly) */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Date d'Ajout
                </label>
                <input
                  type="text"
                  value={new Date(
                    selectedFourniture.dateAjout
                  ).toLocaleDateString()}
                  readOnly
                  className="border rounded w-full py-2 px-3 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer cette fourniture ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeFournituresGroupées;
