const express = require('express');
const { cadastrarInstituicao, loginInstituicao, getMeuPerfil } = require('../controllers/instituicaoController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/cadastro', cadastrarInstituicao);
router.post('/login', loginInstituicao);
router.get('/perfil', authMiddleware, getMeuPerfil);

module.exports = router;