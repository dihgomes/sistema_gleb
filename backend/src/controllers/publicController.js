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
      
      console.log('='.repeat(60));
      console.log('🔍 [PUBLIC] Requisição de validação de carteira');
      console.log('📋 Código único:', codigo_unico);
      console.log('🌐 Origin:', req.headers.origin);
      console.log('🔗 Referer:', req.headers.referer);
      console.log('📱 User-Agent:', req.headers['user-agent']);
      console.log('='.repeat(60));
      
      const carteira = await carteiraService.buscarPorCodigo(codigo_unico);
      
      console.log('✅ Carteira encontrada:', carteira.nome);
      console.log('📊 Status ativo:', carteira.ativo);
      console.log('='.repeat(60));

      // Retorna a carteira independente do status ativo
      // O frontend exibirá um indicador se estiver inativa
      return res.json(carteira);
    } catch (error) {
      console.log('❌ [PUBLIC] Erro ao buscar carteira');
      console.log('🔴 Código único:', req.params.codigo_unico);
      console.log('🔴 Erro:', error.message);
      console.log('='.repeat(60));
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
  }
}

module.exports = new PublicController();
