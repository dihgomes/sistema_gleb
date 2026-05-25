const crypto = require('crypto');

/**
 * Gera um código único seguro para a carteira
 * Usa caracteres alfanuméricos para facilitar leitura
 * @returns {string} Código único de 16 caracteres
 */
function generateUniqueCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  const randomBytes = crypto.randomBytes(16);
  
  for (let i = 0; i < 16; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  
  return code;
}

module.exports = { generateUniqueCode };
