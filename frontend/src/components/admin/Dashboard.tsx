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
      bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Carteiras Ativas',
      value: stats.ativas,
      icon: CheckCircle,
      bgGradient: 'bg-gradient-to-br from-green-500 to-green-600',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Carteiras Inativas',
      value: stats.inativas,
      icon: XCircle,
      bgGradient: 'bg-gradient-to-br from-red-500 to-red-600',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      textColor: 'text-red-600'
    },
    {
      title: 'QR Codes Gerados',
      value: stats.total,
      icon: QrCode,
      bgGradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Visão geral do sistema de carteiras digitais</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${card.iconBg} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${card.iconColor}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.title}</p>
                      <p className={`text-3xl font-bold mt-2 ${card.textColor}`}>
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href="/admin/carteiras/nova"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <div className="bg-blue-600 p-2.5 rounded-lg shadow-sm">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Nova Carteira</p>
                <p className="text-xs text-gray-600">Cadastrar nova carteira</p>
              </div>
            </a>

            <a
              href="/admin/carteiras"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <div className="bg-green-600 p-2.5 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Ver Carteiras</p>
                <p className="text-xs text-gray-600">Listar todas as carteiras</p>
              </div>
            </a>

            <a
              href="/admin/carteiras"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <div className="bg-purple-600 p-2.5 rounded-lg shadow-sm">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Gerar QR Code</p>
                <p className="text-xs text-gray-600">Gerar código de validação</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
