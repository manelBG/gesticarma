import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createInterventionExterne,
  getInterventionsExternes,
} from "../redux/interventionexterneSlice/interventionexterneSlice";
import { getVehicules } from "../redux/vehiculeSlice/vehiculeSlice";
import { getPrestataires } from "../redux/prestataireSlice/prestataireSlice"; // Si tu as une liste de prestataires

const AjoutInterventionExterne = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const [interventionExterne, setInterventionExterne] = useState({
    description: "",
    dateDebut: "",
    dateFin: "",
    technicien: "", // Will be set automatically
    vehicule: "",
    prestataire: "",
    cout: "",
    factureNumero: "",
    etat: "en attente", // Default state
  });
  console.log(interventionExterne, "interventionExterne");
  const { listVehicule } = useSelector((state) => state.vehicules);
  const { prestataires = [] } = useSelector((state) => state.prestataire || {});
  console.log(prestataires, "listPrestataire");
  // Liste des prestataires

  useEffect(() => {
    dispatch(getVehicules());
    dispatch(getPrestataires()); // Charger les prestataires
  }, [dispatch]);

  // const { prestataires } = useSelector((state) => state.prestataire);

  useEffect(() => {
    dispatch(getPrestataires());
  }, [dispatch]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          setUser(storedUser);
          setInterventionExterne((prev) => ({
            ...prev,
            technicien: storedUser._id, // Set technicien automatically
          }));
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterventionExterne((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        createInterventionExterne(interventionExterne)
      );
      if (createInterventionExterne.fulfilled.match(resultAction)) {
        navigate("/interventions/externe"); // Page de la liste des interventions externes
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
        Ajouter une Intervention Externe
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={interventionExterne.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Date Début */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Date de Début
          </label>
          <input
            type="date"
            name="dateDebut"
            value={interventionExterne.dateDebut}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Date Fin */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Date de Fin
          </label>
          <input
            type="date"
            name="dateFin"
            value={interventionExterne.dateFin}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Véhicule */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Véhicule
          </label>
          <select
            name="vehicule"
            value={interventionExterne.vehicule}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Sélectionner un véhicule</option>
            {listVehicule
              .filter(
                (vehicule) =>
                  vehicule.statut === "Disponible" ||
                  vehicule._id === interventionExterne.vehicule
              )
              .map((vehicule) => (
                <option key={vehicule._id} value={vehicule._id}>
                  {vehicule.marque} {vehicule.modele} ({vehicule.statut})
                </option>
              ))}
          </select>
        </div>

        {/* Prestataire */}
        {/* Prestataire */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Prestataire
          </label>
          <select
            name="prestataire" // Important de lier le nom à l'état
            value={interventionExterne.prestataire} // Liaison avec l'état
            onChange={handleChange} // Utilisation de handleChange pour mettre à jour l'état
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Sélectionner un prestataire</option>
            {prestataires.map((prestataire) => (
              <option key={prestataire._id} value={prestataire._id}>
                {prestataire.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Coût */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Coût (TND)
          </label>
          <input
            type="number"
            name="cout"
            value={interventionExterne.cout}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Facture Numéro */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Numéro de Facture
          </label>
          <input
            type="text"
            name="factureNumero"
            value={interventionExterne.factureNumero}
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
            name="etat"
            value={interventionExterne.etat}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="en attente">En attente</option>
            <option value="en cours">En cours</option>
            <option value="terminée">Terminée</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Rapport (PDF uniquement)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setInterventionExterne((prev) => ({
                ...prev,
                rapport: e.target.files[0],
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4 flex justify-end">
          <button
            type="submit"
            className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-gray-600"
          >
            Ajouter l'Intervention Externe
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjoutInterventionExterne;
