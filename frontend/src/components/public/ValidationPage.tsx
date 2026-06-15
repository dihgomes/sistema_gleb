import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Key, Eye, EyeOff } from 'lucide-react';
import Header from './Header';
import PhotoCard from './PhotoCard';
import InfoSection from './InfoSection';
import FooterValidation from './FooterValidation';
import { API_ENDPOINTS } from '../../config/api';
import { CarteiraPublica } from '../../types/carteira';
import { transformCarteiraData } from '../../utils/transformCarteiraData';
import { MasonData } from '../../data/mockData';

export default function ValidationPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const [data, setData] = useState<MasonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInativa, setIsInativa] = useState(false);
  const [pin, setPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [statusVisivel, setStatusVisivel] = useState(false);
  const [motivoNegacao, setMotivoNegacao] = useState<string | null>(null);

  useEffect(() => {
    if (codigo) {
      loadCarteiraData(codigo);
    } else {
      setLoading(false);
      setError('Código de validação não fornecido');
    }
  }, [codigo]);

  const loadCarteiraData = async (codigoUnico: string, pinValue?: string, retryCount = 0) => {
    setLoading(true);
    setError(null);
    setIsInativa(false);
    setMotivoNegacao(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const endpoint = pinValue 
        ? API_ENDPOINTS.CARTEIRA_PUBLIC_WITH_PIN(codigoUnico, pinValue)
        : API_ENDPOINTS.CARTEIRA_PUBLIC(codigoUnico);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Carteira não encontrada');
        } else {
          throw new Error('Erro ao carregar dados da carteira');
        }
      }

      const apiData: any = await response.json();
      const transformedData = transformCarteiraData(apiData);
      setData(transformedData);
      
      setIsInativa(!apiData.ativo);
      setStatusVisivel(apiData.statusVisivel || false);
      
      if (apiData.motivoNegacao) {
        setMotivoNegacao(apiData.motivoNegacao);
      }
    } catch (err) {
      if (retryCount < 2 && (err instanceof Error && (err.name === 'AbortError' || err.message.includes('fetch')))) {
        console.log(`Tentando novamente... (${retryCount + 1}/2)`);
        setTimeout(() => loadCarteiraData(codigoUnico, pinValue, retryCount + 1), 1000);
        return;
      }

      setError(err instanceof Error ? err.message : 'Erro ao carregar carteira');
      console.error('Erro ao carregar carteira:', err);
      setLoading(false);
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6 && codigo) {
      loadCarteiraData(codigo, pin);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Carregando dados da carteira...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-8 border border-red-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Erro ao Validar Carteira</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">
                Verifique se o código QR está correto ou entre em contato com a administração.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Nenhum código de validação fornecido</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        {isInativa && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-red-800">
                  Carteira Digital Inativa
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Esta carteira foi desativada pela administração. Os dados são exibidos apenas para consulta.
                </p>
              </div>
            </div>
          </div>
        )}

        {!statusVisivel && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Key className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    Status Protegido
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Para visualizar o status atual, insira o PIN de acesso
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPinInput(!showPinInput)}
                className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all flex items-center gap-2"
              >
                {showPinInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPinInput ? 'Ocultar' : 'Inserir PIN'}
              </button>
            </div>
            
            {showPinInput && (
              <form onSubmit={handlePinSubmit} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Digite o PIN de 6 dígitos"
                  maxLength={6}
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono tracking-wider"
                />
                <button
                  type="submit"
                  disabled={pin.length !== 6}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                >
                  Validar
                </button>
              </form>
            )}

            {motivoNegacao && (
              <div className="mt-3 text-sm text-red-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {motivoNegacao}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2" style={{ borderColor: '#6F63C7' }}>
          <div className="h-2" style={{ background: 'linear-gradient(to right, #6F63C7, #8B7FD9, #FCD34D)' }} />

          <div className="p-6 sm:p-10">
            <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-12">
              <div className="flex-shrink-0">
                <PhotoCard
                  foto={data.foto}
                  nome={data.nome}
                  unidade={data.unidadesAdministradas}
                />
              </div>

              <div className="flex-1 w-full">
                <InfoSection data={data} statusVisivel={statusVisivel} />
              </div>
            </div>
          </div>

          <div className="h-2" style={{ background: 'linear-gradient(to right, #FCD34D, #8B7FD9, #6F63C7)' }} />
        </div>

        <FooterValidation
          validadoEm={data.validadoEm}
          hash={data.hashValidacao}
        />
      </main>
    </div>
  );
}
