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
    cim: apiData.codigo_unico || 'N/A',
    situacao: (apiData.situacao_atual?.toUpperCase() || 'REGULAR') as CarteiraDisplay['situacao'],
    foto: apiData.foto_url || '',
    cpf: apiData.cpf || null,
    dataNascimento: apiData.data_nascimento ? formatDateToBrazilian(apiData.data_nascimento) : null,
    cargo: apiData.cargo || null,
    unidadesAdministradas: apiData.unidades_administradas || null,
    validadoEm: apiData.dados_validados_em,
    hashValidacao: apiData.hash_validacao
  };
}
