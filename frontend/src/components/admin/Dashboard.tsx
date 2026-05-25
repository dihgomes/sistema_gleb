import { useEffect, useState } from 'react';
import { Users, CheckCircle, XCircle, QrCode } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { API_ENDPOINTS } from '../../config/api';
import { getToken } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';

interface Stats {
  total: number;
  ativas: number;
  inativas: number;
}

export default function Dashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState<Stats>({ total: 0, ativas: 0, inativas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const shouldShowToast = localStorage.getItem('showLoginToast') || sessionStorage.getItem('showLoginToast');
    if (shouldShowToast) {
      showToast('Login realizado com sucesso!', 'success');
      localStorage.removeItem('showLoginToast');
      sessionStorage.removeItem('showLoginToast');
    }
    loadStats();
  }, [showToast]);

  const loadStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CARTEIRAS, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const carteiras = await response.json();
        setStats({
          total: carteiras.length,
          ativas: carteiras.filter((c: any) => c.ativo).length,
          inativas: carteiras.filter((c: any) => !c.ativo).length,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total de Carteiras',
      value: stats.total,
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Carteiras Ativas',
      value: stats.ativas,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Carteiras Inativas',
      value: stats.inativas,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/20'
    },
    {
      title: 'QR Codes Gerados',
      value: stats.total,
      icon: QrCode,
      gradient: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Dashboard</h2>
            <p className="text-slate-400 mt-1">Visão geral do sistema de carteiras digitais</p>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Sistema Online</span>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <p className="mt-2 text-slate-400">Carregando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`bg-slate-800/50 backdrop-blur-xl rounded-xl border ${card.borderColor} hover:border-emerald-500/40 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden group`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`text-4xl font-bold ${card.iconColor} opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <Icon className="w-12 h-12" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                      <p className="text-4xl font-bold mt-2 text-white">
                        {card.value}
                      </p>
                    </div>
                  </div>
                  <div className={`h-1 bg-gradient-to-r ${card.gradient}`}></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-emerald-500/20 shadow-lg p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/carteiras/nova"
              className="flex items-center gap-4 p-5 bg-slate-700/30 border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg group-hover:shadow-emerald-500/50 transition-shadow">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Nova Carteira</p>
                <p className="text-xs text-slate-400">Cadastrar nova carteira</p>
              </div>
            </a>

            <a
              href="/admin/carteiras"
              className="flex items-center gap-4 p-5 bg-slate-700/30 border border-green-500/20 rounded-xl hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg group-hover:shadow-green-500/50 transition-shadow">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Ver Carteiras</p>
                <p className="text-xs text-slate-400">Listar todas as carteiras</p>
              </div>
            </a>

            <a
              href="/admin/carteiras"
              className="flex items-center gap-4 p-5 bg-slate-700/30 border border-purple-500/20 rounded-xl hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Gerar QR Code</p>
                <p className="text-xs text-slate-400">Gerar código de validação</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
