require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

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
    console.log('🔐 [CORS] Verificando origem:', origin || 'sem origem');
    
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('✅ [CORS] Origem permitida');
      callback(null, true);
    } else {
      console.log('❌ [CORS] Origem bloqueada:', origin);
      console.log('📋 [CORS] Origens permitidas:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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
  console.error('Erro:', err);

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
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 API disponível em: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
