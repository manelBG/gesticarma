import express from 'express';
import { addEmploye, getAllEmployees, deleteEmployee, updateEmployee } from '../controllers/employeController.js';




const router = express.Router();

router.post('/add', addEmploye);

router.get('/getAllEmployees', getAllEmployees);

router.delete("/deleteEmployee/:id", deleteEmployee);

// Mettre à jour un employé
router.put("/updateEmployee/:id", updateEmployee);



export default router;
