import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTechnicien,
  getTechniciens,
  updateTechnicien,
} from "../redux/technicienSlice/technicienSlice";


const Techniciens = () => {
  const dispatch = useDispatch();
  const { listTechnicien, loading, error } = useSelector((state) => state.techniciens);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newTechnicien, setNewTechnicien] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    genre: "",
  });

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    genre: "",
  });

  const [selectedTechnicien, setSelectedTechnicien] = useState(null);

  useEffect(() => {
    dispatch(getTechniciens());
  }, [dispatch]);

 

  // Suppression d'un employé
    const handleDelete = async (technicienId) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cet technicien ?")) {
        try {
          await dispatch(deleteTechnicien(technicienId));
          dispatch(getTechniciens());
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      }
    };
  

  
  const handleAddTechnicien = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/techniciens/createTechnicien", newTechnicien);
      setNewTechnicien({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        genre: "",
      });
      setShowForm(false);
      dispatch(getTechniciens());
    } catch (error) {
      console.error("Erreur lors de l'ajout de technicien", error);
    }
  };

  const handleUpdateTechnicien = async (e) => {
    e.preventDefault();
    try {
     await dispatch(
          updateTechnicien({
           technicienId: selectedTechnicien._id,
           updatedData: formData,
          })
        );
        setSelectedTechnicien(null);
        dispatch(getTechniciens()); 
      } catch (error) {
            console.error("Erreur lors de la mise à jour", error);
      }
    };

    const handleEditClick = (technicien) => {
      setSelectedTechnicien(technicien);
      setFormData({
        nom: technicien.nom,
        prenom: technicien.prenom,
        email: technicien.email,
        telephone: technicien.telephone,
        genre: technicien.genre,
      });
    };

  const filteredTechniciens = listTechnicien.filter((technicien) => {
    const fullName = `${technicien.nom} ${technicien.prenom}`.toLowerCase();
    const reverseFullName = `${technicien.prenom} ${technicien.nom}`.toLowerCase();
    const search = searchTerm?.toLowerCase();
    return (
      technicien.nom?.toLowerCase().includes(search) ||
      technicien.prenom?.toLowerCase().includes(search) ||
      fullName.includes(search) ||
      reverseFullName.includes(search)
    );
  });

  return (
    <div className="w-full max-w-6xl bg-white-100 rounded-2xl shadow-2xl p-8">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Techniciens
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
            Search :
          </span>
        </div>

        <div className="flex justify-end mb-4">
          <a
            href="/techniciens/ajouter"
            className="bg-gray-600 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center gap-2"
          >
            + Ajouter un Technicien
          </a>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddTechnicien}
          className="mb-6 bg-gray-100 p-6 rounded-xl shadow-inner"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nom"
              className="p-2 border rounded"
              value={newTechnicien.nom}
              onChange={(e) => setNewTechnicien({ ...newTechnicien, nom: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              className="p-2 border rounded"
              value={newTechnicien.prenom}
              onChange={(e) => setNewTechnicien({ ...newTechnicien, prenom: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded"
              value={newTechnicien.email}
              onChange={(e) => setNewTechnicien({ ...newTechnicien, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Téléphone"
              className="p-2 border rounded"
              value={newTechnicien.telephone}
              onChange={(e) => setNewTechnicien({ ...newTechnicien, telephone: e.target.value })}
              required
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
              <th className="px-4 py-3 border-b">Nom</th>
              <th className="px-4 py-3 border-b">Prénom</th>
              <th className="px-4 py-3 border-b">Email</th>
              <th className="px-4 py-3 border-b">Téléphone</th>
              <th className="px-4 py-3 border-b">Dernière connexion</th>
              <th className="px-4 py-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTechniciens.length > 0 ? (
              filteredTechniciens.map((technicien, index) => (
                <tr key={technicien._id} className="hover:bg-blue-50 transition duration-200">
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  <td className="px-4 py-3 border-b">{technicien.nom}</td>
                  <td className="px-4 py-3 border-b">{technicien.prenom}</td>
                  <td className="px-4 py-3 border-b">{technicien.email}</td>
                  <td className="px-4 py-3 border-b">{technicien.telephone}</td>
                  <td className="px-4 py-3 border-b text-sm text-gray-500 italic">
                    {technicien.updatedAt
                      ? new Date(technicien.updatedAt).toLocaleString()
                      : "Jamais"}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded-full"
                        onClick={() => {
                         setSelectedTechnicien(technicien);
                         setFormData({
                          nom: technicien.nom,
                          prenom: technicien.prenom,
                          email: technicien.email,
                          telephone: technicien.telephone,
                          });
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full"
                         onClick={() => handleDelete(technicien._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Aucun technicien trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulaire de mise à jour technicien (style moderne intégré) */}
{selectedTechnicien && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Modifier le technicien
        </h2>
        <button
          onClick={() => setSelectedTechnicien(null)}
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

      <form onSubmit={handleUpdateTechnicien} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="text"
              value={formData.telephone}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => setSelectedTechnicien(null)}
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

    </div>
  );
};

export default Techniciens;
