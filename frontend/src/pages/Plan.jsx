import React, { useEffect, useState } from "react";
import {
  FaCar,
  FaTools,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import "../styles/PlanMissionForm.css";
import { useDispatch, useSelector } from "react-redux";
import { getVehicules } from "../redux/vehiculeSlice/vehiculeSlice";
import { createMission } from "../redux/missionSlice/missionSlice";
import { useNavigate } from "react-router-dom";

const PlanMissionForm = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    missionName: "",
    description: "",
    dateDebut: "",
    startTime: "",
    endDate: "",
    endTime: "",
    vehicule: "",
    priority: "",
    notes: "",
    statut: "en attente",
  });

  console.log("formDatapan:", formData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.missionName)
      errors.missionName = "La missionName est requise.";
    if (!formData.description)
      errors.description = "La description est requise.";
    if (!formData.dateDebut) errors.dateDebut = "La date de début est requise.";
    if (!formData.startTime) errors.startTime = "L'heure de début est requise.";
    if (!formData.endDate) errors.endDate = "La date de fin est requise.";
    if (!formData.endTime) errors.endTime = "L'heure de fin est requise.";
    if (!formData.vehicule) errors.vehicule = "Un véhicule est requis.";
    if (!formData.notes) errors.notes = "notes est requis.";
    if (!formData.statut) errors.statut = "statut est requis.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    // Convertir date et heure en objets Date
    const startDateTime = new Date(
      `${formData.dateDebut}T${formData.startTime}`
    );
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    const missionData = {
      missionName: formData.missionName,
      description: formData.description,
      dateDebut: startDateTime,
      dateFin: endDateTime,
      // Do NOT send startTime and endTime separately

      // Do NOT send startTime and endTime separately

      vehicule: formData.vehicule,
      employee: storedUser._id, // connecté
      kilometrageDebut: 0, // ou undefined si pas encore renseigné
      kilometrageFin: 0, // idem
      priority: formData.priority,
      notes: formData.notes,
      statut: formData.statut, // par défaut dans ton schema
    };

    dispatch(createMission(missionData)); // ou axios.post(...)
         navigate("/missions");

  };

  const { listVehicule } = useSelector((state) => state.vehicules);
  useEffect(() => {
    dispatch(getVehicules());
  }, [dispatch]);
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-pacifico text-center mb-6 text-gray-600">
        Planifier une Mission
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date de début et Heure de début */}
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <input
              type="date"
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border rounded-md p-3 pl-10"
            />
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            {errors.dateDebut && (
              <div className="text-red-600 text-sm">{errors.dateDebut}</div>
            )}
          </div>
          <div className="relative w-1/2">
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full border rounded-md p-3 pl-10"
            />
            <FaClock className="absolute left-3 top-3 text-gray-400" />
            {errors.startTime && (
              <div className="text-red-600 text-sm">{errors.startTime}</div>
            )}
          </div>
        </div>

        {/* Date de fin et Heure de fin */}
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border rounded-md p-3 pl-10"
              min={new Date().toISOString().split("T")[0]}
            />
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            {errors.endDate && (
              <div className="text-red-600 text-sm">{errors.endDate}</div>
            )}
          </div>
          <div className="relative w-1/2">
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full border rounded-md p-3 pl-10"
            />
            <FaClock className="absolute left-3 top-3 text-gray-400" />
            {errors.endTime && (
              <div className="text-red-600 text-sm">{errors.endTime}</div>
            )}
          </div>
        </div>

        {/* Nom de la mission */}
        <div className="relative">
          <input
            type="text"
            name="missionName"
            placeholder="Nom de la mission"
            value={formData.missionName}
            onChange={handleChange}
            className="w-full border rounded-md p-3 pl-10"
          />
          <FaClipboardList className="absolute left-3 top-3 text-gray-400" />
          {errors.missionName && (
            <div className="text-red-600 text-sm">{errors.missionName}</div>
          )}
        </div>

        {/* Description */}
        <div className="relative">
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-md p-3 pl-10"
          />
          <FaClipboardList className="absolute left-3 top-3 text-gray-400" />
          {errors.description && (
            <div className="text-red-600 text-sm">{errors.description}</div>
          )}
        </div>

        {/* Véhicule */}
        <div className="relative">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Véhicule
            </label>
            <select
              name="vehicule"
              value={formData.vehicule}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner un véhicule</option>
              {listVehicule
                .filter((vehicule) => vehicule?.statut === "Disponible")
                .map((vehicule) => (
                  <option key={vehicule._id} value={vehicule._id}>
                    {vehicule.marque} {vehicule.modele}
                  </option>
                ))}
            </select>
          </div>

          {/* <FaCar className="absolute left-3 top-3 text-gray-400" /> */}
        </div>

        {/* Fournitures nécessaires */}
        <div className="relative">
          {/* <select
            multiple
            name="supplies"
            value={formData.supplies}
            onChange={handleChange}
            className="w-full border rounded-md p-3 pl-10"
          >
          </select>
          <FaTools className="absolute left-3 top-3 text-gray-400" /> */}
        </div>

        {/* Priorité */}
        <div className="relative">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="priority"
                value="Normale"
                onChange={handleChange}
                checked={formData.priority === "Normale"}
                className="form-radio h-4 w-4 text-gray-600"
              />
              Normale
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="priority"
                value="Importante"
                onChange={handleChange}
                checked={formData.priority === "Importante"}
                className="form-radio h-4 w-4 text-gray-600"
              />
              Importante
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="priority"
                value="Urgente"
                onChange={handleChange}
                checked={formData.priority === "Urgente"}
                className="form-radio h-4 w-4 text-gray-600"
              />
              Urgente
            </div>
          </div>
        </div>

        {/* Notes supplémentaires */}
        <div className="relative">
          <textarea
            name="notes"
            placeholder="Notes supplémentaires"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border rounded-md p-3 pl-10"
          />
        </div>

        {/* Actions */}
        <button
          type="submit"
          className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition duration-200"
        >
          Planifier la mission
        </button>
      </form>
    </div>
  );
};

export default PlanMissionForm;
