// src/pages/AjoutEmploye.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjoutEmploye = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/employes/add', formData);
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/employes'); // 👈 Redirection vers la liste
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'ajout.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-pacifico text-center mb-6 text-gray-600">Ajouter un Employé</h2>
      
      {message && (
        <div className="mb-4 text-center text-green-600 font-semibold">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required className="w-full border rounded-md p-3" />
        <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required className="w-full border rounded-md p-3" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border rounded-md p-3" />
        <input type="tel" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} required className="w-full border rounded-md p-3" />
        <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required className="w-full border rounded-md p-3" />
        
        <button type="submit" className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-600 transition duration-200">
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default AjoutEmploye;
