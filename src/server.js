const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const relatosRoutes = require('./routes/relatos');
const noticiasRoutes = require('./routes/noticias');
const instituicoesRoutes = require('./routes/instituicoes');

const app = express();

// CORS - Permitir frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://conexao-consciente-frontend-l2iq.vercel.app',
    'https://conexao-consciente-frontend-git-a0e88d-wesleys-projects-8354d382.vercel.app',
    'https://conexao-consciente-frontend-l21q-oh6iyo6nr.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// IMPORTANTE: adicionar antes das rotas
app.options('*', cors()); // Habilitar pre-flight para todas as rotas

app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/relatos', relatosRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/instituicoes', instituicoesRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Conexão Consciente funcionando!',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Usar porta do Railway ou 5000 localmente
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS habilitado para Vercel`);
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;