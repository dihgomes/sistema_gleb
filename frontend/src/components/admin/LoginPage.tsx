import { useState, FormEvent } from 'react';
import { Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/10 border-2 border-yellow-400/60 flex items-center justify-center shadow-xl mb-4">
              <Shield className="w-12 h-12 text-yellow-300" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">
              Área Administrativa
            </h1>
            <div className="mt-2 w-16 h-0.5 bg-yellow-400 mx-auto rounded-full" />
            <p className="mt-2 text-sm text-blue-200 uppercase tracking-wide">
              Sistema de Validação GLEB
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
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

          <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-600">
            Grande Loja Maçônica do Estado da Bahia
          </div>
        </div>
      </div>
    </div>
  );
}
