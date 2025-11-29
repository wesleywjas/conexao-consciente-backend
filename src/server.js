const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const relatosRoutes = require('./routes/relatos');
const instituicoesRoutes = require('./routes/instituicoes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/relatos', relatosRoutes);
app.use('/api/instituicoes', instituicoesRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Conexão Consciente funcionando!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;