const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../database/prisma');

/**
 * Service de autenticação
 */
class AuthService {
  /**
   * Realiza login do administrador
   * @param {string} email 
   * @param {string} senha 
   * @returns {Object} Token JWT e dados do admin
   */
  async login(email, senha) {
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, admin.senhaHash);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email
      }
    };
  }
}

module.exports = new AuthService();
