import carteiraService from '../services/carteiraService.js';
import logger from '../utils/logger.js';

class PublicController {
  async buscarCarteira(req, res) {
    try {
      const { codigo_unico } = req.params;
      
      const carteira = await carteiraService.buscarPorCodigo(codigo_unico);
      
      logger.carteira('view', {
        nome: carteira.nome,
        codigo: codigo_unico,
        ip: req.ip || req.connection.remoteAddress
      });

      return res.json(carteira);
    } catch (error) {
      logger.error(`Carteira não encontrada: ${req.params.codigo_unico}`, error);
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
  }
}

export default new PublicController();
