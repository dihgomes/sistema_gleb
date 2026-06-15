import { useState, useEffect } from 'react';
import { Key, Clock, Shield, Trash2, Plus, Copy, Check } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { getAuthHeaders } from '../../utils/auth';

interface Pin {
  id: string;
  pin: string;
  tipo: 'temporario' | 'permanente';
  expiraEm: string | null;
  ativo: boolean;
  revogado: boolean;
  criadoPorNome: string;
  criadoPorRole: string;
  criadoEm: string;
  ultimoUso: string | null;
  totalUsos: number;
  expirado?: boolean;
  status?: string;
}

export default function PinsPage() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tipoPinNovo, setTipoPinNovo] = useState<'temporario' | 'permanente'>('temporario');
  const [pinCriado, setPinCriado] = useState<Pin | null>(null);
  const [copiedPin, setCopiedPin] = useState<string | null>(null);

  useEffect(() => {
    carregarPins();
  }, []);

  const carregarPins = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PINS, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setPins(data);
      }
    } catch (error) {
      console.error('Erro ao carregar PINs:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarPin = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PINS, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tipo: tipoPinNovo }),
      });

      if (response.ok) {
        const novoPin = await response.json();
        setPinCriado(novoPin);
        carregarPins();
      }
    } catch (error) {
      console.error('Erro ao criar PIN:', error);
    }
  };

  const revogarPin = async (id: string) => {
    if (!confirm('Deseja realmente revogar este PIN?')) return;

    try {
      const response = await fetch(API_ENDPOINTS.PIN_REVOGAR(id), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        carregarPins();
      }
    } catch (error) {
      console.error('Erro ao revogar PIN:', error);
    }
  };

  const copiarPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const calcularTempoRestante = (expiraEm: string) => {
    const agora = new Date();
    const expiracao = new Date(expiraEm);
    const diff = expiracao.getTime() - agora.getTime();

    if (diff <= 0) return 'Expirado';

    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${horas}h ${minutos}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Key className="w-7 h-7 text-emerald-400" />
            PINs de Acesso
          </h1>
          <p className="text-slate-400 mt-1">
            Gerencie os PINs para visualização de status das carteiras
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Gerar Novo PIN
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
        </div>
      ) : pins.length === 0 ? (
        <div className="bg-slate-800/50 rounded-lg p-12 text-center">
          <Key className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Nenhum PIN ativo</p>
          <p className="text-slate-500 text-sm mt-2">Clique em "Gerar Novo PIN" para criar um</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pins.map((pin) => (
            <div
              key={pin.id}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg border border-emerald-500/30">
                      <Key className="w-5 h-5 text-emerald-400" />
                      <span className="text-2xl font-mono font-bold text-white tracking-wider">
                        {pin.pin}
                      </span>
                    </div>
                    <button
                      onClick={() => copiarPin(pin.pin)}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
                      title="Copiar PIN"
                    >
                      {copiedPin === pin.pin ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pin.tipo === 'permanente'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {pin.tipo === 'permanente' ? (
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Permanente
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Temporário
                        </span>
                      )}
                    </span>
                    {pin.expirado && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                        Expirado
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Criado por</p>
                      <p className="text-white font-medium">{pin.criadoPorNome}</p>
                      <p className="text-slate-400 text-xs capitalize">{pin.criadoPorRole}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Criado em</p>
                      <p className="text-white">{formatarData(pin.criadoEm)}</p>
                    </div>
                    {pin.expiraEm && (
                      <div>
                        <p className="text-slate-500">
                          {pin.expirado ? 'Expirou em' : 'Expira em'}
                        </p>
                        <p className="text-white">{formatarData(pin.expiraEm)}</p>
                        {!pin.expirado && (
                          <p className="text-emerald-400 text-xs font-medium">
                            {calcularTempoRestante(pin.expiraEm)}
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <p className="text-slate-500">Usos</p>
                      <p className="text-white font-medium">{pin.totalUsos}</p>
                      {pin.ultimoUso && (
                        <p className="text-slate-400 text-xs">
                          Último: {formatarData(pin.ultimoUso)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => revogarPin(pin.id)}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                  title="Revogar PIN"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700">
            {pinCriado ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">PIN Criado com Sucesso!</h3>
                <p className="text-slate-400 mb-6">Copie e guarde este PIN em local seguro</p>

                <div className="bg-slate-900/50 rounded-lg p-6 mb-6 border border-emerald-500/30">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Key className="w-6 h-6 text-emerald-400" />
                    <span className="text-4xl font-mono font-bold text-white tracking-wider">
                      {pinCriado.pin}
                    </span>
                    <button
                      onClick={() => copiarPin(pinCriado.pin)}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
                    >
                      {copiedPin === pinCriado.pin ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tipo:</span>
                      <span className="text-white capitalize">{pinCriado.tipo}</span>
                    </div>
                    {pinCriado.expiraEm && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Expira em:</span>
                        <span className="text-white">{formatarData(pinCriado.expiraEm)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setPinCriado(null);
                  }}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-4">Gerar Novo PIN</h3>
                <p className="text-slate-400 mb-6">
                  Escolha o tipo de PIN que deseja gerar
                </p>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setTipoPinNovo('temporario')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      tipoPinNovo === 'temporario'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-amber-400" />
                      <div>
                        <p className="text-white font-medium">PIN Temporário</p>
                        <p className="text-slate-400 text-sm">Válido por 12 horas</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTipoPinNovo('permanente')}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      tipoPinNovo === 'permanente'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">PIN Permanente</p>
                        <p className="text-slate-400 text-sm">Válido até ser revogado</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={criarPin}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
                  >
                    Gerar PIN
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
