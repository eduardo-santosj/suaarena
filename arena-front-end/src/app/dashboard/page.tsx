'use client';

import { useDashboard } from '@/api/dashboard/useDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function DashboardPage() {
  const { hasPermission } = useAuth();
  
  const [dataInicio, setDataInicio] = useState(() => {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
    return trintaDiasAtras.toISOString().split('T')[0];
  });
  
  const [dataFim, setDataFim] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const { data: dashboardResponse, refetch } = useDashboard(dataInicio, dataFim);
  const dashboardData = dashboardResponse?.data || {
    totalAlunos: 0,
    totalTurmas: 0,
    presencasPeriodo: 0,
    receitaPeriodo: 0
  };
  
  const validarDatas = () => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diferenca = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diferenca > 30) {
      alert('O período não pode ser maior que 30 dias');
      return false;
    }
    
    if (inicio > fim) {
      alert('Data de início não pode ser maior que data fim');
      return false;
    }
    
    return true;
  };
  
  const handleDataChange = (tipo: 'inicio' | 'fim', valor: string) => {
    if (tipo === 'inicio') {
      setDataInicio(valor);
    } else {
      setDataFim(valor);
    }
  };



  if (!hasPermission(['admin', 'finance'])) {
    return <div>Acesso negado. Apenas administradores e financeiro podem acessar esta página.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
        
        <div className="flex gap-3 items-end">
          <div>
            <Label htmlFor="dataInicio" className="text-xs text-gray-600">Data Início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => handleDataChange('inicio', e.target.value)}
              className="w-36"
            />
          </div>
          <div>
            <Label htmlFor="dataFim" className="text-xs text-gray-600">Data Fim</Label>
            <Input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => handleDataChange('fim', e.target.value)}
              className="w-36"
            />
          </div>
          <Button onClick={() => validarDatas() && refetch()} size="sm">
            Filtrar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Novos Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalAlunos}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Turmas no Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalTurmas}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Presenças no Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.presencasPeriodo}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Receita no Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {dashboardData.receitaPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Financeiros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Análise de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}