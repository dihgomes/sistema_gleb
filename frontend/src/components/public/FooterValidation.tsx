import { ShieldCheck } from 'lucide-react';

interface FooterValidationProps {
  validadoEm: string;
  hash: string;
}

function formatarDataHora(dataString: string): string {
  if (!dataString) return 'Data não disponível';
  
  // Se já está no formato brasileiro (DD/MM/YYYY), retorna como está
  if (dataString.includes('/')) {
    return dataString;
  }
  
  try {
    const data = new Date(dataString);
    
    // Verifica se a data é válida
    if (isNaN(data.getTime())) {
      return dataString;
    }
    
    // Converte para horário de Brasília (UTC-3)
    const offsetBrasilia = -3 * 60; // -3 horas em minutos
    const offsetLocal = data.getTimezoneOffset(); // offset do navegador em minutos
    const diffMinutos = offsetBrasilia - offsetLocal;
    
    const dataBrasilia = new Date(data.getTime() + diffMinutos * 60 * 1000);
    
    const dia = String(dataBrasilia.getDate()).padStart(2, '0');
    const mes = String(dataBrasilia.getMonth() + 1).padStart(2, '0');
    const ano = dataBrasilia.getFullYear();
    const horas = String(dataBrasilia.getHours()).padStart(2, '0');
    const minutos = String(dataBrasilia.getMinutes()).padStart(2, '0');
    
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  } catch {
    return dataString;
  }
}

export default function FooterValidation({ validadoEm, hash }: FooterValidationProps) {
  return (
    <footer className="mt-8 border-t border-blue-100 pt-6 pb-8 px-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-blue-700" />
        <p className="text-xs text-gray-600 tracking-wide">
          Dados validados em{' '}
          <span className="font-semibold text-blue-900">{formatarDataHora(validadoEm)}</span>
        </p>
        <div className="mt-1 px-4 py-1.5 bg-gray-100 border border-gray-200 rounded-md inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="font-mono text-[11px] text-gray-500 tracking-widest select-all break-all">
            {hash}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 tracking-widest uppercase">
          scrb.org.br — Grande Loja Maçônica do Estado da Bahia
        </p>
      </div>
    </footer>
  );
}
