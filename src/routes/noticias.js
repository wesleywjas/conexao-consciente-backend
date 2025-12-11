const express = require('express');
const { criarNoticia, listarNoticias, getNoticia, deletarNoticia } = require('../controllers/noticiaController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Públicas
router.get('/', listarNoticias);
router.get('/:id', getNoticia);

// Protegidas (apenas instituições)
router.post('/', authMiddleware, criarNoticia);
router.delete('/:id', authMiddleware, deletarNoticia);

module.exports = router;