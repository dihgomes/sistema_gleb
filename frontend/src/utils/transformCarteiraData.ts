import { CarteiraPublica, CarteiraDisplay } from '../types/carteira';

function formatDateToBrazilian(dateString: string): string {
  if (!dateString) return '';
  
  if (dateString.includes('/')) return dateString;

  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function transformCarteiraData(apiData: CarteiraPublica): CarteiraDisplay {
  return {
    nome: apiData.nome,
    cim: 'N/A',
    situacao: (apiData.situacao_atual?.toUpperCase() || 'REGULAR') as CarteiraDisplay['situacao'],
    foto: apiData.foto_url || '',
    datasMaconicas: apiData.datas_maconicas.map(dm => ({
      grau: dm.titulo,
      data: formatDateToBrazilian(dm.data),
      loja: apiData.loja || ''
    })),
    lojas: apiData.lojas.map(l => ({
      nome: apiData.loja || l.loja || '',
      filiacao: formatDateToBrazilian(l.dataFiliacao || l.data || ''),
      desligamento: l.dataDesligamento ? formatDateToBrazilian(l.dataDesligamento) : (l.desligamento === '--' ? null : l.desligamento) || null,
      justificativa: l.justificativaDesligamento
    })),
    validadoEm: apiData.dados_validados_em,
    hashValidacao: apiData.hash_validacao
  };
}
