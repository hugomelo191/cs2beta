import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplication,
  reviewApplication,
  getApplicationStats
} from '../controllers/casterApplicationController.js';

const router = Router();

// Rotas públicas
router.post('/', createApplication); // Criar candidatura
router.get('/:id', getApplication); // Obter candidatura específica

// Rotas admin (TODO: Adicionar middleware de autenticação)
router.get('/', getApplications); // Listar candidaturas
router.put('/:id/review', reviewApplication); // Revisar candidatura
router.get('/admin/stats', getApplicationStats); // Estatísticas

export default router; 