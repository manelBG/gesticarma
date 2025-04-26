import React, { useState } from 'react';
import { FaCar, FaTools, FaCalendarAlt, FaClock, FaClipboardList } from 'react-icons/fa';
import "../styles/PlanMissionForm.css";

const PlanMissionForm = () => {
  const [formData, setFormData] = useState({
    missionName: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    vehicle: '',
    supplies: [],
    priority: 'Normale',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.missionName) newErrors.missionName = "Le nom de la mission est requis.";
    if (!formData.description) newErrors.description = "La description est requise.";
    if (!formData.startDate) newErrors.startDate = "La date de début est requise.";
    if (!formData.endDate) newErrors.endDate = "La date de fin est requise.";
    if (!formData.startTime) newErrors.startTime = "L'heure de début est requise.";
    if (!formData.endTime) newErrors.endTime = "L'heure de fin est requise.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      console.log(formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-pacifico text-center mb-6 text-gray-600">Planifier une Mission</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Date de début et Heure de début */}
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded-md p-3 pl-10"
            />
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            {errors.startDate && <div className="text-red-600 text-sm">{errors.startDate}</div>}
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
            {errors.startTime && <div className="text-red-600 text-sm">{errors.startTime}</div>}
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
            />
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            {errors.endDate && <div className="text-red-600 text-sm">{errors.endDate}</div>}
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
            {errors.endTime && <div className="text-red-600 text-sm">{errors.endTime}</div>}
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
          {errors.missionName && <div className="text-red-600 text-sm">{errors.missionName}</div>}
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
          {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
        </div>

        {/* Véhicule */}
        <div className="relative">
          <select
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className="w-full border rounded-md p-3 pl-10"
          >
            <option value="">Sélectionner un véhicule</option>
            {/* Liste des véhicules */}
          </select>
          <FaCar className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* Fournitures nécessaires */}
        <div className="relative">
          <select
            multiple
            name="supplies"
            value={formData.supplies}
            onChange={handleChange}
            className="w-full border rounded-md p-3 pl-10"
          >
            {/* Liste des fournitures */}
          </select>
          <FaTools className="absolute left-3 top-3 text-gray-400" />
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
                checked={formData.priority === 'Normale'}
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
                checked={formData.priority === 'Importante'}
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
                checked={formData.priority === 'Urgente'}
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
