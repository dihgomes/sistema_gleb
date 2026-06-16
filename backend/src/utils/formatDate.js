function formatBrazilianDate(date = new Date()) {
  // Converte para horário de Brasília (UTC-3)
  const brasiliaOffset = -3 * 60; // -3 horas em minutos
  const localOffset = date.getTimezoneOffset(); // offset UTC em minutos
  const diffMinutes = brasiliaOffset - localOffset;
  
  const brasiliaDate = new Date(date.getTime() + diffMinutes * 60 * 1000);
  
  const day = String(brasiliaDate.getDate()).padStart(2, '0');
  const month = String(brasiliaDate.getMonth() + 1).padStart(2, '0');
  const year = brasiliaDate.getFullYear();
  const hours = String(brasiliaDate.getHours()).padStart(2, '0');
  const minutes = String(brasiliaDate.getMinutes()).padStart(2, '0');
  const seconds = String(brasiliaDate.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export { formatBrazilianDate };
