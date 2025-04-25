import express from 'express';
import { addEmploye } from '../controllers/employeController.js';

const router = express.Router();

router.post('/add', addEmploye);

export default router;
