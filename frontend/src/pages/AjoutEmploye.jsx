import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";
import { createEmployee } from "../redux/employeeSlice/employeeSlice";
import { useDispatch } from "react-redux";

const AjoutEmploye = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    genre: "",
    role: "employee", 
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telephone") {
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length <= 8) {
        setFormData({ ...formData, [name]: onlyNums });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Update password strength
    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const getPasswordStrength = (password) => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecials = /[^a-zA-Z0-9]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!isLongEnough || !hasLetters) return "weak";
    if (hasLetters && hasNumbers && !hasSpecials) return "medium";
    if (hasLetters && hasNumbers && hasSpecials) return "strong";

    return "weak";
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = "Le nom est requis.";
    if (!formData.prenom) newErrors.prenom = "Le prénom est requis.";
    if (
      !formData.email ||
      !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)
    ) {
      newErrors.email = "L'email doit être une adresse @gmail.com.";
    }
    if (!formData.telephone || !/^\d{8}$/.test(formData.telephone)) {
      newErrors.telephone = "Le numéro doit contenir exactement 8 chiffres.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères.";
    }
    if (!formData.genre) newErrors.genre = "Le genre est requis.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        // Dispatch de l'action pour créer un employé
        const resultAction = await dispatch(createEmployee(formData));
        console.log(resultAction, "resultAction"); // Log du résultat pour le debug

        // Vérification si l'action a réussi
        if (createEmployee.fulfilled.match(resultAction)) {
          navigate("/employes"); // Redirection vers la liste des employés
        } else {
          setMessage(
            resultAction.payload || "Erreur lors de l'ajout de l'employé."
          );
        }
      } catch (err) {
        setMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-pacifico text-center mb-6 text-gray-600">
        Ajouter un Employé
      </h2>

      {message && (
        <div className="mb-4 text-center text-green-600 font-semibold">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom & Prénom */}
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full border rounded-md p-3 pl-10"
            />
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            {errors.nom && (
              <div className="text-red-600 text-sm">{errors.nom}</div>
            )}
          </div>
          <div className="relative w-1/2">
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full border rounded-md p-3 pl-10"
            />
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            {errors.prenom && (
              <div className="text-red-600 text-sm">{errors.prenom}</div>
            )}
          </div>
        </div>

        {/* Email & Téléphone */}
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md p-3 pl-10"
            />
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            {errors.email && (
              <div className="text-red-600 text-sm">{errors.email}</div>
            )}
          </div>
          <div className="relative w-1/2">
            <input
              type="tel"
              name="telephone"
              placeholder="Téléphone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full border rounded-md p-3 pl-10"
              maxLength={8}
            />
            <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
            {errors.telephone && (
              <div className="text-red-600 text-sm">{errors.telephone}</div>
            )}
          </div>
        </div>

        {/* Mot de passe */}
        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border rounded-md p-3 pl-10 ${
              passwordStrength === "strong"
                ? "bg-green-100"
                : passwordStrength === "medium"
                ? "bg-orange-100"
                : passwordStrength === "weak"
                ? "bg-red-100"
                : "bg-white"
            }`}
          />
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          {errors.password && (
            <div className="text-red-600 text-sm">{errors.password}</div>
          )}
          {passwordStrength && (
            <div
              className={`text-sm mt-1 ${
                passwordStrength === "strong"
                  ? "text-green-600"
                  : passwordStrength === "medium"
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {passwordStrength === "strong"
                ? "Mot de passe fort"
                : passwordStrength === "medium"
                ? "Mot de passe moyen"
                : "Mot de passe faible"}
            </div>
          )}
        </div>

        {/* Genre */}
        <div>
          <label className="block mb-2 text-gray-700 font-semibold">
            Genre :
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="genre"
                value="male"
                checked={formData.genre === "male"}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-gray-600"
              />
              Homme
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="genre"
                value="female"
                checked={formData.genre === "female"}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-gray-600"
              />
              Femme
            </label>
          </div>

          {errors.genre && (
            <div className="text-red-600 text-sm mt-1">{errors.genre}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition duration-200"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default AjoutEmploye;
