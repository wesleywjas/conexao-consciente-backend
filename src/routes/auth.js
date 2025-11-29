const express = require('express');
const { cadastroUsuario, loginUsuario, loginInstituicao } = require('../controllers/authController');

const router = express.Router();

router.post('/cadastro', cadastroUsuario);
router.post('/login', loginUsuario);
router.post('/login-instituicao', loginInstituicao);

module.exports = router;