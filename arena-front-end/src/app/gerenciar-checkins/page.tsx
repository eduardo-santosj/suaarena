'use client';

import { useTurmas } from '@/api/alunos/useTurma';
import { useAprovarCheckin, useCheckinsPendentes } from '@/api/checkin/useGerenciarCheckins';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlert } from '@/hooks/useAlerts';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function GerenciarCheckinsPage() {
  const { hasPermission } = useAuth();
  const alert = useAlert();
  const { data: turmasData } = useTurmas();
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');
  const { data: checkinsData } = useCheckinsPendentes(turmaSelecionada);
  const aprovarMutation = useAprovarCheckin();
  
  const turmas = turmasData?.data || [];
  const checkinsPendentes = checkinsData?.data || [];

  const aprovarCheckin = async (id: number, status: 'confirmado' | 'rejeitado') => {
    try {
      await aprovarMutation.mutateAsync({ id, status });
      alert.show('success', `Checkin ${status}!`);
    } catch {
      alert.show('error', 'Erro ao processar checkin');
    }
  };

  if (!hasPermission(['admin', 'teacher'])) {
    return <div>Acesso negado. Apenas professores e administradores podem acessar esta página.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Check-ins</h1>
      
      <div className="mb-6">
        <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent>
            {turmas.map((turma) => (
              <SelectItem key={turma.id} value={turma.id.toString()}>
                {turma.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {turmaSelecionada && (
        <div className="grid gap-4">
          {checkinsPendentes.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">Nenhum check-in pendente para esta turma hoje.</p>
              </CardContent>
            </Card>
          ) : (
            checkinsPendentes.map((checkin) => (
              <Card key={checkin.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {checkin.nome}
                    <Badge variant="secondary">Pendente</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Check-in realizado: {new Date(checkin.data).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        variant="default"
                        onClick={() => aprovarCheckin(checkin.id, 'confirmado')}
                        disabled={aprovarMutation.isPending}
                      >
                        Aprovar
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => aprovarCheckin(checkin.id, 'rejeitado')}
                        disabled={aprovarMutation.isPending}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}