'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePerfil } from '@/api/perfil/usePerfil';

export default function MeuPerfilPage() {
  const { user } = useAuth();
  const { data: perfilResponse, isLoading } = usePerfil();
  
  const perfil = perfilResponse?.data;

  const getTipoBadge = (type: string) => {
    const colors = {
      admin: 'destructive',
      teacher: 'default',
      finance: 'secondary',
      student: 'outline'
    };
    return colors[type as keyof typeof colors] || 'outline';
  };

  const getTipoLabel = (type: string) => {
    const labels = {
      admin: 'Administrador',
      teacher: 'Professor',
      finance: 'Financeiro',
      student: 'Estudante'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
        <Card>
          <CardContent className="p-6">
            <p>Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Usuário</label>
              <p className="text-lg">{perfil?.username}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Tipo de Perfil</label>
              <div className="mt-1">
                <Badge variant={getTipoBadge(perfil?.type || '') as 'destructive' | 'default' | 'secondary' | 'outline'}>
                  {getTipoLabel(perfil?.type || '')}
                </Badge>
              </div>
            </div>
            
            {perfil?.nome && (
              <div>
                <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                <p className="text-lg">{perfil.nome}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {user?.userType === 'student' && perfil && (
          <Card>
            <CardHeader>
              <CardTitle>Informações do Aluno</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {perfil.turma && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Turma</label>
                  <p className="text-lg">{perfil.turma}</p>
                </div>
              )}
              
              {perfil.horario && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Horário</label>
                  <p className="text-lg">{perfil.horario}</p>
                </div>
              )}
              
              {perfil.valorPago !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Valor Mensal</label>
                  <p className="text-lg font-semibold text-green-600">
                    R$ {Number(perfil.valorPago).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}