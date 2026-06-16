import carteiraService from '../services/carteiraService.js';
import logger from '../utils/logger.js';
import { validarPin } from './pinController.js';

class PublicController {
  async buscarCarteira(req, res) {
    try {
      const { codigo_unico } = req.params;
      const { pin } = req.query;
      
      const carteira = await carteiraService.buscarPorCodigo(codigo_unico);
      
      let mostrarStatus = false;
      let motivoNegacao = null;

      if (pin) {
        const validacao = await validarPin(pin);
        if (validacao.valido) {
          mostrarStatus = true;
        } else {
          motivoNegacao = validacao.motivo;
        }
      }

      const resposta = {
        id: carteira.id,
        codigoUnico: carteira.codigoUnico,
        nome: carteira.nome,
        cpf: carteira.cpf,
        cargo: carteira.cargo,
        dataNascimento: carteira.dataNascimento,
        unidadesAdministradas: carteira.unidadesAdministradas,
        fotoUrl: carteira.fotoUrl,
        hashValidacao: carteira.hashValidacao,
        ativo: carteira.ativo,
        criadoEm: carteira.criadoEm,
        atualizadoEm: carteira.atualizadoEm,
      };

      if (mostrarStatus) {
        resposta.situacaoAtual = carteira.situacaoAtual;
        resposta.statusVisivel = true;
      } else {
        resposta.statusVisivel = false;
        if (motivoNegacao) {
          resposta.motivoNegacao = motivoNegacao;
        }
      }
      
      logger.carteira('view', {
        nome: carteira.nome,
        codigo: codigo_unico,
        comPin: !!pin,
        statusVisivel: mostrarStatus,
        ip: req.ip || req.connection.remoteAddress
      });

      return res.json(resposta);
    } catch (error) {
      logger.error(`Carteira não encontrada: ${req.params.codigo_unico}`, error);
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }
  }
}

export default new PublicController();
