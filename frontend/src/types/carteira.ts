export interface DataMaconica {
  titulo: string;
  data: string;
}

export interface Loja {
  loja: string;
  data?: string; // Mantido para compatibilidade com dados antigos
  dataFiliacao?: string;
  desligamento?: string; // Mantido para compatibilidade
  dataDesligamento?: string;
  justificativaDesligamento?: string;
  tipo?: string; // Mantido para compatibilidade
}

export interface CarteiraPublica {
  nome: string;
  loja?: string;
  foto_url: string | null;
  situacao_atual: string;
  datas_maconicas: DataMaconica[];
  lojas: Loja[];
  dados_validados_em: string;
  hash_validacao: string;
  ativo: boolean;
}

export interface CarteiraDisplay {
  nome: string;
  cim: string;
  situacao: 'REGULAR' | 'DESLIGADO';
  foto: string;
  datasMaconicas: Array<{
    grau: string;
    data: string;
    loja: string;
  }>;
  lojas: Array<{
    nome: string;
    filiacao: string;
    desligamento: string | null;
    justificativa?: string;
  }>;
  validadoEm: string;
  hashValidacao: string;
}
