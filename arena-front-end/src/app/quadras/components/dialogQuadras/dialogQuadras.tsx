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

interface Quadra {
  id: number;
  nome: string;
  descricao: string;
}

type DialogQuadrasProps = {
  open: boolean;
  title: string;
  quadraEdit?: Quadra;
  onCloseAction: () => void;
};

export const DialogQuadras = ({
  open,
  title,
  quadraEdit,
  onCloseAction,
}: DialogQuadrasProps) => {
  const alert = useAlert();
  const queryClient = useQueryClient();
  const [quadraForm, setQuadraForm] = useState({
    nome: quadraEdit?.nome || '',
    descricao: quadraEdit?.descricao || '',
  });
  
  const [isPending, setIsPending] = useState(false);
  
  const needThisInformation = quadraForm.nome.trim() !== '';

  const sendInfoQuadra = async () => {
    setIsPending(true);
    try {
      const url = title === 'new' ? '/api/quadras' : `/api/quadras/${quadraEdit?.id}`;
      const method = title === 'new' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(quadraForm)
      });

      const data = await response.json();
      
      if (data.success) {
        alert.show('success', title === 'new' ? 'Quadra criada com sucesso!' : 'Quadra atualizada com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['quadras'] });
        onCloseAction();
      } else {
        alert.show('error', data.error || 'Erro ao salvar quadra!');
      }
    } catch {
      alert.show('error', 'Erro ao salvar quadra!');
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
            {title === 'new' ? 'Nova Quadra' : 'Editar Quadra'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="pt-2 pb-8 px-6 flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-5">Nome da Quadra</p>
            <Input
              onChange={(e) => setQuadraForm(prev => ({ ...prev, nome: e.target.value }))}
              value={quadraForm.nome}
              placeholder="Ex: Quadra 1"
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium leading-5">Descrição (opcional)</p>
            <Input
              onChange={(e) => setQuadraForm(prev => ({ ...prev, descricao: e.target.value }))}
              value={quadraForm.descricao}
              placeholder="Ex: Quadra de futebol society"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3 px-6">
          <Button variant="outline" className="bg-zinc-900" onClick={onCloseAction}>
            Cancelar
          </Button>
          <Button
            className={`p-2 rounded-md bg-newyellow text-black font-medium text-sm [&:hover]:bg-newyellow-hover [&:hover]:text-white [&:focus]:!bg-newyellow-focus [&:focus]:text-black ${isPending && 'cursor-not-allowed opacity-75'}`}
            onClick={sendInfoQuadra}
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