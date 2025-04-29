import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../redux/employeeSlice/employeeSlice";
import axios from "axios";

const Employes = () => {
  const dispatch = useDispatch();
  const { listEmployee, loading, error } = useSelector((state) => state.employees);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newEmploye, setNewEmploye] = useState({
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

  const [selectedEmploye, setSelectedEmploye] = useState(null);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  // Ajout d'un nouvel employé
  const handleAddEmploye = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/employes/createEmployee", newEmploye);
      setNewEmploye({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        genre: "",
      });
      setShowForm(false);
      dispatch(getEmployees());
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé", error);
    }
  };

  // Suppression d'un employé
  const handleDelete = async (employeeId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        await dispatch(deleteEmployee(employeeId));
        dispatch(getEmployees());
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleUpdateEmploye = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateEmployee({
          employeeId: selectedEmploye._id,
          updatedData: formData,
        })
      );
      setSelectedEmploye(null); // Fermer le formulaire après mise à jour
      dispatch(getEmployees()); // Recharger la liste des employés
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  // Ouverture du formulaire pour édition
  const handleEditClick = (employe) => {
    setSelectedEmploye(employe);
    setFormData({
      nom: employe.nom,
      prenom: employe.prenom,
      email: employe.email,
      telephone: employe.telephone,
      genre: employe.genre,
    });
  };
  // Filtrage pour la recherche
  const filteredEmployes = listEmployee.filter((employe) => {
    const fullName = `${employe.nom} ${employe.prenom}`.toLowerCase();
    const reverseFullName = `${employe.prenom} ${employe.nom}`.toLowerCase();
    const search = searchTerm?.toLowerCase();
    return (
      employe.nom?.toLowerCase().includes(search) ||
      employe.prenom?.toLowerCase().includes(search) ||
      fullName.includes(search) ||
      reverseFullName.includes(search)
    );
  });
  

  return (
    <div className="w-full max-w-6xl bg-white-100 rounded-2xl shadow-2xl p-8">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Employés
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
            href="/employes/ajouter"
            className="bg-gray-600 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center gap-2"
          >
            + Ajouter un Employé
          </a>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddEmploye}
          className="mb-6 bg-gray-100 p-6 rounded-xl shadow-inner"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nom"
              className="p-2 border rounded"
              value={newEmploye.nom}
              onChange={(e) => setNewEmploye({ ...newEmploye, nom: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              className="p-2 border rounded"
              value={newEmploye.prenom}
              onChange={(e) => setNewEmploye({ ...newEmploye, prenom: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded"
              value={newEmploye.email}
              onChange={(e) => setNewEmploye({ ...newEmploye, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Téléphone"
              className="p-2 border rounded"
              value={newEmploye.telephone}
              onChange={(e) => setNewEmploye({ ...newEmploye, telephone: e.target.value })}
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

      {selectedEmploye && (
        <form
          onSubmit={handleUpdateEmploye}
          className="mb-6 bg-gray-100 p-6 rounded-xl shadow-inner"
        >
          <h2 className="text-2xl font-semibold text-center mb-4">Modifier l'Employé</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nom"
              className="p-2 border rounded"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              className="p-2 border rounded"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Téléphone"
              className="p-2 border rounded"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full"
          >
            Mettre à jour
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full mt-4"
            onClick={() => setSelectedEmploye(null)}
          >
            Annuler
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
            {filteredEmployes.length > 0 ? (
              filteredEmployes.map((employe, index) => (
                <tr
                  key={employe._id}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  <td className="px-4 py-3 border-b">{employe.nom}</td>
                  <td className="px-4 py-3 border-b">{employe.prenom}</td>
                  <td className="px-4 py-3 border-b">{employe.email}</td>
                  <td className="px-4 py-3 border-b">{employe.telephone}</td>
                  <td className="px-4 py-3 border-b text-sm text-gray-500 italic">
                    {employe.lastLogin
                      ? new Date(employe.lastLogin).toLocaleString()
                      : 'Jamais'}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex items-center gap-2 whitespace-nowrap"> 
                      <button
                       className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded-full"
                       onClick={() => handleEditClick(employe)}
                     >
                        Modifier
                      </button>
                      <button
                       className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full"
                       onClick={() => handleDelete(employe._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  Aucun employé trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    {/* Formulaire de mise à jour employé (style moderne intégré) */}
    {selectedEmploye && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Modifier l'employé
              </h2>
              <button
                onClick={() => setSelectedEmploye(null)}
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

            <form onSubmit={handleUpdateEmploye} className="space-y-4">
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                    required
                  >  
                    <option value="" disabled>-- Choisir un genre --</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedEmploye(null)}
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
export default Employes;
