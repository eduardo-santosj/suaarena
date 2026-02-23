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
import { useAlert } from '@/hooks/useAlerts';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';

interface Plano {
  id: number;
  nome: string;
  treinos_por_semana: number;
  valor: number;
}

type DialogPlanosProps = {
  open: boolean;
  title: string;
  planoEdit?: Plano;
  onCloseAction: () => void;
};

export const DialogPlanos = ({
  open,
  title,
  planoEdit,
  onCloseAction,
}: DialogPlanosProps) => {
  const alert = useAlert();
  const queryClient = useQueryClient();
  const [planoForm, setPlanoForm] = useState({
    nome: planoEdit?.nome || '',
    treinos_por_semana: planoEdit?.treinos_por_semana || 1,
    valor: planoEdit?.valor || 0,
  });
  
  const [isPending, setIsPending] = useState(false);
  
  const needThisInformation = planoForm.nome.trim() !== '' && planoForm.treinos_por_semana > 0;

  const sendInfoPlano = async () => {
    setIsPending(true);
    try {
      const url = title === 'new' ? '/api/planos' : `/api/planos/${planoEdit?.id}`;
      const method = title === 'new' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(planoForm)
      });

      const data = await response.json();
      
      if (data.success) {
        alert.show('success', title === 'new' ? 'Plano criado com sucesso!' : 'Plano atualizado com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['planos'] });
        onCloseAction();
      } else {
        alert.show('error', data.error || 'Erro ao salvar plano!');
      }
    } catch {
      alert.show('error', 'Erro ao salvar plano!');
    } finally {
      setIsPending(false);
    }
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
            {title === 'new' ? 'Novo Plano' : 'Editar Plano'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="pt-2 pb-8 px-6 flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-5">Nome do Plano</p>
            <Input
              onChange={(e) => setPlanoForm(prev => ({ ...prev, nome: e.target.value }))}
              value={planoForm.nome}
              placeholder="Ex: Treino FTV"
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium leading-5">Treinos por Semana</p>
            <Input
              type="number"
              min="1"
              max="7"
              onChange={(e) => setPlanoForm(prev => ({ ...prev, treinos_por_semana: Number(e.target.value) }))}
              value={planoForm.treinos_por_semana}
              placeholder="Ex: 2"
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium leading-5">Valor (opcional)</p>
            <Input
              type="number"
              step="0.01"
              min="0"
              onChange={(e) => setPlanoForm(prev => ({ ...prev, valor: Number(e.target.value) }))}
              value={planoForm.valor}
              placeholder="Ex: 150.00"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3 px-6">
          <Button variant="outline" className="bg-zinc-900" onClick={onCloseAction}>
            Cancelar
          </Button>
          <Button
            className={`p-2 rounded-md bg-newyellow text-black font-medium text-sm [&:hover]:bg-newyellow-hover [&:hover]:text-white [&:focus]:!bg-newyellow-focus [&:focus]:text-black ${isPending && 'cursor-not-allowed opacity-75'}`}
            onClick={sendInfoPlano}
            disabled={!needThisInformation || isPending}
          >
            {isPending && <Loader className='animate-spin w-4 h-4'/>}
            {!isPending && <>Salvar</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};