import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../database/prisma.js';

const MAX_TENTATIVAS_LOGIN = 5;

class AuthService {
  async login(nome, senha) {
    const admin = await prisma.admin.findFirst({
      where: { nome }
    });

    if (!admin) {
      throw new Error('Credenciais inválidas');
    }

    if (admin.bloqueado) {
      throw new Error('Usuário bloqueado. Entre em contato com um administrador para desbloquear.');
    }

    if (!admin.ativo) {
      throw new Error('Usuário inativo. Entre em contato com um administrador.');
    }
    if (!admin.ativo) {
      throw new Error('Usuário inativo. Entre em contato com um administrador.');
    }

    const senhaValida = await bcrypt.compare(senha, admin.senhaHash);

    if (!senhaValida) {
      const novasTentativas = admin.tentativasLogin + 1;
      
      if (novasTentativas >= MAX_TENTATIVAS_LOGIN) {
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            tentativasLogin: novasTentativas,
            bloqueado: true,
            bloqueadoEm: new Date()
          }
        });
        
        throw new Error(`Usuário bloqueado após ${MAX_TENTATIVAS_LOGIN} tentativas incorretas. Entre em contato com um administrador.`);
      }
      
      await prisma.admin.update({
        where: { id: admin.id },
        data: { tentativasLogin: novasTentativas }
      });
      
      const tentativasRestantes = MAX_TENTATIVAS_LOGIN - novasTentativas;
      throw new Error(`Credenciais inválidas. ${tentativasRestantes} tentativa(s) restante(s).`);
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { tentativasLogin: 0 }
    });

    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email,
        nome: admin.nome,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role,
        primeiroAcesso: admin.primeiroAcesso
      }
    };
  }

  async desbloquearUsuario(userId, adminId) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    if (!admin || admin.role !== 'admin') {
      throw new Error('Apenas administradores podem desbloquear usuários');
    }

    const usuario = await prisma.admin.update({
      where: { id: userId },
      data: {
        bloqueado: false,
        bloqueadoEm: null,
        tentativasLogin: 0
      }
    });

    return usuario;
  }

  async trocarSenha(userId, senhaAtual, novaSenha) {
    const admin = await prisma.admin.findUnique({
      where: { id: userId }
    });

    if (!admin) {
      throw new Error('Apenas administradores podem desbloquear usuários');
    }

    const usuario = await prisma.admin.update({
      where: { id: userId },
      data: {
        bloqueado: false,
        tentativasLogin: 0,
        desbloqueadoEm: new Date(),
        desbloqueadoPorId: adminId
      }
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      bloqueado: usuario.bloqueado
    };
  }

  async trocarSenha(userId, senhaAtual, novaSenha, primeiroAcesso = false) {
    const { validarSenha } = await import('../utils/validation.js');

    const validacao = validarSenha(novaSenha);
    if (!validacao.valid) {
      throw new Error(validacao.error);
    }

    const usuario = await prisma.admin.findUnique({
      where: { id: userId }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    if (!primeiroAcesso) {
      const senhaAtualValida = await bcrypt.compare(senhaAtual, usuario.senhaHash);
      if (!senhaAtualValida) {
        throw new Error('Senha atual incorreta');
      }
    }

    if (usuario.ultimaSenhaHash) {
      const reutilizandoUltima = await bcrypt.compare(novaSenha, usuario.ultimaSenhaHash);
      if (reutilizandoUltima) {
        throw new Error('Não é permitido reutilizar a última senha');
      }
    }

    if (usuario.penultimaSenhaHash) {
      const reutilizandoPenultima = await bcrypt.compare(novaSenha, usuario.penultimaSenhaHash);
      if (reutilizandoPenultima) {
        throw new Error('Não é permitido reutilizar as duas últimas senhas');
      }
    }

    const novoHash = await bcrypt.hash(novaSenha, 10);

    await prisma.admin.update({
      where: { id: userId },
      data: {
        senhaHash: novoHash,
        penultimaSenhaHash: usuario.ultimaSenhaHash,
        ultimaSenhaHash: usuario.senhaHash,
        senhaAlteradaEm: new Date(),
        senhaExpiradaEm: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 dias
        primeiroAcesso: false
      }
    });

    return {
      message: 'Senha alterada com sucesso',
      primeiroAcesso: false
    };
  }
}

export default new AuthService();
