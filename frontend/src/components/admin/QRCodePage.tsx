import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import AdminLayout from './AdminLayout';
import { API_ENDPOINTS } from '../../config/api';
import { getToken } from '../../utils/auth';

interface Carteira {
  id: string;
  nome: string;
  codigoUnico: string;
}

export default function QRCodePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [copied, setCopied] = useState(false);

  const validationUrl = carteira 
    ? `${window.location.origin}/q/${carteira.codigoUnico}`
    : '';

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
      } else {
        alert('Erro ao carregar dados da carteira');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (validationUrl) {
      navigator.clipboard.writeText(validationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg || !carteira) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${carteira.nome.replace(/\s+/g, '-')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/carteiras')}
            className="p-2.5 hover:bg-slate-700/50 rounded-lg transition-all border border-emerald-500/20 hover:border-emerald-500/40"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">QR Code da Carteira</h2>
            <p className="text-slate-400 mt-1">
              {carteira?.nome || 'Carregando...'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <p className="mt-2 text-slate-400">Gerando QR Code...</p>
          </div>
        ) : carteira ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                QR Code Gerado
              </h3>
              
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white border-4 border-purple-500 rounded-xl shadow-lg shadow-purple-500/25">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={validationUrl}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/25 border border-purple-500/50"
                >
                  <Download className="w-5 h-5" />
                  Baixar QR Code
                </button>

                <p className="text-xs text-slate-400 text-center">
                  O QR Code será salvo como imagem PNG
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-emerald-500/20">
              <h3 className="text-xl font-bold text-white mb-6">
                Informações da Carteira
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Nome
                  </label>
                  <p className="text-white font-semibold text-lg">{carteira?.nome}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Código Único
                  </label>
                  <p className="text-emerald-400 font-mono font-bold bg-slate-900/50 px-4 py-3 rounded-lg border border-emerald-500/30">
                    {carteira.codigoUnico}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    URL de Validação
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={validationUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-sm font-mono text-slate-300"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-lg ${
                        copied
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-500/25 border border-green-500/50'
                          : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600/50'
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
                    <p className="text-sm text-green-400 mt-2 font-semibold">URL copiada!</p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <h4 className="font-bold text-white mb-3">Como usar:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-400">
                    <li>Baixe o QR Code usando o botão acima</li>
                    <li>Imprima o QR Code na carteira física</li>
                    <li>Ao escanear, o usuário será direcionado para a página de validação</li>
                    <li>A URL nunca muda, mesmo se os dados forem atualizados</li>
                  </ol>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-emerald-300">
                    <strong className="text-emerald-400">Importante:</strong> Este QR Code é permanente e único. 
                    Mesmo que você atualize os dados da carteira, o QR Code continuará funcionando.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-red-500/20">
            <p className="text-red-400">Erro ao gerar QR Code</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
