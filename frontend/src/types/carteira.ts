export interface CarteiraPublica {
  nome: string;
  codigo_unico: string;
  foto_url: string | null;
  situacao_atual: string;
  cpf?: string | null;
  data_nascimento?: string | null;
  cargo?: string | null;
  unidades_administradas?: string | null;
  dados_validados_em: string;
  hash_validacao: string;
  ativo: boolean;
}

export interface CarteiraDisplay {
  nome: string;
  cim: string;
  situacao: 'REGULAR' | 'DESLIGADO';
  foto: string;
  cpf?: string | null;
  dataNascimento?: string | null;
  cargo?: string | null;
  unidadesAdministradas?: string | null;
  validadoEm: string;
  hashValidacao: string;
}
