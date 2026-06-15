import { useState, FormEvent } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { getToken } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { showToast } = useToast();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requisitos = {
    tamanho: novaSenha.length >= 6,
    maiuscula: /[A-Z]/.test(novaSenha),
    minuscula: /[a-z]/.test(novaSenha),
    numero: /\d/.test(novaSenha),
    especial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(novaSenha)
  };

  const requisitosAtendidos = Object.values(requisitos).filter(Boolean).length;
  const porcentagem = (requisitosAtendidos / 5) * 100;
  const senhasCoinciden = confirmarSenha.length > 0 && novaSenha === confirmarSenha;

  const validarSenha = (senha: string): string | null => {
    if (senha.length < 6) return 'Senha deve ter no mínimo 6 caracteres';
    if (!/[A-Z]/.test(senha)) return 'Senha deve conter pelo menos uma letra maiúscula';
    if (!/[a-z]/.test(senha)) return 'Senha deve conter pelo menos uma letra minúscula';
    if (!/\d/.test(senha)) return 'Senha deve conter pelo menos um número';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) return 'Senha deve conter pelo menos um caractere especial';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!senhaAtual.trim()) {
      showToast('Por favor, preencha a senha atual', 'error');
      return;
    }

    if (!novaSenha.trim()) {
      showToast('Por favor, preencha a nova senha', 'error');
      return;
    }

    if (!confirmarSenha.trim()) {
      showToast('Por favor, confirme a nova senha', 'error');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    const erroValidacao = validarSenha(novaSenha);
    if (erroValidacao) {
      showToast(erroValidacao, 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.TROCAR_SENHA, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          senhaAtual,
          novaSenha,
          primeiroAcesso: false
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao trocar senha');
      }

      showToast('Senha alterada com sucesso!', 'success');
      handleClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao trocar senha', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl border border-emerald-500/20 shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-emerald-500/20">
          <h3 className="text-xl font-bold text-white">Alterar Senha</h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Senha Atual</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="Digite sua senha atual"
                className="w-full px-3 py-2 pr-10 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Nova Senha</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Digite sua nova senha"
                className="w-full px-3 py-2 pr-10 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Confirmar Nova Senha</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme sua nova senha"
                className={`w-full px-3 py-2 pr-10 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                  confirmarSenha.length === 0 
                    ? 'border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500/20' 
                    : senhasCoinciden
                    ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20'
                    : 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmarSenha.length > 0 && !senhasCoinciden && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                As senhas não coincidem
              </p>
            )}
            {senhasCoinciden && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                As senhas coincidem
              </p>
            )}
          </div>

          <div className="bg-slate-900/30 border border-emerald-500/20 rounded-lg p-3">
            <p className="text-slate-300 text-xs font-medium mb-2">A senha deve conter:</p>
            <ul className="space-y-1 text-xs">
              <li className={`flex items-center gap-2 ${requisitos.tamanho ? 'text-emerald-400' : 'text-slate-400'}`}>
                <span>{requisitos.tamanho ? '✓' : '○'}</span>
                Mínimo de 6 caracteres
              </li>
              <li className={`flex items-center gap-2 ${requisitos.maiuscula ? 'text-emerald-400' : 'text-slate-400'}`}>
                <span>{requisitos.maiuscula ? '✓' : '○'}</span>
                Pelo menos uma letra maiúscula
              </li>
              <li className={`flex items-center gap-2 ${requisitos.minuscula ? 'text-emerald-400' : 'text-slate-400'}`}>
                <span>{requisitos.minuscula ? '✓' : '○'}</span>
                Pelo menos uma letra minúscula
              </li>
              <li className={`flex items-center gap-2 ${requisitos.numero ? 'text-emerald-400' : 'text-slate-400'}`}>
                <span>{requisitos.numero ? '✓' : '○'}</span>
                Pelo menos um número
              </li>
              <li className={`flex items-center gap-2 ${requisitos.especial ? 'text-emerald-400' : 'text-slate-400'}`}>
                <span>{requisitos.especial ? '✓' : '○'}</span>
                Pelo menos um caractere especial
              </li>
            </ul>

            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">Força da senha</span>
                <span className={`text-xs font-medium ${
                  porcentagem === 100 ? 'text-emerald-400' : 
                  porcentagem >= 60 ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {porcentagem.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    porcentagem === 100 ? 'bg-emerald-500' : 
                    porcentagem >= 60 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${porcentagem}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/50 text-sm"
            >
              {isLoading ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
