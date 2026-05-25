const authService = require('../services/authService');

/**
 * Controller de autenticação
 */
class AuthController {
  /**
   * POST /api/auth/login
   * Realiza login do administrador
   */
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const result = await authService.login(email, senha);

      return res.json(result);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
