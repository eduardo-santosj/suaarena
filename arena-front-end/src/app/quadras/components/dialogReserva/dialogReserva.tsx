import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAlert } from '@/hooks/useAlerts';
import { useQuadras } from '@/api/quadras/useQuadras';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';

type DialogReservaProps = {
  open: boolean;
  onCloseAction: () => void;
  onReservaCreated?: () => void;
};

export const DialogReserva = ({
  open,
  onCloseAction,
  onReservaCreated,
}: DialogReservaProps) => {
  const alert = useAlert();
  const queryClient = useQueryClient();
  const { data: quadrasData, isLoading: isLoadingQuadras } = useQuadras();
  
  const quadras = quadrasData?.data || [];
  const [reservaForm, setReservaForm] = useState({
    quadra_id: '',
    data_reserva: '',
    hora_inicio: '',
    hora_fim: '',
    descricao: '',
    valor: '',
    tipo_recorrencia: 'unica',
    dias_semana: [],
    data_fim: '',
  });
  
  const [displayValue, setDisplayValue] = useState('');
  
  const [isPending, setIsPending] = useState(false);
  
  const needThisInformation = 
    reservaForm.quadra_id !== '' && 
    reservaForm.data_reserva !== '' && 
    reservaForm.hora_inicio !== '' && 
    reservaForm.hora_fim !== '' &&
    reservaForm.valor !== '' &&
    (reservaForm.tipo_recorrencia === 'unica' || 
     (reservaForm.tipo_recorrencia !== 'unica' && reservaForm.data_fim !== ''));

  const validateHorarios = () => {
    if (reservaForm.hora_inicio >= reservaForm.hora_fim) {
      alert.show('error', 'Horário de início deve ser anterior ao horário de fim!');
      return false;
    }
    return true;
  };

  const sendInfoReserva = async () => {
    if (!validateHorarios()) return;
    
    setIsPending(true);
    try {
      const response = await fetch('/api/quadras/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reservaForm)
      });

      const data = await response.json();
      
      if (data.success) {
        alert.show('success', `${data.data.total} reserva(s) criada(s) com sucesso!`);
        setReservaForm({
          quadra_id: '',
          data_reserva: '',
          hora_inicio: '',
          hora_fim: '',
          descricao: '',
          valor: '',
          tipo_recorrencia: 'unica',
          dias_semana: [],
          data_fim: '',
        });
        setDisplayValue('');
        // Invalidar cache das reservas para atualizar calendário
        queryClient.invalidateQueries({ queryKey: ['reservas'] });
        onReservaCreated?.();
        onCloseAction();
      } else {
        alert.show('error', data.error || 'Erro ao criar reserva!');
      }
    } catch {
      alert.show('error', 'Erro ao criar reserva!');
    } finally {
      setIsPending(false);
    }
  };

  const horarios = Array.from({ length: 15 }, (_, i) => {
    const hora = 6 + i;
    return `${hora.toString().padStart(2, '0')}:00`;
  });

  const diasSemana = [
    { id: 0, nome: 'Domingo' },
    { id: 1, nome: 'Segunda-feira' },
    { id: 2, nome: 'Terça-feira' },
    { id: 3, nome: 'Quarta-feira' },
    { id: 4, nome: 'Quinta-feira' },
    { id: 5, nome: 'Sexta-feira' },
    { id: 6, nome: 'Sábado' },
  ];

  const handleDiaChange = (diaId: number, checked: boolean) => {
    setReservaForm(prev => ({
      ...prev,
      dias_semana: checked 
        ? [...prev.dias_semana, diaId]
        : prev.dias_semana.filter(d => d !== diaId)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] bg-zinc-900 text-zinc-50 flex flex-col gap-0 px-0 pb-6"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="pb-6 px-6 text-lg font-semibold">
            Nova Reserva
          </DialogTitle>
        </DialogHeader>
        
        <div className="pt-2 pb-8 px-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna 1 - Dados básicos */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium leading-5">Quadra</p>
                <Select 
                  value={reservaForm.quadra_id} 
                  onValueChange={(value) => setReservaForm(prev => ({ ...prev, quadra_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingQuadras ? "Carregando..." : "Selecione uma quadra"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingQuadras ? (
                      <SelectItem value="loading" disabled>
                        Carregando quadras...
                      </SelectItem>
                    ) : quadras.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Sem quadras cadastradas
                      </SelectItem>
                    ) : (
                      quadras.map((quadra) => (
                        <SelectItem key={quadra.id} value={quadra.id.toString()}>
                          {quadra.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium leading-5">Data</p>
                <Input
                  type="date"
                  onChange={(e) => setReservaForm(prev => ({ ...prev, data_reserva: e.target.value }))}
                  value={reservaForm.data_reserva}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-5">Horário Início</p>
                  <Select 
                    value={reservaForm.hora_inicio} 
                    onValueChange={(value) => setReservaForm(prev => ({ ...prev, hora_inicio: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Início" />
                    </SelectTrigger>
                    <SelectContent>
                      {horarios.map((hora) => (
                        <SelectItem key={hora} value={hora}>
                          {hora}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-5">Horário Fim</p>
                  <Select 
                    value={reservaForm.hora_fim} 
                    onValueChange={(value) => setReservaForm(prev => ({ ...prev, hora_fim: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Fim" />
                    </SelectTrigger>
                    <SelectContent>
                      {horarios.map((hora) => (
                        <SelectItem key={hora} value={hora}>
                          {hora}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium leading-5">Valor da Reserva</p>
                <Input
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    
                    if (numericValue === '') {
                      setDisplayValue('');
                      setReservaForm(prev => ({ ...prev, valor: '' }));
                      return;
                    }
                    
                    const formattedValue = new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    }).format(Number(numericValue) / 100);
                    
                    setDisplayValue(formattedValue);
                    setReservaForm(prev => ({ ...prev, valor: (Number(numericValue) / 100).toString() }));
                  }}
                  value={displayValue}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium leading-5">Descrição (opcional)</p>
                <Input
                  onChange={(e) => setReservaForm(prev => ({ ...prev, descricao: e.target.value }))}
                  value={reservaForm.descricao}
                  placeholder="Ex: Treino de futebol"
                />
              </div>
            </div>
            
            {/* Coluna 2 - Recorrência */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium leading-5">Tipo de Reserva</p>
                <Select 
                  value={reservaForm.tipo_recorrencia} 
                  onValueChange={(value) => setReservaForm(prev => ({ ...prev, tipo_recorrencia: value, dias_semana: [] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unica">Única</SelectItem>
                    <SelectItem value="diaria">Diária</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {reservaForm.tipo_recorrencia === 'semanal' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-5">Dias da Semana</p>
                  <div className="grid grid-cols-1 gap-2">
                    {diasSemana.map((dia) => (
                      <div key={dia.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dia-${dia.id}`}
                          checked={reservaForm.dias_semana.includes(dia.id)}
                          onCheckedChange={(checked) => handleDiaChange(dia.id, checked as boolean)}
                        />
                        <label htmlFor={`dia-${dia.id}`} className="text-sm">
                          {dia.nome}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {reservaForm.tipo_recorrencia !== 'unica' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-5">Data Final</p>
                  <Input
                    type="date"
                    onChange={(e) => setReservaForm(prev => ({ ...prev, data_fim: e.target.value }))}
                    value={reservaForm.data_fim}
                    min={reservaForm.data_reserva || new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 px-6">
          <Button variant="outline" className="bg-zinc-900" onClick={onCloseAction}>
            Cancelar
          </Button>
          <Button
            className={`p-2 rounded-md bg-newyellow text-black font-medium text-sm [&:hover]:bg-newyellow-hover [&:hover]:text-white [&:focus]:!bg-newyellow-focus [&:focus]:text-black ${isPending && 'cursor-not-allowed opacity-75'}`}
            onClick={sendInfoReserva}
            disabled={!needThisInformation || isPending}
          >
            {isPending && <Loader className='animate-spin w-4 h-4'/>}
            {!isPending && <>Criar Reserva</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};