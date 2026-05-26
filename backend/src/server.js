require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares globais
const allowedOrigins = [
  'http://localhost:5173',
  'https://controle-hrrb.com.br',
  'https://www.controle-hrrb.com.br',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      logger.cors(origin, true);
      callback(null, true);
    } else {
      logger.cors(origin, false);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware de log para TODAS as requisições
app.use((req, res, next) => {
  // Ignora logs de health check e arquivos estáticos
  if (req.url === '/health' || req.url.startsWith('/uploads')) {
    return next();
  }
  
  logger.request(req.method, req.url, {
    origin: req.headers.origin,
    ip: req.ip || req.connection.remoteAddress,
    user: req.user?.nome
  });
  
  // Intercepta a resposta para logar o status
  const originalSend = res.send;
  res.send = function(data) {
    logger.response(res.statusCode);
    logger.footer();
    return originalSend.call(this, data);
  };
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Rotas da API
app.use('/api', routes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API de Carteira Digital funcionando',
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  logger.error('Erro no servidor', err);
  logger.footer();

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'Arquivo muito grande. Tamanho máximo: 5MB' 
    });
  }

  if (err.message && err.message.includes('Tipo de arquivo inválido')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.serverStart({
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    localUrl: `http://localhost:${PORT}`,
    healthUrl: `http://localhost:${PORT}/health`,
    allowedOrigins: allowedOrigins
  });
});

module.exports = app;
