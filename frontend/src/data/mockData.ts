export interface DataMaconica {
  grau: string;
  data: string;
  loja: string;
}

export interface Loja {
  nome: string;
  filiacao: string;
  desligamento: string | null;
  justificativa?: string;
}

export interface MasonData {
  nome: string;
  cim: string;
  situacao: 'REGULAR' | 'DESLIGADO';
  foto: string;
  datasMaconicas: DataMaconica[];
  lojas: Loja[];
  validadoEm: string;
  hashValidacao: string;
}

export const mockMasonData: MasonData = {
  nome: 'JOÃO CARLOS DA SILVA SANTOS',
  cim: '123456',
  situacao: 'REGULAR',
  foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  datasMaconicas: [
    {
      grau: 'Aprendiz',
      data: '19/10/2024',
      loja: 'DEUS, PAZ E PROGRESSO Nº 30',
    },
    {
      grau: 'Companheiro',
      data: '03/06/2025',
      loja: 'DEUS, PAZ E PROGRESSO Nº 30',
    },
  ],
  lojas: [
    {
      nome: 'DEUS, PAZ E PROGRESSO Nº 30',
      filiacao: '19/10/2024',
      desligamento: null,
    },
  ],
  validadoEm: '23/05/2026 13:57:46',
  hashValidacao: '6ee3c7f94782e53390d2293df9db5d6f',
};
