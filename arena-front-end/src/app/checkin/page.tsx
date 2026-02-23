'use client';

import { useFazerCheckin, useStatusCheckin, useTurmasDia, useVagas } from '@/api/checkin/useCheckin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Turma {
  id: number;
  nome: string;
  horario: string;
  capacidade_maxima: number;
}


export default function CheckinPage() {
  const { isStudent } = useAuth();
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const { data: turmasData, isLoading } = useTurmasDia(dataSelecionada);
  const fazerCheckinMutation = useFazerCheckin();
  
  const turmas = turmasData?.data || [];
  
  const getDiaSemana = (data: string) => {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[new Date(data + 'T12:00:00').getDay()];
  };
  
  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };
  
  const proximosDias = () => {
    const dias = [];
    let diasAdicionados = 0;
    let i = 0;
    
    while (diasAdicionados < 7) {
      const data = new Date();
      data.setDate(data.getDate() + i);
      const diaSemana = data.getDay(); // 0=domingo, 1=segunda, ..., 6=sábado
      
      // Apenas dias úteis (segunda a sexta)
      if (diaSemana >= 1 && diaSemana <= 5) {
        dias.push(data.toISOString().split('T')[0]);
        diasAdicionados++;
      }
      i++;
    }
    
    return dias;
  };
  
  const mudarDia = (direcao: 'anterior' | 'proximo') => {
    const diasDisponiveis = proximosDias();
    const indiceAtual = diasDisponiveis.indexOf(dataSelecionada);
    
    if (direcao === 'anterior' && indiceAtual > 0) {
      setDataSelecionada(diasDisponiveis[indiceAtual - 1]);
    } else if (direcao === 'proximo' && indiceAtual < diasDisponiveis.length - 1) {
      setDataSelecionada(diasDisponiveis[indiceAtual + 1]);
    }
  };

  const fazerCheckin = async (idTurma: number) => {
    try {
      await fazerCheckinMutation.mutateAsync({ idTurma });
      alert('Checkin realizado! Aguarde aprovação do professor.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Erro ao fazer checkin';
      alert(errorMessage || 'Erro ao fazer checkin');
    }
  };

  const TurmaCard = ({ turma }: { turma: Turma }) => {
    const { data: vagasInfo } = useVagas(turma.id);
    const { data: statusInfo } = useStatusCheckin(turma.id);
    
    const jaFezCheckin = statusInfo?.jaFezCheckin || false;
    
    // Verificar se está dentro do prazo (2 horas antes)
    const agora = new Date();
    const horarioTurma = new Date(dataSelecionada + 'T' + turma.horario + ':00');
    const duasHorasAntes = new Date(horarioTurma.getTime() - 2 * 60 * 60 * 1000);
    const dentroDosPrazo = agora < duasHorasAntes;
    
    // Verificar se atingiu capacidade máxima
    const capacidadeEsgotada = vagasInfo ? vagasInfo.checkinsPendentes >= turma.capacidade_maxima : false;
    
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{turma.nome}</CardTitle>
          <Badge 
            variant={vagasInfo?.turmaLotada ? "destructive" : jaFezCheckin ? "secondary" : "default"}
            className="w-fit"
          >
            {jaFezCheckin ? 'Check-in Feito' : vagasInfo ? `${vagasInfo.vagasDisponiveis} vagas` : 'Carregando...'}
          </Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Horário: {turma.horario}</p>
            {vagasInfo && (
              <p className="text-sm text-gray-600">
                Capacidade: {vagasInfo.checkinsPendentes}/{vagasInfo.capacidadeMaxima}
              </p>
            )}
            <Button 
              onClick={() => fazerCheckin(turma.id)}
              disabled={fazerCheckinMutation.isPending || vagasInfo?.turmaLotada || jaFezCheckin || !dentroDosPrazo || capacidadeEsgotada}
              className="w-full"
              size="sm"
            >
              {jaFezCheckin ? 'Realizado' : 
               !dentroDosPrazo ? 'Prazo Encerrado' :
               capacidadeEsgotada ? 'Capacidade Esgotada' :
               vagasInfo?.turmaLotada ? 'Lotada' : 'Check-in'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!isStudent()) {
    return <div>Acesso negado. Apenas estudantes podem acessar esta página.</div>;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Check-in de Aulas</h1>
        <p>Carregando turmas...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Check-in de Aulas</h1>
        
        {/* Seletor de dias */}
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => mudarDia('anterior')}
            disabled={proximosDias().indexOf(dataSelecionada) <= 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-2 overflow-x-auto">
            {proximosDias().map((dia) => {
              const isSelected = dia === dataSelecionada;
              const isToday = dia === new Date().toISOString().split('T')[0];
              
              return (
                <Button
                  key={dia}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDataSelecionada(dia)}
                  className={`min-w-[100px] flex-col h-auto py-2 ${
                    isToday ? 'border-blue-500' : ''
                  }`}
                >
                  <span className="text-xs">{getDiaSemana(dia)}</span>
                  <span className="text-sm font-semibold">
                    {formatarData(dia).split('/').slice(0, 2).join('/')}
                  </span>
                </Button>
              );
            })}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => mudarDia('proximo')}
            disabled={proximosDias().indexOf(dataSelecionada) >= proximosDias().length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-gray-600">
          Turmas disponíveis para {getDiaSemana(dataSelecionada)}, {formatarData(dataSelecionada)}
        </p>
      </div>
      
      {turmas.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Nenhuma turma disponível para hoje.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {turmas.map((turma) => (
            <TurmaCard key={turma.id} turma={turma} />
          ))}
        </div>
      )}
    </div>
  );
}