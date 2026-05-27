import authService from '../services/authService.js';
import logger from '../utils/logger.js';

class AuthController {

  async login(req, res) {
    try {
      const { nome, senha } = req.body;

      if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios' });
      }

      const result = await authService.login(nome, senha);
      
      logger.auth('login', result.admin.nome, true);

      return res.json(result);
    } catch (error) {
      logger.auth('login', req.body.nome, false);
      return res.status(401).json({ error: error.message });
    }
  }

  async trocarSenha(req, res) {
    try {
      const { senhaAtual, novaSenha, primeiroAcesso } = req.body;
      const userId = req.user.id;

      if (!novaSenha) {
        return res.status(400).json({ error: 'Nova senha é obrigatória' });
      }

      if (!primeiroAcesso && !senhaAtual) {
        return res.status(400).json({ error: 'Senha atual é obrigatória' });
      }

      const result = await authService.trocarSenha(userId, senhaAtual, novaSenha, primeiroAcesso);

      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
