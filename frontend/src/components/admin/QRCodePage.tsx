import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy, CheckCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { API_ENDPOINTS } from '../../config/api';
import { getToken } from '../../utils/auth';

interface QRCodeData {
  url: string;
  qrcode: string;
  codigoUnico: string;
}

interface Carteira {
  id: string;
  nome: string;
  codigoUnico: string;
}

export default function QRCodePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const carteiraResponse = await fetch(`${API_ENDPOINTS.CARTEIRAS}/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (carteiraResponse.ok) {
        const carteiraData = await carteiraResponse.json();
        setCarteira(carteiraData);
      }

      const qrResponse = await fetch(API_ENDPOINTS.GERAR_QRCODE(id!), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        setQrData(qrData);
      } else {
        alert('Erro ao gerar QR Code');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (qrData?.url) {
      navigator.clipboard.writeText(qrData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (qrData?.qrcode) {
      const link = document.createElement('a');
      link.href = qrData.qrcode;
      link.download = `qrcode-${carteira?.nome || 'carteira'}.png`;
      link.click();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/carteiras')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">QR Code da Carteira</h2>
            <p className="text-gray-600 mt-1">
              {carteira?.nome || 'Carregando...'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Gerando QR Code...</p>
          </div>
        ) : qrData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                QR Code Gerado
              </h3>
              
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white border-4 border-blue-600 rounded-xl shadow-lg">
                  <img
                    src={qrData.qrcode}
                    alt="QR Code"
                    className="w-64 h-64"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Baixar QR Code
                </button>

                <p className="text-xs text-gray-500 text-center">
                  O QR Code será salvo como imagem PNG
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações da Carteira
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <p className="text-gray-900 font-medium">{carteira?.nome}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Único
                  </label>
                  <p className="text-gray-900 font-mono font-medium bg-gray-100 px-3 py-2 rounded-lg">
                    {qrData.codigoUnico}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Validação
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={qrData.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        copied
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 mt-2">URL copiada!</p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Como usar:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Baixe o QR Code usando o botão acima</li>
                    <li>Imprima o QR Code na carteira física</li>
                    <li>Ao escanear, o usuário será direcionado para a página de validação</li>
                    <li>A URL nunca muda, mesmo se os dados forem atualizados</li>
                  </ol>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Importante:</strong> Este QR Code é permanente e único. 
                    Mesmo que você atualize os dados da carteira, o QR Code continuará funcionando.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <p className="text-gray-600">Erro ao gerar QR Code</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
