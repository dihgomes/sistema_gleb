import { CarteiraPublica, CarteiraDisplay } from '../types/carteira';

function formatDateToBrazilian(dateString: string): string {
  if (!dateString) return '';
  
  if (dateString.includes('/')) return dateString;

  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function transformCarteiraData(apiData: any): CarteiraDisplay {
  return {
    nome: apiData.nome,
    cim: apiData.codigoUnico || apiData.codigo_unico || 'N/A',
    situacao: (apiData.situacaoAtual?.toUpperCase() || apiData.situacao_atual?.toUpperCase() || 'REGULAR') as CarteiraDisplay['situacao'],
    foto: apiData.fotoUrl || apiData.foto_url || '',
    cpf: apiData.cpf || null,
    dataNascimento: apiData.dataNascimento || apiData.data_nascimento ? formatDateToBrazilian(apiData.dataNascimento || apiData.data_nascimento) : null,
    cargo: apiData.cargo || null,
    unidadesAdministradas: apiData.unidadesAdministradas || apiData.unidades_administradas || null,
    validadoEm: apiData.criadoEm || apiData.criado_em || apiData.atualizadoEm || apiData.atualizado_em || apiData.dados_validados_em || '',
    hashValidacao: apiData.hashValidacao || apiData.hash_validacao || ''
  };
}
