import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.admin.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

export const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const usuarioExistente = await prisma.admin.findUnique({
      where: { nome },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const emailExistente = await prisma.admin.findUnique({
      where: { email },
    });

    if (emailExistente) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    if (!/[A-Z]/.test(senha)) {
      return res.status(400).json({ error: 'Senha deve conter pelo menos uma letra maiúscula' });
    }

    if (!/[a-z]/.test(senha)) {
      return res.status(400).json({ error: 'Senha deve conter pelo menos uma letra minúscula' });
    }

    if (!/\d/.test(senha)) {
      return res.status(400).json({ error: 'Senha deve conter pelo menos um número' });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
      return res.status(400).json({ error: 'Senha deve conter pelo menos um caractere especial' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.admin.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role: role || 'user',
        ativo: true,
        primeiroAcesso: true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

export const deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.admin.findUnique({
      where: { id },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (usuario.id === req.user.id) {
      return res.status(400).json({ error: 'Você não pode excluir sua própria conta' });
    }

    await prisma.admin.delete({
      where: { id },
    });

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
};
