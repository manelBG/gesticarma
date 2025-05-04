import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getFournisseurs } from "../redux/fournisseurSlice/fournisseurSlice";
// import { getMarques } from "../redux/marqueSlice/marqueSlice";
import { useNavigate } from "react-router-dom";
import { createFourniture } from "../redux/fournitureSlice/fournitureSlice";

const AjouterFourniture = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const [fourniture, setFourniture] = useState({
    nom: "",
    // marque: "",
    quantite: "",
    dateAjout: new Date().toISOString().split("T")[0],
    typeFourniture: "",
    reference: "",
    description: "",
    dimension: "",
    typeFiltre: "",
    typeLubrifiant: "",
    // fournisseur: "",
    technicien: "", // Auto-set from logged user
  });
console.log(fourniture, "fourniture");
//   const { listFournisseur } = useSelector((state) => state.fournisseurs);
//   const { listMarque } = useSelector((state) => state.marques);

  useEffect(() => {
    // dispatch(getFournisseurs());
    // dispatch(getMarques());

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFourniture((prev) => ({
        ...prev,
        technicien: storedUser._id,
      }));
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFourniture((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(createFourniture(fourniture));
      if (createFourniture.fulfilled.match(resultAction)) {
        navigate("/fournitures");
      } else {
        setError(
          resultAction.payload || "Erreur lors de l'ajout de la fourniture."
        );
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-pacifico mb-6 text-center">
        Ajouter une Fourniture
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom */}
        <div>
          <label className="block font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="nom"
            value={fourniture.nom}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            
          />
        </div>

        {/* Marque */}
        {/* <div>
          <label className="block font-semibold mb-2">Marque</label>
          <select
            name="marque"
            value={fourniture.marque}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            
          >
            <option value="">Sélectionner une marque</option>
            {listMarque.map((marque) => (
              <option key={marque._id} value={marque._id}>
                {marque.nom}
              </option>
            ))} 
          </select>
        </div> */}

        {/* Quantité */}
        <div>
          <label className="block font-semibold mb-2">Quantité</label>
          <input
            type="number"
            name="quantite"
            value={fourniture.quantite}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            
          />
        </div>

        {/* Type Fourniture */}
        <div>
          <label className="block font-semibold mb-2">Type de Fourniture</label>
          <select
            name="typeFourniture"
            value={fourniture.typeFourniture}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            
          >
            <option value="">Sélectionner un type</option>
            <option value="PieceDetachee">Pièce Détachée</option>
            <option value="Pneumatique">Pneumatique</option>
            <option value="Filtre">Filtre</option>
            <option value="LubrifiantFluide">Lubrifiant/Fluide</option>
          </select>
        </div>

        {/* Conditionally displayed fields */}
        {fourniture.typeFourniture === "PieceDetachee" && (
          <>
            <div>
              <label className="block font-semibold mb-2">Référence</label>
              <input
                type="text"
                name="reference"
                value={fourniture.reference}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
                
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={fourniture.description}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
                
              />
            </div>
          </>
        )}

        {fourniture.typeFourniture === "Pneumatique" && (
          <div>
            <label className="block font-semibold mb-2">Dimension</label>
            <input
              type="text"
              name="dimension"
              value={fourniture.dimension}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              
            />
          </div>
        )}

        {fourniture.typeFourniture === "Filtre" && (
          <>
            <div>
              <label className="block font-semibold mb-2">Type de Filtre</label>
              <input
                type="text"
                name="typeFiltre"
                value={fourniture.typeFiltre}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
                
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={fourniture.description}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
                
              />
            </div>
          </>
        )}

        {fourniture.typeFourniture === "LubrifiantFluide" && (
          <div>
            <label className="block font-semibold mb-2">
              Type de Lubrifiant
            </label>
            <input
              type="text"
              name="typeLubrifiant"
              value={fourniture.typeLubrifiant}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              
            />
          </div>
        )}

        {/* Fournisseur */}
        {/* <div>
          <label className="block font-semibold mb-2">Fournisseur</label>
          <select
            name="fournisseur"
            value={fourniture.fournisseur}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            
          >
            <option value="">Sélectionner un fournisseur</option>
          {listFournisseur.map((fournisseur) => (
              <option key={fournisseur._id} value={fournisseur._id}>
                {fournisseur.nom}
              </option>
            ))} 
          </select>
        </div> */}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterFourniture;
