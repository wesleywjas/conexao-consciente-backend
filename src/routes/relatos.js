const express = require('express');
const { criarRelato, listarRelatos, estatisticas } = require('../controllers/relatoController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Criar relato (precisa estar autenticado)
router.post('/', authMiddleware, criarRelato);

// Listar relatos (apenas instituições)
router.get('/', authMiddleware, listarRelatos);

// Estatísticas (apenas instituições)
router.get('/estatisticas', authMiddleware, estatisticas);

module.exports = router;