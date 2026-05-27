export interface MasonData {
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

export const mockMasonData: MasonData = {
  nome: 'JOÃO CARLOS DA SILVA SANTOS',
  cim: '123456',
  situacao: 'REGULAR',
  foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  cpf: '123.456.789-00',
  dataNascimento: '15/03/1985',
  cargo: 'Diretor Administrativo',
  unidadesAdministradas: 'Santa Casa de Ruy Barbosa',
  validadoEm: '23/05/2026 13:57:46',
  hashValidacao: '6ee3c7f94782e53390d2293df9db5d6f',
};
