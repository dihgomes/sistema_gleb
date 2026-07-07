import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { API_ENDPOINTS } from '../../config/api';
import { getToken } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';

interface CarteiraLote {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  dataNascimento: string;
  unidadesAdministradas: string;
  situacaoAtual: string;
  foto: File | null;
  fotoPreview: string | null;
}

export default function CarteiraLotePage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [carteiras, setCarteiras] = useState<CarteiraLote[]>([
    {
      id: '1',
      nome: '',
      cpf: '',
      cargo: '',
      dataNascimento: '',
      unidadesAdministradas: '',
      situacaoAtual: 'REGULAR',
      foto: null,
      fotoPreview: null
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCpfChange = (value: string, id: string) => {
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
    
    updateCarteira(id, 'cpf', formatted.slice(0, 14));
  };

  const handleDataNascimentoChange = (value: string, id: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    
    if (numbers.length > 2) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    if (numbers.length > 4) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4);
    }
    
    updateCarteira(id, 'dataNascimento', formatted.slice(0, 10));
  };

  const updateCarteira = (id: string, field: keyof CarteiraLote, value: string | File | null) => {
    setCarteiras(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCarteira(id, 'foto', file);
        updateCarteira(id, 'fotoPreview', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCarteira = () => {
    const newId = (carteiras.length + 1).toString();
    setCarteiras(prev => [
      ...prev,
      {
        id: newId,
        nome: '',
        cpf: '',
        cargo: '',
        dataNascimento: '',
        unidadesAdministradas: '',
        situacaoAtual: 'REGULAR',
        foto: null,
        fotoPreview: null
      }
    ]);
  };

  const removeCarteira = (id: string) => {
    if (carteiras.length === 1) {
      showToast('Mínimo de uma carteira é obrigatório', 'error');
      return;
    }
    setCarteiras(prev => prev.filter(c => c.id !== id));
  };

  const validateCarteiras = () => {
    const newErrors: { [key: string]: string } = {};
    
    carteiras.forEach((carteira) => {
      if (!carteira.nome.trim()) {
        newErrors[`nome-${carteira.id}`] = 'Nome é obrigatório';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateCarteiras()) {
      showToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      const fotos: File[] = [];
      carteiras.forEach((carteira) => {
        if (carteira.foto) {
          fotos.push(carteira.foto);
        }
      });
      
      fotos.forEach((foto) => {
        formData.append('fotos', foto);
      });

      const carteirasData = carteiras.map(c => ({
        nome: c.nome.toUpperCase(),
        cpf: c.cpf || null,
        cargo: c.cargo.toUpperCase() || null,
        dataNascimento: c.dataNascimento || null,
        unidadesAdministradas: c.unidadesAdministradas || null,
        situacaoAtual: c.situacaoAtual
      }));

      formData.append('carteiras', JSON.stringify(carteirasData));

      const response = await fetch(API_ENDPOINTS.CARTEIRAS_LOTE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showToast(
          `${data.sucesso} carteiras criadas com sucesso!${data.falhas > 0 ? ` (${data.falhas} falhas)` : ''}`,
          'success'
        );
        
        if (data.erros && data.erros.length > 0) {
          console.error('Erros:', data.erros);
        }
        
        setTimeout(() => {
          navigate('/admin/carteiras');
        }, 2000);
      } else {
        showToast(data.error || 'Erro ao criar carteiras', 'error');
      }
    } catch (error) {
      showToast('Erro ao criar carteiras', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Criar Carteiras em Lote</h2>
            <p className="text-slate-400 mt-1">Adicione múltiplas carteiras e salve de uma vez</p>
          </div>
          <button
            onClick={() => navigate('/admin/carteiras')}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {carteiras.map((carteira) => (
            <div
              key={carteira.id}
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-emerald-500/20 shadow-lg p-6 relative"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                {carteiras.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCarteira(carteira.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30"
                    title="Remover carteira"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Carteira #{carteira.id}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-slate-300 text-sm font-medium">Foto</label>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {carteira.fotoPreview ? (
                        <img
                          src={carteira.fotoPreview}
                          alt="Preview"
                          className="w-20 h-20 rounded-lg object-cover border-2 border-emerald-500/30"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-slate-700/50 border-2 border-emerald-500/30 flex items-center justify-center">
                          <span className="text-slate-500 text-xs">Sem foto</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFotoChange(e, carteira.id)}
                        className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:text-emerald-400 file:cursor-pointer focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                      <p className="text-slate-500 text-xs mt-1">Formatos aceitos: JPG, PNG, GIF</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Nome Completo *</label>
                  <input
                    type="text"
                    value={carteira.nome}
                    onChange={(e) => updateCarteira(carteira.id, 'nome', e.target.value.toUpperCase())}
                    placeholder="Digite o nome completo"
                    required
                    style={{ textTransform: 'uppercase' }}
                    className={`w-full px-4 py-3 text-sm bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors[`nome-${carteira.id}`] 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                  {errors[`nome-${carteira.id}`] && (
                    <p className="text-red-400 text-xs">{errors[`nome-${carteira.id}`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">CPF</label>
                  <input
                    type="text"
                    value={carteira.cpf}
                    onChange={(e) => handleCpfChange(e.target.value, carteira.id)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Data de Nascimento</label>
                  <input
                    type="text"
                    value={carteira.dataNascimento}
                    onChange={(e) => handleDataNascimentoChange(e.target.value, carteira.id)}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Cargo/Função</label>
                  <input
                    type="text"
                    value={carteira.cargo}
                    onChange={(e) => updateCarteira(carteira.id, 'cargo', e.target.value.toUpperCase())}
                    placeholder="Digite o cargo ou função"
                    style={{ textTransform: 'uppercase' }}
                    className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Unidades Administradas</label>
                  <select
                    value={carteira.unidadesAdministradas}
                    onChange={(e) => updateCarteira(carteira.id, 'unidadesAdministradas', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  >
                    <option value="">Selecione uma unidade</option>
                    <option value="Santa Casa de Ruy Barbosa">Santa Casa de Ruy Barbosa</option>
                    <option value="Instituto de Nefrologia Alaide Costa">Instituto de Nefrologia Alaide Costa</option>
                    <option value="Hospital Regional Piemonte do Paraguaçu">Hospital Regional Piemonte do Paraguaçu</option>
                    <option value="Hospital Metropolitano">Hospital Metropolitano</option>
                    <option value="Hospital Estadual Litoral Norte">Hospital Estadual Litoral Norte</option>
                    <option value="CSC">CSC</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Situação Atual</label>
                  <select
                    value={carteira.situacaoAtual}
                    onChange={(e) => updateCarteira(carteira.id, 'situacaoAtual', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  >
                    <option value="REGULAR">REGULAR</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={addCarteira}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-500/50"
            >
              <Plus className="w-4 h-4" />
              Adicionar Carteira
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/25 border border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando {carteiras.length} carteiras...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Todas ({carteiras.length})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
