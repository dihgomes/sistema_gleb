import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.JWT_SECRET) {
  console.error('\n❌ ERRO CRÍTICO: JWT_SECRET não configurado no .env');
  console.log('Configure JWT_SECRET com um valor secreto forte\n');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('\n❌ ERRO CRÍTICO: DATABASE_URL não configurado no .env');
  console.log('Configure DATABASE_URL com a string de conexão do PostgreSQL\n');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3002;

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'https://controle-hrrb.com.br',
  'https://www.controle-hrrb.com.br',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

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

app.use((req, res, next) => {
  if (req.url === '/health' || req.url.startsWith('/uploads')) {
    return next();
  }
  
  logger.request(req.method, req.url, {
    origin: req.headers.origin,
    ip: req.ip || req.connection.remoteAddress,
    user: req.user?.nome
  });
  
  const originalSend = res.send;
  res.send = function(data) {
    logger.response(res.statusCode);
    logger.footer();
    return originalSend.call(this, data);
  };
  
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API de Carteira Digital funcionando',
    timestamp: new Date().toISOString()
  });
});

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

  if (err.message && err.message.includes('Not allowed by CORS')) {
    return res.status(403).json({ error: 'Origem não permitida' });
  }

  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({ 
    error: 'Erro interno do servidor',
    ...(isDevelopment && {
      message: err.message,
      stack: err.stack
    })
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  logger.serverStart({
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    localUrl: `http://localhost:${PORT}`,
    healthUrl: `http://localhost:${PORT}/health`,
    allowedOrigins: allowedOrigins
  });
});

export default app;
