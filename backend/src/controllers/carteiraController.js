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

  async criarEmLote(req, res) {
    try {
      let carteiras;
      
      // Se vier como FormData, parse o JSON
      if (typeof req.body.carteiras === 'string') {
        carteiras = JSON.parse(req.body.carteiras);
      } else {
        carteiras = req.body.carteiras;
      }

      if (!carteiras || !Array.isArray(carteiras) || carteiras.length === 0) {
        return res.status(400).json({ error: 'Array de carteiras é obrigatório' });
      }

      const adminId = req.user?.id || null;
      const resultados = [];
      const erros = [];

      const apiUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5001}`;

      for (let i = 0; i < carteiras.length; i++) {
        try {
          const carteiraData = carteiras[i];
          
          if (!carteiraData.nome) {
            erros.push({ indice: i, erro: 'Nome é obrigatório' });
            continue;
          }

          let fotoUrl = null;
          
          // Verificar se há foto no array de arquivos (se estiver usando FormData)
          if (req.files && req.files[i]) {
            fotoUrl = `${apiUrl}/uploads/${req.files[i].filename}`;
          }

          const data = {
            nome: carteiraData.nome,
            cpf: carteiraData.cpf || null,
            cargo: carteiraData.cargo || null,
            dataNascimento: carteiraData.dataNascimento || null,
            unidadesAdministradas: carteiraData.unidadesAdministradas || null,
            loja: carteiraData.loja || null,
            situacaoAtual: carteiraData.situacaoAtual || 'REGULAR',
            datasMaconicas: carteiraData.datasMaconicas || [],
            lojas: carteiraData.lojas || []
          };

          const carteira = await carteiraService.criar(data, fotoUrl, adminId);
          resultados.push(carteira);
          
          logger.carteira('create', {
            nome: carteira.nome,
            codigo: carteira.codigoUnico,
            admin: req.user?.nome || 'Sistema'
          });
        } catch (error) {
          erros.push({ indice: i, erro: error.message });
        }
      }

      return res.status(201).json({
        criadas: resultados,
        erros,
        total: carteiras.length,
        sucesso: resultados.length,
        falhas: erros.length
      });
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
