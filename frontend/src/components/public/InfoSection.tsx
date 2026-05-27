import { CheckCircle, XCircle } from 'lucide-react';
import type { MasonData } from '../../data/mockData';

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="px-5 py-3 rounded-t-md shadow-sm" style={{ backgroundColor: '#6F63C7' }}>
      <h3 className="text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2">
        <span className="w-1 h-4 bg-yellow-400 rounded-full"></span>
        {title}
      </h3>
    </div>
  );
}

interface SituacaoProps {
  situacao: MasonData['situacao'];
}

const situacaoConfig = {
  REGULAR: {
    label: 'REGULAR',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    dot: 'bg-green-500',
  },
  DESLIGADO: {
    label: 'DESLIGADO',
    bg: 'bg-red-100',
    text: 'text-red-900',
    border: 'border-red-300',
    icon: XCircle,
    iconColor: 'text-red-700',
    dot: 'bg-red-700',
  },
};

function SituacaoCard({ situacao }: SituacaoProps) {
  const cfg = situacaoConfig[situacao];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-center gap-4 px-5 py-4 ${cfg.bg} border ${cfg.border} rounded-b-md shadow-sm`}>
      <Icon className={`w-8 h-8 flex-shrink-0 ${cfg.iconColor}`} />
      <div className="flex-1">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Status</p>
        <p className={`text-2xl font-extrabold tracking-wide ${cfg.text}`}>{cfg.label}</p>
      </div>
      <span className={`w-4 h-4 rounded-full ${cfg.dot} shadow-md animate-pulse`} />
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="px-5 py-4 bg-white border-b border-gray-100 last:border-b-0 hover:bg-purple-50/30 transition-colors">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6F63C7' }}>{label}</p>
      <p className="text-base text-gray-900 font-semibold">
        {value || <span className="text-gray-400 font-normal italic">Não informado</span>}
      </p>
    </div>
  );
}

function DadosPessoaisBlock({ data }: { data: MasonData }) {
  return (
    <div className="border border-gray-200 rounded-b-md overflow-hidden">
      <InfoItem label="CPF" value={data.cpf} />
      <InfoItem label="Data de Nascimento" value={data.dataNascimento} />
      <InfoItem label="Cargo/Função" value={data.cargo} />
      <InfoItem label="Unidades Administradas" value={data.unidadesAdministradas} />
    </div>
  );
}

interface InfoSectionProps {
  data: MasonData;
}

export default function InfoSection({ data }: InfoSectionProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center border-b-2 pb-5" style={{ borderColor: '#6F63C7' }}>
        <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight uppercase" style={{ color: '#6F63C7' }}>
          {data.nome}
        </h2>
      </div>

      <div>
        <SectionHeader title="Situação Atual" />
        <SituacaoCard situacao={data.situacao} />
      </div>

      <div>
        <SectionHeader title="Dados Pessoais" />
        <DadosPessoaisBlock data={data} />
      </div>
    </div>
  );
}
