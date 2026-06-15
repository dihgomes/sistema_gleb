import { useState, useEffect } from 'react';
import { UserPlus, Users, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { API_ENDPOINTS } from '../../config/api';
import { getToken } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../ui/Modal';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  criadoEm: string;
}

export default function ConfiguracoesPage() {
  const { showToast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'user'
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMINS, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showToast('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUsuario = async () => {
    if (!formData.nome || !formData.email || !formData.senha) {
      showToast('Preencha todos os campos', 'error');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.ADMINS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      showToast('Usuário criado com sucesso!', 'success');
      setShowCreateModal(false);
      setFormData({ nome: '', email: '', senha: '', role: 'user' });
      loadUsuarios();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Erro ao criar usuário', 'error');
    }
  };

  const handleDeleteUsuario = async () => {
    if (!selectedUsuario) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.ADMINS}/${selectedUsuario.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir usuário');
      }

      showToast('Usuário excluído com sucesso!', 'success');
      setShowDeleteModal(false);
      setSelectedUsuario(null);
      loadUsuarios();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Erro ao excluir usuário', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Configurações</h2>
            <p className="text-slate-400 mt-1">Gerencie os usuários do sistema</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-500/50"
          >
            <UserPlus className="w-5 h-5" />
            Novo Usuário
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <p className="mt-2 text-slate-400">Carregando...</p>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-emerald-500/20 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-emerald-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Função
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Criado em
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white font-medium">{usuario.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{usuario.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          usuario.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {usuario.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          usuario.ativo 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {usuario.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {new Date(usuario.criadoEm).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUsuario(usuario);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Excluir usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl border border-emerald-500/20 shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-emerald-500/20">
              <h3 className="text-xl font-bold text-white">Novo Usuário</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9.\s]/g, '');
                    setFormData({ ...formData, nome: value });
                  }}
                  placeholder="Digite o nome do usuário"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Digite o email"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">Senha</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder="Digite a senha"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">Função</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ nome: '', email: '', senha: '', role: 'user' });
                  }}
                  className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateUsuario}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-200 border border-emerald-500/50 text-sm"
                >
                  Criar Usuário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUsuario(null);
        }}
        onConfirm={handleDeleteUsuario}
        title="Confirmar Exclusão"
        message={`Deseja realmente excluir o usuário "${selectedUsuario?.nome}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmVariant="danger"
      />
    </AdminLayout>
  );
}
