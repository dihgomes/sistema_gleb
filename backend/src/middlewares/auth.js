import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      nome: decoded.nome,
      role: decoded.role
    };
    
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  return next();
}

export default authenticateToken;
