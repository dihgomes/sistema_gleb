import { useState, FormEvent } from 'react';
import { API_ENDPOINTS } from '../../config/api';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrarMe, setLembrarMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, '');
    setUsuario(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usuario.trim()) {
      setError('Por favor, preencha o usuário');
      return;
    }

    if (!senha.trim()) {
      setError('Por favor, preencha a senha');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: usuario,
          senha: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      if (lembrarMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        localStorage.setItem('showLoginToast', 'true');
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('admin', JSON.stringify(data.admin));
        sessionStorage.setItem('showLoginToast', 'true');
      }

      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background com efeitos */}
      <div className="fixed inset-0 z-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <img 
            src="/santacasa-icon.png" 
            alt="Santa Casa Background" 
            className="w-[800px] h-[800px] object-contain"
          />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Container principal */}
      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Lado esquerdo - Branding */}
        <div className="hidden md:block text-white space-y-6">
          <div className="space-y-2">
            <p className="text-emerald-400 text-sm font-semibold tracking-wider uppercase">Sistema GLEB</p>
            <h1 className="text-6xl font-bold tracking-tight">
              Área
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Administrativa
              </span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
            Sistema de Validação de Carteiras
            <br />
            <span className="text-slate-500">Grande Loja Maçônica do Estado da Bahia</span>
          </p>
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Sistema Seguro e Confiável</span>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-2xl overflow-hidden">
            {/* Header do card */}
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-b border-emerald-500/20 p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
              <p className="text-slate-400 text-sm">Acesse sua conta administrativa</p>
            </div>

            {/* Formulário */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2 backdrop-blur-sm">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Usuário</label>
                  <input
                    type="text"
                    value={usuario}
                    onChange={handleUsuarioChange}
                    placeholder="Digite apenas letras"
                    required
                    autoComplete="username"
                    maxLength={50}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium">Senha</label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-emerald-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={lembrarMe}
                    onChange={(e) => setLembrarMe(e.target.checked)}
                    className="w-4 h-4 bg-slate-900/50 border-emerald-500/30 rounded text-emerald-500 focus:ring-emerald-500/20"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-slate-400">
                    Lembrar-me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Entrando...
                    </span>
                  ) : (
                    'ENTRAR'
                  )}
                </button>
              </form>
            </div>

            {/* Footer do card */}
            <div className="bg-gradient-to-r from-emerald-600/5 to-teal-600/5 border-t border-emerald-500/20 px-8 py-4 text-center">
              <p className="text-slate-400 text-xs">
                Sistema de Validação de Carteiras - GLEB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center z-10">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Santa Casa de Ruy Barbosa - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
