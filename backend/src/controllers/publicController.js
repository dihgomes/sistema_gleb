const carteiraService = require('../services/carteiraService');
const logger = require('../utils/logger');

/**
 * Controller de rotas públicas
 */
class PublicController {
  /**
   * GET /api/public/carteira/:codigo_unico
   * Retorna dados públicos de uma carteira
   */
  async buscarCarteira(req, res) {
    try {
      const { codigo_unico } = req.params;
      
      const carteira = await carteiraService.buscarPorCodigo(codigo_unico);
      
      logger.carteira('view', {
        nome: carteira.nome,
        codigo: codigo_unico,
        ip: req.ip || req.connection.remoteAddress
      });

      // Retorna a carteira independente do status ativo
      // O frontend exibirá um indicador se estiver inativa
      return res.json(carteira);
    } catch (error) {
      logger.error(`Carteira não encontrada: ${req.params.codigo_unico}`, error);
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
  }
}

module.exports = new PublicController();
