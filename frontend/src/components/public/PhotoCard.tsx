import { User } from 'lucide-react';

interface PhotoCardProps {
  foto: string;
  nome: string;
  unidade?: string | null;
}

export default function PhotoCard({ foto, nome }: PhotoCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-72 sm:w-64 sm:h-96 rounded-lg overflow-hidden border-2 shadow-2xl bg-white" style={{ borderColor: '#6F63C7' }}>
        {foto ? (
          <img
            src={foto}
            alt={nome}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <User className="w-20 h-20 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
