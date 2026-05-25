import { CheckCircle, XCircle } from 'lucide-react';
import type { MasonData } from '../../data/mockData';

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="bg-blue-800 px-4 py-2 rounded-t-md">
      <h3 className="text-white text-xs font-bold tracking-widest uppercase">{title}</h3>
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
    <div className={`flex items-center gap-3 px-4 py-3 ${cfg.bg} border ${cfg.border} rounded-b-md`}>
      <Icon className={`w-7 h-7 flex-shrink-0 ${cfg.iconColor}`} />
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Status</p>
        <p className={`text-xl font-extrabold tracking-widest ${cfg.text}`}>{cfg.label}</p>
      </div>
      <span className={`ml-auto w-3 h-3 rounded-full ${cfg.dot} shadow`} />
    </div>
  );
}

interface DatasMaconicasProps {
  datas: MasonData['datasMaconicas'];
}

function DatasMaconicasBlock({ datas }: DatasMaconicasProps) {
  return (
    <div className="border border-gray-200 rounded-b-md divide-y divide-gray-100">
      {datas.map((d, i) => (
        <div key={i} className="px-4 py-3 bg-white hover:bg-blue-50/40 transition-colors">
          <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest mb-0.5">{d.grau}</p>
          <p className="text-sm text-gray-800 font-semibold uppercase">
            {d.data}
            <span className="mx-1.5 text-gray-400">—</span>
            <span className="font-normal text-gray-700">{d.loja}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

interface LojasProps {
  lojas: MasonData['lojas'];
}

function LojasBlock({ lojas }: LojasProps) {
  return (
    <div className="border border-gray-200 rounded-b-md divide-y divide-gray-100">
      {lojas.map((l, i) => (
        <div key={i} className="px-4 py-3 bg-white hover:bg-blue-50/40 transition-colors">
          <p className="text-sm font-semibold text-gray-800 mb-1 uppercase">{l.nome}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <span className="text-xs text-gray-500">
              <span className="font-medium text-blue-800">Filiação:</span> {l.filiacao}
            </span>
            <span className="text-xs text-gray-500">
              <span className="font-medium text-blue-800">Desligamento:</span>{' '}
              {l.desligamento ?? '--'}
            </span>
          </div>
          {l.justificativa && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 uppercase">
                <span className="font-medium text-blue-800">Justificativa:</span>{' '}
                {l.justificativa}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface InfoSectionProps {
  data: MasonData;
}

export default function InfoSection({ data }: InfoSectionProps) {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="text-center border-b border-blue-100 pb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-blue-900 leading-tight tracking-wide uppercase">
          {data.nome}
        </h2>
      </div>

      <div>
        <SectionHeader title="Situação Atual" />
        <SituacaoCard situacao={data.situacao} />
      </div>

      <div>
        <SectionHeader title="Datas Maçônicas" />
        <DatasMaconicasBlock datas={data.datasMaconicas} />
      </div>

      <div>
        <SectionHeader title="Lojas" />
        <LojasBlock lojas={data.lojas} />
      </div>
    </div>
  );
}
