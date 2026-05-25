const crypto = require('crypto');

/**
 * Gera um hash MD5 baseado nos dados da carteira
 * Usado para validação de integridade dos dados
 * @param {Object} data - Dados da carteira
 * @returns {string} Hash MD5
 */
function generateValidationHash(data) {
  const { nome, situacaoAtual, datasMaconicas, lojas } = data;
  
  const content = JSON.stringify({
    nome,
    situacaoAtual,
    datasMaconicas,
    lojas
  });
  
  return crypto.createHash('md5').update(content).digest('hex');
}

module.exports = { generateValidationHash };
