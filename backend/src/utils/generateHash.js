import crypto from 'crypto';

function generateValidationHash(data) {
  const { nome, situacaoAtual, datasMaconicas, lojas } = data;
  
  const content = JSON.stringify({
    nome,
    situacaoAtual,
    datasMaconicas,
    lojas
  });
  
  return crypto.createHash('sha256').update(content).digest('hex');
}

export { generateValidationHash };
