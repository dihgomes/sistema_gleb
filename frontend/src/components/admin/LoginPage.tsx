import { useState, FormEvent } from 'react';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col relative">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <img 
          src="/santacasa-icon.png" 
          alt="Santa Casa Background" 
          className="min-w-full min-h-full object-cover opacity-[0.08]"
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
          <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white tracking-wide mb-2">
                Área Administrativa
              </h1>
              <div className="w-20 h-1 bg-white/30 mx-auto rounded-full mb-3" />
            </div>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Usuário"
                type="text"
                value={usuario}
                onChange={handleUsuarioChange}
                placeholder="Digite apenas letras"
                required
                autoComplete="username"
                maxLength={50}
              />

              <Input
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                autoComplete="current-password"
              />

              <Checkbox
                label="Lembrar-me"
                checked={lembrarMe}
                onChange={(e) => setLembrarMe(e.target.checked)}
              />

              <Button type="submit" isLoading={isLoading}>
                Entrar
              </Button>
            </form>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-5 text-center border-t border-emerald-100">
            <p className="text-sm font-medium text-emerald-800">
              Sistema de Validação de Carteiras
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              GLEB
            </p>
          </div>
        </div>
        </div>
      </div>

      <footer className="bg-gradient-to-r from-emerald-600/10 to-green-600/10 backdrop-blur-sm border-t border-emerald-200/50 py-4 relative z-10">
        <div className="text-center">
          <p className="text-sm text-emerald-800 font-semibold">
            © {new Date().getFullYear()} Santa Casa de Ruy Barbosa
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
