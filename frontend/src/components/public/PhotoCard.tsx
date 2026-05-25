import { User } from 'lucide-react';

interface PhotoCardProps {
  foto: string;
  nome: string;
}

export default function PhotoCard({ foto, nome }: PhotoCardProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Moldura da foto - formato 3x4 ampliado */}
      <div className="relative w-48 h-72 sm:w-64 sm:h-96 rounded-sm overflow-hidden border border-gray-300 shadow-lg bg-white">
        {foto ? (
          <img
            src={foto}
            alt={nome}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <User className="w-20 h-20 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
