import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js'; // Importar a chave secreta

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn('Tentativa de acesso sem token:', req.method, req.originalUrl);
    return res.status(401).json({ mensagem: 'Não autorizado: Token não fornecido' });
  }

  const [ , token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    console.warn('Token inválido para', req.method, req.originalUrl, '| Token:', token);
    return res.status(403).json({ mensagem: 'Não autorizado: Token inválido' });
  }
};

export default authMiddleware;