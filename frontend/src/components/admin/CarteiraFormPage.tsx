import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Plus, AlertCircle, Upload, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { API_ENDPOINTS } from '../../config/api';
import { getToken } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';

interface DataMaconica {
  titulo: string;
  data: string;
}

interface Loja {
  dataFiliacao: string;
  dataDesligamento: string;
  bloqueado?: boolean;
}

export default function CarteiraFormPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [loja, setLoja] = useState('');
  const [situacaoAtual, setSituacaoAtual] = useState('REGULAR');
  const [isDesligada, setIsDesligada] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [datasMaconicas, setDatasMaconicas] = useState<DataMaconica[]>([
    { titulo: '', data: '' }
  ]);
  const [lojas, setLojas] = useState<Loja[]>([
    { dataFiliacao: '', dataDesligamento: '', bloqueado: false }
  ]);

  useEffect(() => {
    if (isEdit) {
      loadCarteira();
    } else {
      setNome('');
      setLoja('');
      setSituacaoAtual('REGULAR');
      setIsDesligada(false);
      setFoto(null);
      setFotoPreview(null);
      setDatasMaconicas([{ titulo: '', data: '' }]);
      setLojas([{ dataFiliacao: '', dataDesligamento: '', bloqueado: false }]);
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
        setLoja(data.loja || '');
        setSituacaoAtual(data.situacaoAtual || 'REGULAR');
        setIsDesligada(data.situacaoAtual === 'DESLIGADO');
        setFotoPreview(data.fotoUrl);
        setDatasMaconicas(data.datasMaconicas || []);
        
        const lojasConvertidas = (data.lojas || []).map((l: any) => ({
          dataFiliacao: l.data || l.dataFiliacao || '',
          dataDesligamento: l.desligamento && l.desligamento !== '--' ? l.desligamento : (l.dataDesligamento || ''),
          bloqueado: !!(l.data || l.dataFiliacao)
        }));
        setLojas(lojasConvertidas);
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

  const addDataMaconica = () => {
    setDatasMaconicas([...datasMaconicas, { titulo: '', data: '' }]);
  };

  const removeDataMaconica = (index: number) => {
    setDatasMaconicas(datasMaconicas.filter((_, i) => i !== index));
  };

  const updateDataMaconica = (index: number, field: keyof DataMaconica, value: string) => {
    const updated = [...datasMaconicas];
    updated[index][field] = value;
    setDatasMaconicas(updated);
  };

  const addLoja = () => {
    setLojas([...lojas, { dataFiliacao: '', dataDesligamento: '', bloqueado: false }]);
  };

  const removeLoja = (index: number) => {
    setLojas(lojas.filter((_, i) => i !== index));
  };

  const updateLoja = (index: number, field: keyof Loja, value: string | boolean) => {
    const updated = [...lojas];
    (updated[index] as any)[field] = value;
    setLojas(updated);
  };

  const bloquearFiliacao = (index: number) => {
    const updated = [...lojas];
    if (updated[index].dataFiliacao.trim() !== '') {
      updated[index].bloqueado = true;
      setLojas(updated);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    if (situacaoAtual === 'DESLIGADO') {
      const temDataDesligamento = lojas.some(loja => loja.dataDesligamento.trim() !== '');
      if (!temDataDesligamento) {
        alert('Para definir a situação como DESLIGADO, é obrigatório preencher a data de desligamento na seção Lojas.');
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('loja', loja);
      formData.append('situacaoAtual', situacaoAtual);
      formData.append('datasMaconicas', JSON.stringify(datasMaconicas));
      formData.append('lojas', JSON.stringify(lojas));
      
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Editar Carteira' : 'Nova Carteira'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Atualize os dados da carteira' : 'Cadastre uma nova carteira digital'}
            </p>
          </div>
        </div>

        {isDesligada && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-900">Carteira Desligada</h4>
              <p className="text-sm text-red-700 mt-1">
                Esta carteira está com status DESLIGADO e não pode ser editada. Todos os campos estão bloqueados para preservar o histórico.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 px-6 py-4 border-b border-blue-200">
              <h3 className="text-base font-semibold text-gray-900">Dados Pessoais</h3>
              <p className="text-xs text-gray-600 mt-0.5">Informações básicas da carteira</p>
            </div>
            <div className="p-6">
            
              <div className="space-y-4">
                <Input
                  label="Nome Completo *"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                  disabled={isDesligada}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Loja *"
                    type="text"
                    value={loja}
                    onChange={(e) => setLoja(e.target.value)}
                    placeholder="Nome da Loja"
                    required
                    disabled={isDesligada}
                  />

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Situação Atual
                    </label>
                    <select
                      value={situacaoAtual}
                      onChange={(e) => setSituacaoAtual(e.target.value)}
                      disabled={isDesligada}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="REGULAR">REGULAR</option>
                      {isEdit && <option value="DESLIGADO">DESLIGADO</option>}
                    </select>
                    {isEdit && situacaoAtual === 'DESLIGADO' && (
                      <p className="text-xs text-blue-600 mt-1.5">
                        Requer data de desligamento na seção Lojas
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Foto da Carteira
                  </label>
                
                {!fotoPreview ? (
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFotoChange}
                    disabled={isDesligada}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={fotoPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
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
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-6 py-4 border-b border-green-200">
              <h3 className="text-base font-semibold text-gray-900">Datas Maçônicas</h3>
              <p className="text-xs text-gray-600 mt-0.5">Graus e iniciações</p>
            </div>
            <div className="p-6">

              <div className="space-y-3">
                {datasMaconicas.map((data, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                      <input
                        type="text"
                        placeholder="Ex: Aprendiz"
                        value={data.titulo}
                        onChange={(e) => updateDataMaconica(index, 'titulo', e.target.value)}
                        disabled={isDesligada}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Data</label>
                      <input
                        type="date"
                        value={data.data}
                        onChange={(e) => updateDataMaconica(index, 'data', e.target.value)}
                        disabled={isDesligada}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="flex gap-2 md:items-end">
                      {index === datasMaconicas.length - 1 && !isDesligada && (
                        <button
                          type="button"
                          onClick={addDataMaconica}
                          className="flex items-center justify-center w-9 h-9 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
                          title="Adicionar nova data"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                      {datasMaconicas.length > 1 && !isDesligada && (
                        <button
                          type="button"
                          onClick={() => removeDataMaconica(index)}
                          className="flex items-center justify-center w-9 h-9 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                          title="Remover data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 px-6 py-4 border-b border-orange-200">
              <h3 className="text-base font-semibold text-gray-900">Lojas</h3>
              <p className="text-xs text-gray-600 mt-0.5">Filiações e desligamentos</p>
            </div>
            <div className="p-6">

              <div className="space-y-3">
                {lojas.map((loja, index) => {
                  const isFiliacaoPreenchida = loja.dataFiliacao.trim() !== '';
                  const isDesligamentoPreenchido = loja.dataDesligamento.trim() !== '';
                  const podeAdicionarNova = isFiliacaoPreenchida && isDesligamentoPreenchido;

                  return (
                    <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Filiação</label>
                        <input
                          type="date"
                          value={loja.dataFiliacao}
                          onChange={(e) => updateLoja(index, 'dataFiliacao', e.target.value)}
                          onBlur={() => bloquearFiliacao(index)}
                          disabled={loja.bloqueado || isDesligada}
                          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                            (loja.bloqueado || isDesligada) ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        />
                        {loja.bloqueado && (
                          <p className="text-xs text-blue-600 mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            Bloqueado
                          </p>
                        )}
                      </div>

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Desligamento</label>
                        <input
                          type="date"
                          value={loja.dataDesligamento}
                          onChange={(e) => updateLoja(index, 'dataDesligamento', e.target.value)}
                          disabled={!isEdit || !loja.bloqueado || isDesligada}
                          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                            (!isEdit || !loja.bloqueado || isDesligada) ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        />
                        {!isEdit && (
                          <p className="text-xs text-gray-500 mt-1.5">
                            Crie a carteira primeiro
                          </p>
                        )}
                        {isEdit && !loja.bloqueado && (
                          <p className="text-xs text-gray-500 mt-1.5">
                            Preencha a filiação primeiro
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 md:items-end">
                        {index === lojas.length - 1 && podeAdicionarNova && !isDesligada && (
                          <button
                            type="button"
                            onClick={addLoja}
                            className="flex items-center justify-center w-9 h-9 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-sm"
                            title="Adicionar nova loja"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                        {lojas.length > 1 && !isDesligada && (
                          <button
                            type="button"
                            onClick={() => removeLoja(index)}
                            className="flex items-center justify-center w-9 h-9 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                            title="Remover loja"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex gap-3">
              {!isDesligada && (
                <Button type="submit" isLoading={loading} className="flex-1">
                  <Save className="w-4 h-4 inline mr-2" />
                  {isEdit ? 'Atualizar Carteira' : 'Criar Carteira'}
                </Button>
              )}
              <button
                type="button"
                onClick={() => navigate('/admin/carteiras')}
                className={`px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border border-gray-300 ${
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
