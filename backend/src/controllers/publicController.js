const carteiraService = require('../services/carteiraService');

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

      // Retorna a carteira independente do status ativo
      // O frontend exibirá um indicador se estiver inativa
      return res.json(carteira);
    } catch (error) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
  }
}

module.exports = new PublicController();
