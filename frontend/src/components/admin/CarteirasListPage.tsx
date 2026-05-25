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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Carteiras Cadastradas</h2>
            <p className="text-slate-400 mt-1">Gerencie todas as carteiras digitais</p>
          </div>
          <button
            onClick={() => navigate('/admin/carteiras/nova')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-500/50"
          >
            <span className="text-xl">+</span>
            Nova Carteira
          </button>
        </div>

        {/* Search bar */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-emerald-500/20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <p className="mt-2 text-slate-400">Carregando carteiras...</p>
          </div>
        ) : filteredCarteiras.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-emerald-500/20">
            <p className="text-slate-400">
              {searchTerm ? 'Nenhuma carteira encontrada com esse termo.' : 'Nenhuma carteira cadastrada ainda.'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-emerald-500/20 px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Mostrando <span className="font-semibold text-emerald-400">{startIndex + 1}</span> a{' '}
                <span className="font-semibold text-emerald-400">{Math.min(endIndex, filteredCarteiras.length)}</span> de{' '}
                <span className="font-semibold text-emerald-400">{filteredCarteiras.length}</span> carteiras
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {paginatedCarteiras.map((carteira) => (
              <div
                key={carteira.id}
                className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden group"
              >
                <div className="flex items-center gap-4 p-5">
                  <div className="flex-shrink-0">
                    {carteira.fotoUrl ? (
                      <img
                        src={carteira.fotoUrl}
                        alt={carteira.nome}
                        className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30 shadow-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-700/50 border-2 border-emerald-500/30 flex items-center justify-center">
                        <span className="text-slate-500 text-xs font-medium">Sem foto</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white truncate">{carteira.nome}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Código: <span className="font-mono font-medium text-emerald-400">{carteira.codigoUnico}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {carteira.situacaoAtual === 'REGULAR' ? (
                          <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold uppercase tracking-wide border border-green-500/30">
                            Regular
                          </span>
                        ) : carteira.situacaoAtual === 'DESLIGADO' ? (
                          <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wide border border-red-500/30">
                            Desligado
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-slate-500/20 text-slate-400 rounded-lg text-xs font-bold uppercase tracking-wide border border-slate-500/30">
                            {carteira.situacaoAtual || 'Sem Status'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/admin/carteiras/${carteira.id}/qrcode`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-xs font-semibold transition-all shadow-lg shadow-purple-500/25 border border-purple-500/50"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </button>

                    <button
                      onClick={() => navigate(`/admin/carteiras/${carteira.id}/editar`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-500/50"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg border border-emerald-500/20 px-4 py-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-700/50 border border-emerald-500/30 rounded-lg hover:bg-slate-700 hover:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  <div className="flex items-center gap-2">
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
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border border-emerald-500/50'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-slate-500">
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
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-700/50 border border-emerald-500/30 rounded-lg hover:bg-slate-700 hover:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
