import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createIntervention } from "../redux/interventionSlice/interventionSlice";
import { getVehicules } from "../redux/vehiculeSlice/vehiculeSlice";

const AjoutIntervention = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const [intervention, setIntervention] = useState({
    type: "",
    description: "",
    dateIntervention: "",
    cout: "",
    statut: "",
    kilometrage: "",
    duree: "",
    technicien: "", // Will be set automatically
    vehicule: "",
  });

  const { listVehicule } = useSelector((state) => state.vehicules);

  useEffect(() => {
    dispatch(getVehicules());
  }, [dispatch]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setTimeout(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) {
            setUser(storedUser);
            setIntervention((prev) => ({
              ...prev,
              technicien: storedUser._id, // Set technicien automatically
            }));
          } else {
            navigate("/login");
          }
        }, 300);
      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIntervention((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(createIntervention(intervention));
      if (createIntervention.fulfilled.match(resultAction)) {
        navigate("/interventions/interne");
      } else {
        setError(
          resultAction.payload || "Erreur lors de l'ajout de l'intervention."
        );
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-4xl font-pacifico text-black mb-6 text-center">
        Ajouter une Intervention
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Type */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Type</label>
          <select
            name="type"
            value={intervention.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sélectionner un type</option>
            <option value="Urgente">Urgente</option>
            <option value="Curative">Curative</option>
            <option value="Preventive">Préventive</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={intervention.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Date Intervention */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Date d'Intervention
          </label>
          <input
            type="date"
            name="dateIntervention"
            value={intervention.dateIntervention}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Coût */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Coût (TND)
          </label>
          <input
            type="number"
            name="cout"
            value={intervention.cout}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Statut */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Statut
          </label>
          <select
            name="statut"
            value={intervention.statut}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Sélectionner un statut</option>
            <option value="en cours">En cours</option>
            <option value="terminée">Terminée</option>
            <option value="annulée">Annulée</option>
          </select>
        </div>

        {/* Kilométrage */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Kilométrage
          </label>
          <input
            type="number"
            name="kilometrage"
            value={intervention.kilometrage}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Durée */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Durée (heures)
          </label>
          <input
            type="number"
            name="duree"
            value={intervention.duree}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Véhicule */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Véhicule
          </label>
          <select
            name="vehicule"
            value={intervention.vehicule}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Sélectionner un véhicule</option>
            {listVehicule
              .filter(
                (vehicule) =>
                  vehicule.statut === "Disponible" ||
                  vehicule._id === intervention.vehicule
              )
              .map((vehicule) => (
                <option key={vehicule._id} value={vehicule._id}>
                  {vehicule.marque} {vehicule.modele} ({vehicule.statut})
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            type="submit"
            className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-gray-600"
          >
            Ajouter l'Intervention
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjoutIntervention;
