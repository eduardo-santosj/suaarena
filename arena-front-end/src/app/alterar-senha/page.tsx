'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAlert } from '@/hooks/useAlerts';
import { api } from '@/api/api';

interface FormData {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

export default function AlterarSenhaPage() {
  const router = useRouter();
  const alert = useAlert();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const senhaAtual = watch('senhaAtual');
  const novaSenha = watch('novaSenha');

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
    if (senha === senhaAtual) return 'Nova senha não pode ser igual à senha atual';
    
    return true;
  };

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/trocar-senha', {
        senhaAtual: data.senhaAtual,
        novaSenha: data.novaSenha
      });
      
      alert.show('success', 'Senha alterada com sucesso!');
      router.back();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erro ao alterar senha';
      alert.show('error', errorMessage || 'Erro ao alterar senha');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Alterar Senha</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Nova Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="senhaAtual">Senha Atual</Label>
              <Input
                id="senhaAtual"
                type="password"
                {...register('senhaAtual', {
                  required: 'Senha atual é obrigatória'
                })}
              />
              {errors.senhaAtual && (
                <p className="text-sm text-red-500 mt-1">{errors.senhaAtual.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <Input
                id="novaSenha"
                type="password"
                {...register('novaSenha', {
                  required: 'Nova senha é obrigatória',
                  validate: validarSenha
                })}
              />
              {errors.novaSenha && (
                <p className="text-sm text-red-500 mt-1">{errors.novaSenha.message}</p>
              )}
              <div className="text-xs text-gray-600 mt-1">
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