'use client';

import { api } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAlert } from '@/hooks/useAlerts';
import { Loader } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username: email,
        password,
      });

      if (response.data) {
        document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400`;
        document.cookie = `refreshToken=${response.data.refreshToken}; path=/; max-age=604800`;
        alert.show('success', 'Login realizado com sucesso!');
        window.location.href = '/alunos';
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      alert.show('error', 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-zinc-800 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Fazer Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email
              </label>
              <Input
                id="email"
                type="string"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Sua senha"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-newyellow text-black hover:bg-newyellow-hover"
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin mr-2" />}
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}