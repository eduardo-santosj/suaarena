'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAlert } from '@/hooks/useAlerts';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/api/api';

interface FormData {
  novaSenha: string;
  confirmarSenha: string;
}

export default function TrocarSenhaPage() {
  const router = useRouter();
  const alert = useAlert();
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const novaSenha = watch('novaSenha');

  const getRedirectPath = () => {
    if (!user) return '/login';
    
    switch (user.userType) {
      case 'student':
        return '/login';
      case 'admin':
      case 'teacher':
        return '/alunos';
      case 'finance':
        return '/dashboard';
      default:
        return '/login';
    }
  };

  const validarSenha = (senha: string) => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /\d/.test(senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    const tamanhoMinimo = senha.length >= 8;

    if (!tamanhoMinimo) return 'Senha deve ter pelo menos 8 caracteres';
    if (!temMaiuscula) return 'Senha deve ter pelo menos uma letra maiúscula';
    if (!temMinuscula) return 'Senha deve ter pelo menos uma letra minúscula';
    if (!temNumero) return 'Senha deve ter pelo menos um número';
    if (!temEspecial) return 'Senha deve ter pelo menos um caractere especial';
    
    return true;
  };

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/trocar-senha', {
        senhaAtual: 'admin123',
        novaSenha: data.novaSenha
      });
      
      alert.show('success', 'Senha alterada com sucesso!');
      router.push(getRedirectPath());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erro ao alterar senha';
      alert.show('error', errorMessage || 'Erro ao alterar senha');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Primeiro Acesso</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Por segurança, você deve alterar sua senha no primeiro acesso
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <Input
                id="novaSenha"
                type="password"
                {...register('novaSenha', {
                  required: 'Nova senha é obrigatória',
                  validate: validarSenha
                })}
                placeholder="Digite a nova senha"
              />
              {errors.novaSenha && (
                <p className="text-sm text-red-500 mt-1">{errors.novaSenha.message}</p>
              )}
              <div className="text-xs text-gray-400 mt-1">
                <p>A senha deve conter:</p>
                <ul className="list-disc list-inside">
                  <li>Pelo menos 8 caracteres</li>
                  <li>Uma letra maiúscula</li>
                  <li>Uma letra minúscula</li>
                  <li>Um número</li>
                  <li>Um caractere especial</li>
                </ul>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                {...register('confirmarSenha', {
                  required: 'Confirmação de senha é obrigatória',
                  validate: (value) => 
                    value === novaSenha || 'Senhas não coincidem'
                })}
                placeholder="Confirme a nova senha"
              />
              {errors.confirmarSenha && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmarSenha.message}</p>
              )}
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}