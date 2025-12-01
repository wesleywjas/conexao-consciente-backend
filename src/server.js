const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const relatosRoutes = require('./routes/relatos');
const noticiasRoutes = require('./routes/noticias');

const app = express();

// CORS - Permitir frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://conexao-consciente-frontend-l2iq.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requisições sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/relatos', relatosRoutes);
app.use('/api/noticias', noticiasRoutes);

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
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;