import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Techniciens = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTechnicien, setNewTechnicien] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });

  useEffect(() => {
    fetchTechniciens();
  }, []);

  const fetchTechniciens = async () => {
    try {
      const response = await axios.get('/api/users/techniciens');
      const data = Array.isArray(response.data) ? response.data : [];
      setTechniciens(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des techniciens", error);
      setTechniciens([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce technicien ?")) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchTechniciens();
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
      }
    }
  };

  const handleAddTechnicien = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', { ...newTechnicien, role: 'technicien' });
      setNewTechnicien({ nom: '', prenom: '', email: '', telephone: '' });
      setShowForm(false);
      fetchTechniciens();
    } catch (error) {
      console.error("Erreur lors de l'ajout", error);
    }
  };

  const filteredTechniciens = techniciens.filter((tech) =>
    `${tech.nom} ${tech.prenom} ${tech.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl bg-white-100 rounded-2xl shadow-2xl p-8">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Liste des Techniciens
      </h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 font-semibold">
            Search:
          </span>
          <input
            type="text"
            className="border border-gray-300 rounded-md py-2 pl-3 pr-20 w-full focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-600 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out flex items-center gap-2"
          >
            + Ajouter un Technicien
          </button>
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
              onChange={(e) =>
                setNewTechnicien({ ...newTechnicien, nom: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              className="p-2 border rounded"
              value={newTechnicien.prenom}
              onChange={(e) =>
                setNewTechnicien({ ...newTechnicien, prenom: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded"
              value={newTechnicien.email}
              onChange={(e) =>
                setNewTechnicien({ ...newTechnicien, email: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Téléphone"
              className="p-2 border rounded"
              value={newTechnicien.telephone}
              onChange={(e) =>
                setNewTechnicien({
                  ...newTechnicien,
                  telephone: e.target.value,
                })
              }
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

      <div className="overflow-x-auto rounded-xl bg-white p-6 shadow-md">
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
              filteredTechniciens.map((tech, index) => (
                <tr
                  key={tech._id}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  <td className="px-4 py-3 border-b">{tech.nom}</td>
                  <td className="px-4 py-3 border-b">{tech.prenom}</td>
                  <td className="px-4 py-3 border-b">{tech.email}</td>
                  <td className="px-4 py-3 border-b">{tech.telephone}</td>
                  <td className="px-4 py-3 border-b text-sm text-gray-500 italic">
                    {tech.lastLogin
                      ? new Date(tech.lastLogin).toLocaleString()
                      : 'Jamais'}
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
                      onClick={() => handleDelete(tech._id)}
                    >
                      Supprimer
                    </button>
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
    </div>
  );
};

export default Techniciens;
