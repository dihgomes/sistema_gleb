import prisma from '../database/prisma.js';

class LogService {
  async registrar(data) {
    const {
      tipo,
      entidade = null,
      entidadeId = null,
      usuario = null,
      acao,
      detalhes = null,
      req = null,
      sucesso = true,
      erro = null
    } = data;

    const ip = req ? (req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress) : null;
    const userAgent = req ? req.headers['user-agent'] : null;

    const usuarioId = usuario?.id || null;
    const usuarioNome = usuario?.nome || null;
    const usuarioEmail = usuario?.email || null;
    const usuarioRole = usuario?.role || null;

    const log = await prisma.log.create({
      data: {
        tipo,
        entidade,
        entidadeId,
        usuarioId,
        usuarioNome,
        usuarioEmail,
        usuarioRole,
        acao,
        detalhes,
        ip,
        userAgent,
        sucesso,
        erro
      }
    });

    return log;
  }

  async registrarLogin(usuario, req) {
    return this.registrar({
      tipo: 'login',
      entidade: 'admin',
      entidadeId: usuario.id,
      usuario,
      acao: `Login realizado por ${usuario.nome}`,
      req,
      sucesso: true
    });
  }

  async registrarLoginFalho(nome, erro, req) {
    return this.registrar({
      tipo: 'login_falho',
      entidade: 'admin',
      usuario: { nome },
      acao: `Tentativa de login falhada para usuário: ${nome}`,
      req,
      sucesso: false,
      erro
    });
  }

  async registrarLogout(usuario, req) {
    return this.registrar({
      tipo: 'logout',
      entidade: 'admin',
      entidadeId: usuario.id,
      usuario,
      acao: `Logout realizado por ${usuario.nome}`,
      req,
      sucesso: true
    });
  }

  async registrarCriacaoCarteira(carteira, usuario, req) {
    return this.registrar({
      tipo: 'create',
      entidade: 'carteira',
      entidadeId: carteira.id,
      usuario,
      acao: `Carteira "${carteira.nome}" criada`,
      detalhes: {
        codigoUnico: carteira.codigoUnico,
        nome: carteira.nome,
        cpf: carteira.cpf,
        cargo: carteira.cargo
      },
      req,
      sucesso: true
    });
  }

  async registrarAtualizacaoCarteira(carteira, usuario, req) {
    return this.registrar({
      tipo: 'update',
      entidade: 'carteira',
      entidadeId: carteira.id,
      usuario,
      acao: `Carteira "${carteira.nome}" atualizada`,
      detalhes: {
        codigoUnico: carteira.codigoUnico,
        nome: carteira.nome
      },
      req,
      sucesso: true
    });
  }

  async registrarExclusaoCarteira(carteira, usuario, req) {
    return this.registrar({
      tipo: 'delete',
      entidade: 'carteira',
      entidadeId: carteira.id,
      usuario,
      acao: `Carteira "${carteira.nome}" desativada`,
      detalhes: {
        codigoUnico: carteira.codigoUnico,
        nome: carteira.nome
      },
      req,
      sucesso: true
    });
  }

  async registrarGeracaoQRCode(carteira, usuario, req) {
    return this.registrar({
      tipo: 'qrcode',
      entidade: 'carteira',
      entidadeId: carteira.id,
      usuario,
      acao: `QR Code gerado para carteira "${carteira.nome}"`,
      detalhes: {
        codigoUnico: carteira.codigoUnico,
        nome: carteira.nome
      },
      req,
      sucesso: true
    });
  }

  async registrarBloqueioUsuario(usuarioBloqueado, motivo, req) {
    return this.registrar({
      tipo: 'block',
      entidade: 'admin',
      entidadeId: usuarioBloqueado.id,
      usuario: usuarioBloqueado,
      acao: `Usuário "${usuarioBloqueado.nome}" bloqueado`,
      detalhes: {
        motivo,
        email: usuarioBloqueado.email
      },
      req,
      sucesso: true
    });
  }

  async registrarDesbloqueioUsuario(usuarioDesbloqueado, adminQueDesbloqueou, req) {
    return this.registrar({
      tipo: 'unblock',
      entidade: 'admin',
      entidadeId: usuarioDesbloqueado.id,
      usuario: adminQueDesbloqueou,
      acao: `Usuário "${usuarioDesbloqueado.nome}" desbloqueado por ${adminQueDesbloqueou.nome}`,
      detalhes: {
        usuarioDesbloqueado: {
          id: usuarioDesbloqueado.id,
          nome: usuarioDesbloqueado.nome,
          email: usuarioDesbloqueado.email
        }
      },
      req,
      sucesso: true
    });
  }

  async buscar(filtros = {}) {
    const {
      tipo,
      entidade,
      usuarioId,
      dataInicio,
      dataFim,
      sucesso,
      limit = 100,
      offset = 0
    } = filtros;

    const where = {};

    if (tipo) where.tipo = tipo;
    if (entidade) where.entidade = entidade;
    if (usuarioId) where.usuarioId = usuarioId;
    if (sucesso !== undefined) where.sucesso = sucesso;
    
    if (dataInicio || dataFim) {
      where.criadoEm = {};
      if (dataInicio) where.criadoEm.gte = new Date(dataInicio);
      if (dataFim) where.criadoEm.lte = new Date(dataFim);
    }

    const logs = await prisma.log.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await prisma.log.count({ where });

    return {
      logs,
      total,
      limit,
      offset
    };
  }

  async buscarPorUsuario(usuarioId, limit = 50) {
    return this.buscar({ usuarioId, limit });
  }

  async buscarLogins(limit = 50) {
    return this.buscar({ tipo: 'login', limit });
  }

  async buscarLoginsFalhos(limit = 50) {
    return this.buscar({ tipo: 'login_falho', limit });
  }

  async buscarPorCarteira(carteiraId, limit = 50) {
    return this.buscar({ entidade: 'carteira', entidadeId: carteiraId, limit });
  }
}

export default new LogService();
