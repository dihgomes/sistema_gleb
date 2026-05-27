import prisma from '../database/prisma.js';
import { generateUniqueCode } from '../utils/generateCode.js';
import { generateValidationHash } from '../utils/generateHash.js';
import { formatBrazilianDate } from '../utils/formatDate.js';
import QRCode from 'qrcode';

class CarteiraService {
  async criar(data, fotoUrl = null, adminId = null) {
    let codigoUnico;
    let exists = true;

    while (exists) {
      codigoUnico = generateUniqueCode();
      const carteira = await prisma.carteira.findUnique({
        where: { codigoUnico }
      });
      exists = !!carteira;
    }

    const hashValidacao = generateValidationHash({
      nome: data.nome,
      situacaoAtual: data.situacaoAtual,
      datasMaconicas: data.datasMaconicas,
      lojas: data.lojas
    });

    const carteira = await prisma.carteira.create({
      data: {
        codigoUnico,
        nome: data.nome,
        cpf: data.cpf || null,
        cargo: data.cargo || null,
        dataNascimento: data.dataNascimento || null,
        unidadesAdministradas: data.unidadesAdministradas || null,
        fotoUrl,
        situacaoAtual: data.situacaoAtual || null,
        hashValidacao,
        ativo: true,
        criadoPorId: adminId
      }
    });

    return carteira;
  }

  async listar() {
    return await prisma.carteira.findMany({
      include: {
        criadoPor: {
          select: {
            nome: true,
            email: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });
  }

  async buscarPorId(id) {
    const carteira = await prisma.carteira.findUnique({
      where: { id }
    });

    if (!carteira) {
      throw new Error('Carteira não encontrada');
    }

    return carteira;
  }
  
  async criar(data, fotoUrl = null, adminId = null) {
    let codigoUnico;
    let exists = true;

    while (exists) {
      codigoUnico = generateUniqueCode();
      const carteira = await prisma.carteira.findUnique({
        where: { codigoUnico }
      });
      exists = !!carteira;
    }

    const hashValidacao = generateValidationHash({
      nome: data.nome,
      situacaoAtual: data.situacaoAtual,
      datasMaconicas: data.datasMaconicas,
      lojas: data.lojas
    });

    const carteira = await prisma.carteira.create({
      data: {
        codigoUnico,
        nome: data.nome,
        cpf: data.cpf || null,
        cargo: data.cargo || null,
        dataNascimento: data.dataNascimento || null,
        unidadesAdministradas: data.unidadesAdministradas || null,
        fotoUrl,
        situacaoAtual: data.situacaoAtual || null,
        hashValidacao,
        ativo: true,
        criadoPorId: adminId
      }
    });

    return carteira;
  }

  async listar() {
    return await prisma.carteira.findMany({
      include: {
        criadoPor: {
          select: {
            nome: true,
            email: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });
  }

  async buscarPorId(id) {
    const carteira = await prisma.carteira.findUnique({
      where: { id }
    });

    if (!carteira) {
      throw new Error('Carteira não encontrada');
    }

    return carteira;
  }

  async buscarPorCodigo(codigoUnico) {
    const carteira = await prisma.carteira.findUnique({
      where: { codigoUnico }
    });

    if (!carteira) {
      throw new Error('Carteira não encontrada');
    }

    return {
      nome: carteira.nome,
      codigo_unico: carteira.codigoUnico,
      foto_url: carteira.fotoUrl,
      situacao_atual: carteira.situacaoAtual,
      cpf: carteira.cpf || null,
      data_nascimento: carteira.dataNascimento || null,
      cargo: carteira.cargo || null,
      unidades_administradas: carteira.unidadesAdministradas || null,
      dados_validados_em: formatBrazilianDate(carteira.atualizadoEm),
      hash_validacao: carteira.hashValidacao,
      ativo: carteira.ativo
    };
  }

  async atualizar(id, data, fotoUrl = null) {
    const carteiraExistente = await this.buscarPorId(id);

    const hashValidacao = generateValidationHash({
      nome: data.nome || carteiraExistente.nome,
      situacaoAtual: data.situacaoAtual !== undefined ? data.situacaoAtual : carteiraExistente.situacaoAtual,
      datasMaconicas: data.datasMaconicas !== undefined ? data.datasMaconicas : carteiraExistente.datasMaconicas,
      lojas: data.lojas !== undefined ? data.lojas : carteiraExistente.lojas
    });

    const updateData = {
      nome: data.nome,
      cpf: data.cpf,
      cargo: data.cargo,
      dataNascimento: data.dataNascimento,
      unidadesAdministradas: data.unidadesAdministradas,
      loja: data.loja,
      situacaoAtual: data.situacaoAtual,
      datasMaconicas: data.datasMaconicas,
      lojas: data.lojas,
      hashValidacao
    };

    if (fotoUrl) {
      updateData.fotoUrl = fotoUrl;
    }

    const carteira = await prisma.carteira.update({
      where: { id },
      data: updateData
    });

    return carteira;
  }

  async atualizarStatus(id, ativo) {
    await this.buscarPorId(id);

    const carteira = await prisma.carteira.update({
      where: { id },
      data: { ativo }
    });

    return carteira;
  }
  async atualizarStatus(id, ativo) {
    await this.buscarPorId(id);

    const carteira = await prisma.carteira.update({
      where: { id },
      data: { ativo }
    });

    return carteira;
  }

  async deletar(id) {
    await this.buscarPorId(id);

    const carteira = await prisma.carteira.update({
      where: { id },
      data: { ativo: false }
    });

    return carteira;
  }

  async gerarQRCode(id) {
    const carteira = await this.buscarPorId(id);
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${frontendUrl}/q/${carteira.codigoUnico}`;
    
    const qrCodeBase64 = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 1,
      width: 400,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return {
      url,
      qrcode: qrCodeBase64,
      codigoUnico: carteira.codigoUnico
    };
  }
}

export default new CarteiraService();
