import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `${req.ip}-${req.headers['user-agent']}`;
  },
  skipSuccessfulRequests: true
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    error: 'Muitas requisições. Tente novamente em alguns instantes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    error: 'Muitas consultas. Tente novamente em alguns instantes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
