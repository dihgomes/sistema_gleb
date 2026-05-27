import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import { getToken, logout } from '../../utils/auth';

export default function TrocarSenhaPage() {
  const navigate = useNavigate();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [primeiroAcesso, setPrimeiroAcesso] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(2);

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

  useEffect(() => {
    const adminStr = localStorage.getItem('admin') || sessionStorage.getItem('admin');
    if (adminStr) {
      const admin = JSON.parse(adminStr);
      setPrimeiroAcesso(admin.primeiroAcesso || false);
    }
  }, []);

  const validarSenha = (senha: string): string | null => {
    if (senha.length < 6) {
      return 'Senha deve ter no mínimo 6 caracteres';
    }
    if (!/[A-Z]/.test(senha)) {
      return 'Senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/[a-z]/.test(senha)) {
      return 'Senha deve conter pelo menos uma letra minúscula';
    }
    if (!/\d/.test(senha)) {
      return 'Senha deve conter pelo menos um número';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
      return 'Senha deve conter pelo menos um caractere especial';
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!primeiroAcesso && !senhaAtual.trim()) {
      setError('Por favor, preencha a senha atual');
      return;
    }

    if (!novaSenha.trim()) {
      setError('Por favor, preencha a nova senha');
      return;
    }

    if (!confirmarSenha.trim()) {
      setError('Por favor, confirme a nova senha');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    const erroValidacao = validarSenha(novaSenha);
    if (erroValidacao) {
      setError(erroValidacao);
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
          senhaAtual: primeiroAcesso ? undefined : senhaAtual,
          novaSenha,
          primeiroAcesso
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao trocar senha');
      }

      const adminStr = localStorage.getItem('admin') || sessionStorage.getItem('admin');
      if (adminStr) {
        const admin = JSON.parse(adminStr);
        admin.primeiroAcesso = false;
        
        if (localStorage.getItem('admin')) {
          localStorage.setItem('admin', JSON.stringify(admin));
        } else {
          sessionStorage.setItem('admin', JSON.stringify(admin));
        }
      }

      setShowSuccessModal(true);
      setCountdown(2);
      
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/admin/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao trocar senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = () => {
    if (primeiroAcesso) {
      setShowConfirmModal(true);
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleConfirmarSaida = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-b border-emerald-500/20 px-6 py-5 text-center">
            <h2 className="text-xl font-bold text-white mb-1">
              {primeiroAcesso ? 'Primeiro Acesso' : 'Trocar Senha'}
            </h2>
            <p className="text-slate-400 text-xs">
              {primeiroAcesso 
                ? 'Por segurança, você deve criar uma nova senha' 
                : 'Altere sua senha de acesso'}
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2 backdrop-blur-sm">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {!primeiroAcesso && (
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Senha Atual</label>
                  <input
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="Digite sua senha atual"
                    required
                    className="w-full px-3 py-2 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">Nova Senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha"
                  required
                  className="w-full px-3 py-2 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">Confirmar Nova Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    required
                    className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                      confirmarSenha.length === 0 
                        ? 'border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500/20' 
                        : senhasCoinciden
                        ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20'
                        : 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {confirmarSenha.length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {senhasCoinciden ? (
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {confirmarSenha.length > 0 && !senhasCoinciden && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    As senhas não coincidem
                  </p>
                )}
                {senhasCoinciden && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    As senhas coincidem
                  </p>
                )}
              </div>

              <div className="bg-slate-900/30 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-slate-300 text-xs font-medium mb-2">A senha deve conter:</p>
                <ul className="space-y-1 text-xs">
                  <li className={`flex items-center gap-2 transition-colors ${requisitos.tamanho ? 'text-emerald-400' : 'text-red-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      {requisitos.tamanho ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      )}
                    </svg>
                    Mínimo de 6 caracteres
                  </li>
                  <li className={`flex items-center gap-2 transition-colors ${requisitos.maiuscula ? 'text-emerald-400' : 'text-red-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      {requisitos.maiuscula ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      )}
                    </svg>
                    Pelo menos uma letra maiúscula (A-Z)
                  </li>
                  <li className={`flex items-center gap-2 transition-colors ${requisitos.minuscula ? 'text-emerald-400' : 'text-red-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      {requisitos.minuscula ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      )}
                    </svg>
                    Pelo menos uma letra minúscula (a-z)
                  </li>
                  <li className={`flex items-center gap-2 transition-colors ${requisitos.numero ? 'text-emerald-400' : 'text-red-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      {requisitos.numero ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      )}
                    </svg>
                    Pelo menos um número (0-9)
                  </li>
                  <li className={`flex items-center gap-2 transition-colors ${requisitos.especial ? 'text-emerald-400' : 'text-red-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      {requisitos.especial ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      )}
                    </svg>
                    Pelo menos um caractere especial (!@#$%...)
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
                  onClick={handleCancelar}
                  className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200 text-sm"
                >
                  {primeiroAcesso ? 'Sair' : 'Cancelar'}
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
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl border border-emerald-500/20 shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Senha alterada com sucesso!
              </h3>
              
              <p className="text-slate-400 mb-6">
                Você será redirecionado para o dashboard em
              </p>

              <div className="relative w-24 h-24 mx-auto mb-6">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 * (1 - countdown / 2)}
                    className="text-emerald-500 transition-all duration-1000 ease-linear"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{countdown}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Aguarde ou será redirecionado automaticamente
              </p>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl border border-emerald-500/20 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Troca de senha obrigatória
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  Você precisa trocar sua senha no primeiro acesso. Deseja realmente sair do sistema?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all text-sm"
                  >
                    Continuar aqui
                  </button>
                  <button
                    onClick={handleConfirmarSaida}
                    className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-all text-sm"
                  >
                    Sair do sistema
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
