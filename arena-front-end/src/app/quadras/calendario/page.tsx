'use client';

import { useQuadras } from '@/api/quadras/useQuadras';
import { useReservas } from '@/api/quadras/useReservas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DialogReserva } from '../components';

export default function CalendarioQuadrasPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [visualizacao, setVisualizacao] = useState<'semana' | 'mes'>('semana');
  const [dataAtual, setDataAtual] = useState(new Date());
  const [showReservaDialog, setShowReservaDialog] = useState(false);
  const [quadraFiltro, setQuadraFiltro] = useState<string>('todas');

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Calcular período para buscar reservas
  const periodo = useMemo(() => {
    if (visualizacao === 'semana') {
      const weekDays = getWeekDays(dataAtual);
      return {
        data_inicio: formatDate(weekDays[0]),
        data_fim: formatDate(weekDays[6])
      };
    } else {
      const monthDays = getMonthDays(dataAtual);
      return {
        data_inicio: formatDate(monthDays[0]),
        data_fim: formatDate(monthDays[41])
      };
    }
  }, [dataAtual, visualizacao]);

  const { data: reservasData, refetch: refetchReservas } = useReservas(periodo);
  const { data: quadrasData } = useQuadras();
  
  const todasReservas = reservasData?.data || [];
  const quadras = quadrasData?.data || [];
  
  // Filtrar reservas por quadra se selecionada
  const reservas = quadraFiltro === 'todas' 
    ? todasReservas 
    : todasReservas.filter(r => r.quadra_id.toString() === quadraFiltro);

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const horarios = Array.from({ length: 15 }, (_, i) => `${6 + i}:00`);

  const getReservasForDateTime = (date: Date, hora: string) => {
    const dateStr = formatDate(date);
    return reservas.filter(r => 
      r.data_reserva === dateStr && 
      r.hora_inicio <= hora && 
      r.hora_fim > hora
    );
  };

  const getReservasForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return reservas.filter(r => r.data_reserva === dateStr);
  };

  const getReservaColor = (tipo: string) => {
    switch (tipo) {
      case 'unica':
        return 'bg-newyellow text-black';
      case 'diaria':
        return 'bg-blue-500 text-white';
      case 'semanal':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(dataAtual);
    newDate.setDate(dataAtual.getDate() + (direction === 'next' ? 7 : -7));
    setDataAtual(newDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(dataAtual);
    newDate.setMonth(dataAtual.getMonth() + (direction === 'next' ? 1 : -1));
    setDataAtual(newDate);
  };

  if (!isAdmin()) {
    return <div>Acesso negado. Apenas administradores podem acessar esta página.</div>;
  }

  const weekDays = getWeekDays(dataAtual);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Button 
          variant="outline"
          className="bg-transparent border-zinc-800 p-2 text-zinc-50 [&:hover]:bg-newyellow-hover [&:hover]:text-black focus-visible:bg-zinc-100 focus-visible:text-black"
          onClick={() => router.push('/quadras')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <h1 className="text-xl font-bold">Calendário de Quadras</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Legenda:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-newyellow rounded"></div>
              <span>Única</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Diária</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Semanal</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={quadraFiltro} onValueChange={setQuadraFiltro}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por quadra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as quadras</SelectItem>
              {quadras.map((quadra) => (
                <SelectItem key={quadra.id} value={quadra.id.toString()}>
                  {quadra.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={visualizacao} onValueChange={(value: 'semana' | 'mes') => setVisualizacao(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mês</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => visualizacao === 'semana' ? navigateWeek('prev') : navigateMonth('prev')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <span className="font-medium min-w-[200px] text-center">
            {visualizacao === 'semana' 
              ? `${weekDays[0].toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`
              : dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
            }
          </span>
          
          <Button variant="outline" onClick={() => visualizacao === 'semana' ? navigateWeek('next') : navigateMonth('next')}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button
            className="bg-newyellow text-black font-medium [&:hover]:bg-newyellow-hover [&:hover]:text-white [&:focus]:!bg-newyellow-focus [&:focus]:text-black"
            onClick={() => setShowReservaDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Nova Reserva
          </Button>
        </div>
      </div>

      {visualizacao === 'semana' && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">Visualização Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-1">
              <div className="p-2 font-medium text-zinc-100 border-r border-zinc-700">Horário</div>
              {weekDays.map((day, index) => (
                <div key={index} className="p-2 font-medium text-center text-zinc-100 border-r border-zinc-700">
                  <div>{diasSemana[day.getDay()]}</div>
                  <div className="text-sm text-zinc-400">
                    {day.getDate()}/{day.getMonth() + 1}
                  </div>
                </div>
              ))}
              
              {horarios.map((hora) => (
                <>
                  <div key={hora} className="p-2 text-sm font-medium border-r border-zinc-700 text-zinc-100">
                    {hora}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const reservasHora = getReservasForDateTime(day, hora);
                    return (
                      <div key={`${hora}-${dayIndex}`} className="p-1 min-h-[60px] border border-zinc-700 bg-zinc-800">
                        {reservasHora.map((reserva) => (
                          <Badge 
                            key={reserva.id} 
                            className={`text-xs mb-1 block truncate ${getReservaColor(reserva.tipo_recorrencia)}`}
                            title={`${reserva.quadra_nome} - ${reserva.tipo_recorrencia} - R$ ${reserva.valor}`}
                          >
                            {reserva.quadra_nome}
                          </Badge>
                        ))}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {visualizacao === 'mes' && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">Visualização Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {diasSemana.map((dia) => (
                <div key={dia} className="p-2 font-medium text-center text-zinc-100 border-b border-zinc-700">
                  {dia}
                </div>
              ))}
              
              {getMonthDays(dataAtual).map((day, index) => {
                const isCurrentMonth = day.getMonth() === dataAtual.getMonth();
                const reservasDay = getReservasForDate(day);
                const isToday = formatDate(day) === formatDate(new Date());
                
                return (
                  <div 
                    key={index} 
                    className={`p-2 min-h-[100px] border border-zinc-700 ${
                      isCurrentMonth ? 'bg-zinc-800' : 'bg-zinc-900'
                    } ${
                      isToday ? 'ring-2 ring-newyellow' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? 'text-zinc-100' : 'text-zinc-500'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {reservasDay.slice(0, 3).map((reserva) => (
                        <div 
                          key={reserva.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${getReservaColor(reserva.tipo_recorrencia)}`}
                          title={`${reserva.quadra_nome} - ${reserva.hora_inicio.slice(0,5)}-${reserva.hora_fim.slice(0,5)} - ${reserva.tipo_recorrencia} - R$ ${reserva.valor}`}
                        >
                          {reserva.quadra_nome}
                        </div>
                      ))}
                      {reservasDay.length > 3 && (
                        <div className="text-xs text-zinc-400">
                          +{reservasDay.length - 3} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      <DialogReserva
        open={showReservaDialog}
        onCloseAction={() => setShowReservaDialog(false)}
        onReservaCreated={() => {
          refetchReservas();
        }}
      />
    </div>
  );
}