import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, QrCode, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { API_ENDPOINTS } from '../../config/api';
import { getToken } from '../../utils/auth';

interface Carteira {
  id: string;
  codigoUnico: string;
  nome: string;
  fotoUrl: string | null;
  situacaoAtual: string | null;
  ativo: boolean;
  criadoEm: string;
}

export default function CarteirasListPage() {
  const navigate = useNavigate();
  const [carteiras, setCarteiras] = useState<Carteira[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCarteiras();
  }, []);

  const loadCarteiras = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CARTEIRAS, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCarteiras(data);
      } else {
        alert('Erro ao carregar carteiras');
      }
    } catch (error) {
      console.error('Erro ao carregar carteiras:', error);
      alert('Erro ao carregar carteiras');
    } finally {
      setLoading(false);
    }
  };


  const filteredCarteiras = carteiras.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.codigoUnico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCarteiras.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCarteiras = filteredCarteiras.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Carteiras Cadastradas</h2>
            <p className="text-gray-600 mt-1">Gerencie todas as carteiras digitais</p>
          </div>
          <button
            onClick={() => navigate('/admin/carteiras/nova')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Nova Carteira
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando carteiras...</p>
          </div>
        ) : filteredCarteiras.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <p className="text-gray-600">
              {searchTerm ? 'Nenhuma carteira encontrada com esse termo.' : 'Nenhuma carteira cadastrada ainda.'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-medium text-gray-900">{startIndex + 1}</span> a{' '}
                <span className="font-medium text-gray-900">{Math.min(endIndex, filteredCarteiras.length)}</span> de{' '}
                <span className="font-medium text-gray-900">{filteredCarteiras.length}</span> carteiras
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {paginatedCarteiras.map((carteira) => (
              <div
                key={carteira.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-shrink-0">
                    {carteira.fotoUrl ? (
                      <img
                        src={carteira.fotoUrl}
                        alt={carteira.nome}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs font-medium">Sem foto</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{carteira.nome}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Código: <span className="font-mono font-medium text-gray-700">{carteira.codigoUnico}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {carteira.situacaoAtual === 'REGULAR' ? (
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-md text-xs font-semibold uppercase tracking-wide border border-green-200">
                            Regular
                          </span>
                        ) : carteira.situacaoAtual === 'DESLIGADO' ? (
                          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-md text-xs font-semibold uppercase tracking-wide border border-red-200">
                            Desligado
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-md text-xs font-semibold uppercase tracking-wide border border-gray-200">
                            {carteira.situacaoAtual || 'Sem Status'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/admin/carteiras/${carteira.id}/qrcode`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-medium transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      QR Code
                    </button>

                    <button
                      onClick={() => navigate(`/admin/carteiras/${carteira.id}/editar`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
