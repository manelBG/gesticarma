import express from 'express';
import { ajouterFourniture } from '../controllers/fournitureController.js';

const router = express.Router();

router.post('/', ajouterFourniture);

export default router;
