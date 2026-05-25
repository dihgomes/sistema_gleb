/**
 * Formata data no padrão brasileiro DD/MM/YYYY HH:mm:ss
 * @param {Date} date - Data a ser formatada
 * @returns {string} Data formatada
 */
function formatBrazilianDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

module.exports = { formatBrazilianDate };
