const prisma = require('../database/prisma');
const { generateUniqueCode } = require('../utils/generateCode');
const { generateValidationHash } = require('../utils/generateHash');
const { formatBrazilianDate } = require('../utils/formatDate');
const QRCode = require('qrcode');

/**
 * Service de gerenciamento de carteiras
 */
class CarteiraService {
  /**
   * Cria uma nova carteira
   * @param {Object} data - Dados da carteira
   * @param {string} fotoUrl - URL da foto (opcional)
   * @returns {Object} Carteira criada
   */
  async criar(data, fotoUrl = null) {
    let codigoUnico;
    let exists = true;

    // Garante que o código seja único
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
        loja: data.loja || null,
        fotoUrl,
        situacaoAtual: data.situacaoAtual || null,
        datasMaconicas: data.datasMaconicas || [],
        lojas: data.lojas || [],
        hashValidacao,
        ativo: true
      }
    });

    return carteira;
  }

  /**
   * Lista todas as carteiras
   * @returns {Array} Lista de carteiras
   */
  async listar() {
    return await prisma.carteira.findMany({
      orderBy: { criadoEm: 'desc' }
    });
  }

  /**
   * Busca uma carteira por ID
   * @param {string} id 
   * @returns {Object} Carteira encontrada
   */
  async buscarPorId(id) {
    const carteira = await prisma.carteira.findUnique({
      where: { id }
    });

    if (!carteira) {
      throw new Error('Carteira não encontrada');
    }

    return carteira;
  }

  /**
   * Busca uma carteira por código único (rota pública)
   * @param {string} codigoUnico 
   * @returns {Object} Dados públicos da carteira
   */
  async buscarPorCodigo(codigoUnico) {
    const carteira = await prisma.carteira.findUnique({
      where: { codigoUnico }
    });

    if (!carteira) {
      throw new Error('Carteira não encontrada');
    }

    return {
      nome: carteira.nome,
      loja: carteira.loja || null,
      foto_url: carteira.fotoUrl,
      situacao_atual: carteira.situacaoAtual,
      datas_maconicas: carteira.datasMaconicas || [],
      lojas: carteira.lojas || [],
      dados_validados_em: formatBrazilianDate(carteira.atualizadoEm),
      hash_validacao: carteira.hashValidacao,
      ativo: carteira.ativo
    };
  }

  /**
   * Atualiza uma carteira
   * @param {string} id 
   * @param {Object} data 
   * @param {string} fotoUrl 
   * @returns {Object} Carteira atualizada
   */
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

  /**
   * Atualiza o status (ativo/inativo) de uma carteira
   * @param {string} id 
   * @param {boolean} ativo 
   * @returns {Object} Carteira atualizada
   */
  async atualizarStatus(id, ativo) {
    await this.buscarPorId(id);

    const carteira = await prisma.carteira.update({
      where: { id },
      data: { ativo }
    });

    return carteira;
  }

  /**
   * Exclusão lógica de uma carteira
   * @param {string} id 
   * @returns {Object} Carteira desativada
   */
  async deletar(id) {
    await this.buscarPorId(id);

    const carteira = await prisma.carteira.update({
      where: { id },
      data: { ativo: false }
    });

    return carteira;
  }

  /**
   * Gera URL e QR Code para uma carteira
   * @param {string} id 
   * @returns {Object} URL e QR Code em base64
   */
  async gerarQRCode(id) {
    const carteira = await this.buscarPorId(id);
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${frontendUrl}/q/${carteira.codigoUnico}`;
    
    console.log('\n' + '='.repeat(80));
    console.log('📱 [QRCODE] Gerando QR Code');
    console.log('🔗 URL gerada:', url);
    console.log('📋 Código único:', carteira.codigoUnico);
    console.log('🌍 FRONTEND_URL:', frontendUrl);
    console.log('📏 Tamanho da URL:', url.length, 'caracteres');
    console.log('🔍 URL (bytes):', Buffer.from(url).toString('hex'));
    console.log('='.repeat(80));
    
    const qrCodeBase64 = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2
    });

    console.log('✅ QR Code gerado com sucesso');
    console.log('📊 Tamanho do QR Code:', qrCodeBase64.length, 'caracteres (base64)');
    console.log('='.repeat(80) + '\n');

    return {
      url,
      qrcode: qrCodeBase64,
      codigoUnico: carteira.codigoUnico
    };
  }
}

module.exports = new CarteiraService();
