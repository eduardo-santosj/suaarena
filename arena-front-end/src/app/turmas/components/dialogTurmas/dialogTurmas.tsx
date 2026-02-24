import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTurmaNew } from '@/api/alunos/useNewTurma';
import { useAlert } from '@/hooks/useAlerts';
import { useAuth } from '@/hooks/useAuth';
import { Turma } from '@/types/model/turma';
import { Loader } from 'lucide-react';

type DialogTurmasProps = {
  open: boolean;
  title: string;
  turmaEdit?: Turma;
  onCloseAction: () => void;
};

export const DialogTurmas = ({
  open,
  title,
  turmaEdit,
  onCloseAction,
}: DialogTurmasProps) => {
  const alert = useAlert();
  const { canEdit } = useAuth();
  const [turmaForm, setTurmaForm] = useState<Omit<Turma, 'id'>>({
    nome: turmaEdit?.nome || '',
    horario: turmaEdit?.horario || '',
    capacidade_maxima: turmaEdit?.capacidade_maxima || 20,
    dias_semana: turmaEdit?.dias_semana || [],
  });
  
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>(turmaEdit?.dias_semana || []);
  
  useEffect(() => {
    if (turmaEdit) {
      setTurmaForm({
        nome: turmaEdit.nome || '',
        horario: turmaEdit.horario || '',
        capacidade_maxima: turmaEdit.capacidade_maxima || 20,
        dias_semana: turmaEdit.dias_semana || [],
      });
      setDiasSelecionados(turmaEdit.dias_semana || []);
    }
  }, [turmaEdit]);
  
  const diasSemana = [
    { id: 0, nome: 'Domingo' },
    { id: 1, nome: 'Segunda' },
    { id: 2, nome: 'Terça' },
    { id: 3, nome: 'Quarta' },
    { id: 4, nome: 'Quinta' },
    { id: 5, nome: 'Sexta' },
    { id: 6, nome: 'Sábado' }
  ];
  
  const toggleDia = (diaId: number) => {
    setDiasSelecionados(prev => 
      prev.includes(diaId) 
        ? prev.filter(id => id !== diaId)
        : [...prev, diaId]
    );
  };

  const needThisInformation = turmaForm.nome.trim() !== '' && turmaForm.horario.trim() !== '' && turmaForm.capacidade_maxima > 0 && diasSelecionados.length > 0;
  const { mutate: TurmaNew, isPending: isPendingNew } = useTurmaNew();

  const sendInfoTurma = async () => {
    const turmaData = {
      ...turmaForm,
      capacidade_maxima: Number(turmaForm.capacidade_maxima),
      dias_semana: diasSelecionados
    };
    
    TurmaNew(turmaData, {
      onSuccess: (response) => {
        if (response) {
          alert.show('success', 'Turma criada com sucesso!');
          onCloseAction();
        } else {
          alert.show('error', 'Erro ao criar Turma!');
        }
      },
      onError: () => {
        alert.show('error', 'Erro ao criar Turma!');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent
        className="max-h-[400px] bg-zinc-900 text-zinc-50 flex flex-col gap-0 px-0 pb-6"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="pb-6 px-6 text-lg font-semibold">
            {title === 'new' ? 'Nova Turma' : 'Editar Turma'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="pt-2 pb-8 px-6 grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium leading-5">Nome da Turma</p>
              <Input
                onChange={(e) => setTurmaForm(prev => ({ ...prev, nome: e.target.value }))}
                value={turmaForm.nome}
                placeholder="Nome da turma"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium leading-5">Horário</p>
              <Input
                onChange={(e) => setTurmaForm(prev => ({ ...prev, horario: e.target.value }))}
                value={turmaForm.horario}
                placeholder="Horário (ex: 07:00)"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium leading-5">Capacidade Máxima</p>
              <Input
                type="number"
                min="1"
                max="100"
                onChange={(e) => setTurmaForm(prev => ({ ...prev, capacidade_maxima: Number(e.target.value) }))}
                value={turmaForm.capacidade_maxima}
                placeholder="Número máximo de alunos"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium leading-5">Dias da Semana</p>
            <div className="grid grid-cols-1 gap-2">
              {diasSemana.map((dia) => (
                <div key={dia.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dia-${dia.id}`}
                    checked={diasSelecionados.includes(dia.id)}
                    onCheckedChange={() => toggleDia(dia.id)}
                  />
                  <label htmlFor={`dia-${dia.id}`} className="text-sm">
                    {dia.nome}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 px-6">
          <Button variant="outline" className="bg-zinc-900" onClick={onCloseAction}>
            Cancelar
          </Button>
          <Button
            className={`p-2 rounded-md bg-newyellow text-black font-medium text-sm [&:hover]:bg-newyellow-hover [&:hover]:text-white [&:focus]:!bg-newyellow-focus [&:focus]:text-black ${(isPendingNew || !canEdit()) && 'cursor-not-allowed opacity-75'}`}
            onClick={sendInfoTurma}
            disabled={!needThisInformation || !canEdit()}
          >
            {isPendingNew && <Loader className='animate-spin w-4 h-4'/>}
            {!isPendingNew && <>Salvar</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};