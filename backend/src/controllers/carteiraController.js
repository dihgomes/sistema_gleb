import carteiraService from '../services/carteiraService.js';
import logger from '../utils/logger.js';
import path from 'path';

class CarteiraController {
  async criar(req, res) {
    try {
      const { nome, cpf, cargo, dataNascimento, unidadesAdministradas, loja, situacaoAtual, datasMaconicas, lojas } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      let fotoUrl = null;
      if (req.file) {
        const apiUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5001}`;
        fotoUrl = `${apiUrl}/uploads/${req.file.filename}`;
      }

      const data = {
        nome,
        cpf,
        cargo,
        dataNascimento,
        unidadesAdministradas,
        loja,
        situacaoAtual,
        datasMaconicas: datasMaconicas ? JSON.parse(datasMaconicas) : [],
        lojas: lojas ? JSON.parse(lojas) : []
      };

      const adminId = req.user?.id || null;
      const carteira = await carteiraService.criar(data, fotoUrl, adminId);
      
      logger.carteira('create', {
        nome: carteira.nome,
        codigo: carteira.codigoUnico,
        admin: req.user?.nome || 'Sistema'
      });

      return res.status(201).json(carteira);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listar(req, res) {
    try {
      const carteiras = await carteiraService.listar();
      return res.json(carteiras);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const carteira = await carteiraService.buscarPorId(id);
      return res.json(carteira);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, cpf, cargo, dataNascimento, unidadesAdministradas, loja, situacaoAtual, datasMaconicas, lojas } = req.body;

      let fotoUrl = null;
      if (req.file) {
        const apiUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5001}`;
        fotoUrl = `${apiUrl}/uploads/${req.file.filename}`;
      }

      const data = {
        nome,
        cpf,
        cargo,
        dataNascimento,
        unidadesAdministradas,
        loja,
        situacaoAtual,
        datasMaconicas: datasMaconicas ? JSON.parse(datasMaconicas) : undefined,
        lojas: lojas ? JSON.parse(lojas) : undefined
      };

      const carteira = await carteiraService.atualizar(id, data, fotoUrl);
      
      logger.carteira('update', {
        nome: carteira.nome,
        codigo: carteira.codigoUnico,
        loja: carteira.loja,
        admin: req.user?.nome || 'Sistema'
      });

      return res.json(carteira);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      if (typeof ativo !== 'boolean') {
        return res.status(400).json({ error: 'Status ativo deve ser true ou false' });
      }

      const carteira = await carteiraService.atualizarStatus(id, ativo);

      return res.json(carteira);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const carteira = await carteiraService.deletar(id);
      
      logger.carteira('delete', {
        nome: carteira.nome,
        codigo: carteira.codigoUnico,
        admin: req.user?.nome || 'Sistema'
      });
      
      return res.json({ message: 'Carteira desativada com sucesso', carteira });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async gerarQRCode(req, res) {
    try {
      const { id } = req.params;
      const result = await carteiraService.gerarQRCode(id);
      
      logger.carteira('qrcode', {
        nome: result.nome,
        codigo: result.codigoUnico,
        admin: req.user?.nome || 'Sistema'
      });
      
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new CarteiraController();
