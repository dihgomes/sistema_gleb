import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function gerarPIN() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const criarPin = async (req, res) => {
  try {
    const { tipo } = req.body;
    const usuario = req.user;

    if (!tipo || !['temporario', 'permanente'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido. Use "temporario" ou "permanente"' });
    }

    let pin = gerarPIN();
    let tentativas = 0;

    while (tentativas < 10) {
      const pinExistente = await prisma.pinAcesso.findUnique({
        where: { pin },
      });

      if (!pinExistente) break;
      pin = gerarPIN();
      tentativas++;
    }

    if (tentativas >= 10) {
      return res.status(500).json({ error: 'Erro ao gerar PIN único' });
    }

    const expiraEm = tipo === 'temporario' 
      ? new Date(Date.now() + 12 * 60 * 60 * 1000)
      : null;

    const novoPin = await prisma.pinAcesso.create({
      data: {
        pin,
        tipo,
        expiraEm,
        criadoPorId: usuario.id,
        criadoPorNome: usuario.nome,
        criadoPorRole: usuario.role,
      },
    });

    res.status(201).json(novoPin);
  } catch (error) {
    console.error('Erro ao criar PIN:', error);
    res.status(500).json({ error: 'Erro ao criar PIN' });
  }
};

export const listarPins = async (req, res) => {
  try {
    const pins = await prisma.pinAcesso.findMany({
      where: {
        ativo: true,
        revogado: false,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    const pinsComStatus = pins.map(pin => {
      const agora = new Date();
      const expirado = pin.expiraEm && pin.expiraEm < agora;
      
      return {
        ...pin,
        expirado,
        status: expirado ? 'expirado' : 'ativo',
      };
    });

    res.json(pinsComStatus);
  } catch (error) {
    console.error('Erro ao listar PINs:', error);
    res.status(500).json({ error: 'Erro ao listar PINs' });
  }
};

export const revogarPin = async (req, res) => {
  try {
    const { id } = req.params;

    const pin = await prisma.pinAcesso.findUnique({
      where: { id },
    });

    if (!pin) {
      return res.status(404).json({ error: 'PIN não encontrado' });
    }

    if (pin.revogado) {
      return res.status(400).json({ error: 'PIN já foi revogado' });
    }

    const pinAtualizado = await prisma.pinAcesso.update({
      where: { id },
      data: {
        revogado: true,
        revogadoEm: new Date(),
        ativo: false,
      },
    });

    res.json({ message: 'PIN revogado com sucesso', pin: pinAtualizado });
  } catch (error) {
    console.error('Erro ao revogar PIN:', error);
    res.status(500).json({ error: 'Erro ao revogar PIN' });
  }
};

export const validarPin = async (pin) => {
  try {
    const pinAcesso = await prisma.pinAcesso.findUnique({
      where: { pin },
    });

    if (!pinAcesso) {
      return { valido: false, motivo: 'PIN não encontrado' };
    }

    if (pinAcesso.revogado) {
      return { valido: false, motivo: 'PIN foi revogado' };
    }

    if (!pinAcesso.ativo) {
      return { valido: false, motivo: 'PIN inativo' };
    }

    const agora = new Date();
    if (pinAcesso.expiraEm && pinAcesso.expiraEm < agora) {
      await prisma.pinAcesso.update({
        where: { pin },
        data: { ativo: false },
      });
      return { valido: false, motivo: 'PIN expirado' };
    }

    await prisma.pinAcesso.update({
      where: { pin },
      data: {
        ultimoUso: new Date(),
        totalUsos: { increment: 1 },
      },
    });

    return { valido: true, pin: pinAcesso };
  } catch (error) {
    console.error('Erro ao validar PIN:', error);
    return { valido: false, motivo: 'Erro ao validar PIN' };
  }
};
