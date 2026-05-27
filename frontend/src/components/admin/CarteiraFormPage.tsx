import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Upload, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import Input from '../ui/Input';
import { API_ENDPOINTS } from '../../config/api';
import { getToken } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';

export default function CarteiraFormPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [unidadesAdministradas, setUnidadesAdministradas] = useState('');
  const [situacaoAtual, setSituacaoAtual] = useState('REGULAR');
  const [isDesligada, setIsDesligada] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      loadCarteira();
    } else {
      setNome('');
      setCpf('');
      setCargo('');
      setDataNascimento('');
      setUnidadesAdministradas('');
      setSituacaoAtual('REGULAR');
      setIsDesligada(false);
      setFoto(null);
      setFotoPreview(null);
    }
  }, [id, isEdit]);

  const loadCarteira = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CARTEIRAS}/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNome(data.nome);
        setCpf(data.cpf || '');
        setCargo(data.cargo || '');
        setDataNascimento(data.dataNascimento || '');
        setUnidadesAdministradas(data.unidadesAdministradas || '');
        setSituacaoAtual(data.situacaoAtual || 'REGULAR');
        setIsDesligada(data.situacaoAtual === 'DESLIGADO');
        setFotoPreview(data.fotoUrl);
      }
    } catch (error) {
      console.error('Erro ao carregar carteira:', error);
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCpfChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    
    if (numbers.length > 3) {
      formatted = numbers.slice(0, 3) + '.' + numbers.slice(3);
    }
    if (numbers.length > 6) {
      formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
    }
    if (numbers.length > 9) {
      formatted = formatted.slice(0, 11) + '-' + formatted.slice(11, 13);
    }
    
    setCpf(formatted.slice(0, 14));
  };

  const handleDataNascimentoChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    
    if (numbers.length > 2) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    if (numbers.length > 4) {
      formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
    }
    
    setDataNascimento(formatted.slice(0, 10));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('cpf', cpf);
      formData.append('cargo', cargo);
      formData.append('dataNascimento', dataNascimento);
      formData.append('unidadesAdministradas', unidadesAdministradas);
      formData.append('situacaoAtual', situacaoAtual);
      
      if (foto) {
        formData.append('foto', foto);
      }

      const url = isEdit ? `${API_ENDPOINTS.CARTEIRAS}/${id}` : API_ENDPOINTS.CARTEIRAS;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      });

      if (response.ok) {
        showToast(
          isEdit ? 'Carteira atualizada com sucesso!' : 'Carteira criada com sucesso!',
          'success'
        );
        setTimeout(() => {
          navigate('/admin/carteiras');
        }, 1000);
      } else {
        const error = await response.json();
        showToast(error.error || 'Erro ao salvar carteira', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar carteira:', error);
      alert('Erro ao salvar carteira');
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-3xl font-bold text-white">
              {isEdit ? 'Editar Carteira' : 'Nova Carteira'}
            </h2>
            <p className="text-slate-400 mt-1">
              {isEdit ? 'Atualize os dados da carteira' : 'Cadastre uma nova carteira digital'}
            </p>
          </div>
        </div>

        {isDesligada && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-400">Carteira Desligada</h4>
              <p className="text-sm text-red-300/90 mt-1">
                Esta carteira está com status DESLIGADO e não pode ser editada. Todos os campos estão bloqueados para preservar o histórico.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg border border-emerald-500/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 px-6 py-4 border-b border-emerald-500/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                Dados Pessoais
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Informações básicas da carteira</p>
            </div>
            <div className="p-6">
            
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome Completo *"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                    disabled={isDesligada}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => handleCpfChange(e.target.value)}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      disabled={isDesligada}
                      className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Data de Nascimento
                    </label>
                    <input
                      type="text"
                      value={dataNascimento}
                      onChange={(e) => handleDataNascimentoChange(e.target.value)}
                      placeholder="DD/MM/AAAA"
                      maxLength={10}
                      disabled={isDesligada}
                      className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <Input
                    label="Cargo/Função"
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="Digite o cargo ou função"
                    disabled={isDesligada}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Unidades Administradas
                    </label>
                    <select
                      value={unidadesAdministradas}
                      onChange={(e) => setUnidadesAdministradas(e.target.value)}
                      disabled={isDesligada}
                      className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecione uma unidade</option>
                      <option value="Santa Casa de Ruy Barbosa">Santa Casa de Ruy Barbosa</option>
                      <option value="Instituto de Nefrologia Alaide Costa">Instituto de Nefrologia Alaide Costa</option>
                      <option value="Hospital Regional Piemonte do Paraguaçu">Hospital Regional Piemonte do Paraguaçu</option>
                      <option value="Hospital Metropolitano">Hospital Metropolitano</option>
                      <option value="Hospital Estadual Litoral Norte">Hospital Estadual Litoral Norte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Situação Atual
                    </label>
                    <select
                      value={situacaoAtual}
                      onChange={(e) => setSituacaoAtual(e.target.value)}
                      disabled={isDesligada}
                      className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="REGULAR">REGULAR</option>
                      {isEdit && <option value="DESLIGADO">DESLIGADO</option>}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Foto da Carteira
                  </label>
                
                {!fotoPreview ? (
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFotoChange}
                    disabled={isDesligada}
                    className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:font-semibold hover:file:bg-emerald-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={fotoPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-emerald-500/30 shadow-lg"
                      />
                      {!isDesligada && (
                        <button
                          type="button"
                          onClick={() => {
                            setFoto(null);
                            setFotoPreview(null);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                          title="Remover foto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {!isDesligada && (
                      <div>
                        <input
                          type="file"
                          id="foto-substituir"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFotoChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="foto-substituir"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-500/50 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          Substituir Foto
                        </label>
                      </div>
                    )}
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg border border-emerald-500/20 p-6">
            <div className="flex gap-3">
              {!isDesligada && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isEdit ? 'Atualizar Carteira' : 'Criar Carteira'}
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/admin/carteiras')}
                className={`px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all border border-slate-600/50 ${
                  isDesligada ? 'flex-1' : ''
                }`}
              >
                {isDesligada ? 'Voltar' : 'Cancelar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
