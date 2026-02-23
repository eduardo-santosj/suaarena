import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChangeEvent,
  useState
} from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { useMarksId } from '@/api/alunos/useMarkId';
import { useAlunoNew } from '@/api/alunos/useNewAluno';
import { useUpdateAluno } from '@/api/alunos/useUpdateAluno';
import { SelectTurma } from '@/components/selectTurmas';
import { SelectPlano } from '@/components/selectPlanos';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { useAlert } from '@/hooks/useAlerts';
import { Aluno } from '@/types/model/alunos';
import { Turma } from '@/types/model/turma';
import { Loader } from 'lucide-react';

type EditClientDialogProps = {
  open: boolean;
  title: string;
  AlunoId: string;
  userEdit?: Aluno;
  onCloseAction: () => void;
  turmas?: Turma[];
  planos?: { id: number; nome: string; treinos_por_semana: number; }[];
};

export const DialogAlunos = ({
  open,
  title,
  AlunoId,
  userEdit,
  onCloseAction,
  turmas,
  planos,
}: EditClientDialogProps) => {
  const alert = useAlert();
  const [alunoForm, setalunoForm] = useState<Aluno>(
    userEdit || {
      id: 0,
      nome: '',
      cpf: '',
      email: '',
      status: title === 'new' ? 1 : 0,
      idTurma: 0,
      nomeTurma: '',
      idPlano: 0,
      nomePlano: '',
      valor_pago: '',
    },
  );
  const needThisInformation = alunoForm.nome.trim() !== '' 
  const { mutate: AlunoNew, isPending: isPendingNew } = useAlunoNew();
  const { mutate: onUpdateAluno, isPending: isPendingUpdate } = useUpdateAluno();

  const { data: marksCheck } = useMarksId(AlunoId);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [displayValue, setDisplayValue] = useState('');
  const values = marksCheck?.map(mark => {
    const date = new Date(mark.data)
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
  }) || []
  
  const currentMonthValues = values.filter(date => 
    date.getMonth() === currentMonth.getMonth() && 
    date.getFullYear() === currentMonth.getFullYear()
  )
  
  const currentMonthMarks = marksCheck?.filter(mark => {
    const markDate = new Date(mark.data)
    const adjustedDate = new Date(markDate.getTime() + markDate.getTimezoneOffset() * 60000)
    return adjustedDate.getMonth() === currentMonth.getMonth() && 
           adjustedDate.getFullYear() === currentMonth.getFullYear()
  }) || []

  const sendFormAluno = (
    event: ChangeEvent<HTMLInputElement> | boolean | string | null,
    input: string,
  ) => {
    let value;
    console.log(event, input);
    if (typeof event === 'boolean' || typeof event === 'string' || event === null) {
      value = event;
    } else {
      value = event.target.value;
    }

    setalunoForm((prev) => ({
      ...prev,
      [input]: value,
    }));
  };

  const sendInfoAluno = async () => {
    if (title === 'new') {
      AlunoNew(alunoForm, {
        onSuccess: (response) => {
          if (response) {
            alert.show('success', 'Aluno criado com sucesso!');
            onCloseAction();
          } else {
            alert.show('error', 'Erro ao criar Aluno!');
          }
        },
        onError: () => {
          alert.show('error', 'Erro ao criar Aluno!');
        }
      });
    } else {
     onUpdateAluno({ alunoId: AlunoId.toString(), updatedAlunoResult: alunoForm }, {
      onSuccess: (response) => {
        if (response) {
          alert.show('success', 'Status do Aluno atualizado com sucesso!');
          onCloseAction();
        } else {
          alert.show('error', 'Erro ao atualizar status do Aluno!');
        }
      },
      onError: () => {
        alert.show('error', 'Erro ao criar Aluno!');
      }
    });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent
        className="max-h-[500px] min-w-max overflow-x-auto  bg-zinc-900 text-zinc-50 flex flex-col gap-0 px-0 pb-6"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="pb-6 px-6 text-lg font-semibold">
            {title === 'new' ? 'Novo Aluno' : `Editar Aluno`}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-2 pb-8 px-6 flex gap-4 flex-col lg:flex-row">
          <div className="flex flex-col gap-4 justify-center pt-2">
            <div className="w-full h-full flex flex-col gap-3">
              <div className="flex justify-between flex-col">
                <p className="text-sm font-medium leading-5 pb-2">Nome</p>
                <Input
                  onChange={(e) => sendFormAluno(e, 'nome')}
                  value={alunoForm?.nome || ''}
                />
              </div>
              <div className="flex justify-between flex-col">
                <p className="text-sm font-medium leading-5 pb-2">CPF</p>
                <Input
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const maskedValue = value
                      .replace(/(\d{3})(\d)/, '$1.$2')
                      .replace(/(\d{3})(\d)/, '$1.$2')
                      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    e.target.value = maskedValue;
                    sendFormAluno(e, 'cpf');
                  }}
                  value={alunoForm?.cpf || ''}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
              <div className="flex justify-between flex-col">
                <p className="text-sm font-medium leading-5 pb-2">Email</p>
                <Input
                  type="email"
                  onChange={(e) => sendFormAluno(e, 'email')}
                  value={alunoForm?.email || ''}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="flex justify-between flex-col">
                <p className="text-sm font-medium leading-5 pb-2">Turma</p>
                <SelectTurma value={alunoForm?.idTurma.toString()} turmas={turmas || []} onChange={value => sendFormAluno(value, 'idTurma')} />
              </div>
              <div className="flex justify-between flex-col">
                <p className="text-sm font-medium leading-5 pb-2">Plano</p>
                <SelectPlano value={alunoForm?.idPlano?.toString() || '0'} planos={planos || []} onChange={value => sendFormAluno(value === '0' ? null : value, 'idPlano')} />
              </div>
              <div className="flex justify-between flex-col">
                <p className="text-sm font-medium leading-5 pb-2">Valor Mensal</p>
                <Input
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    
                    if (numericValue === '') {
                      setDisplayValue('');
                      sendFormAluno('', 'valor_pago');
                      return;
                    }
                    
                    const formattedValue = new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    }).format(Number(numericValue) / 100);
                    
                    setDisplayValue(formattedValue);
                    sendFormAluno((Number(numericValue) / 100).toString(), 'valor_pago');
                  }}
                  value={displayValue || (alunoForm?.valor_pago ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                  }).format(Number(alunoForm.valor_pago)) : '')}
                  placeholder="R$ 0,00"
                />
              </div>
              {title !== 'new' && (
                <div className="flex items-center justify-between">
                  <Switch
                    checked={Boolean(alunoForm?.status)}
                    onCheckedChange={(value) => {
                      sendFormAluno(value, 'status');
                    }}
                    className='data-[state=checked]:bg-newyellow'
                  />
                </div>
              )}
            </div>
          </div>
          {title === 'edit' && (
            <div
              className={`flex gap-4 justify-center pt-2`}
            >
              <Calendar
                mode="multiple"
                numberOfMonths={1}
                selected={currentMonthValues}
                onSelect={() => {}}
                disabled={() => true}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={ptBR}
                className="rounded-lg border shadow-sm"
                classNames={{
                  selected: "bg-newyellow text-black hover:bg-newyellow hover:text-black focus:bg-newyellow focus:text-black",
                }}
              />
              <div className="mt-3 p-3 bg-zinc-800 rounded-lg max-h-32 overflow-y-auto">
                <h4 className="text-sm font-medium mb-2">Horários:</h4>
                <div className="space-y-1">
                  {currentMonthMarks.length > 0 ? (
                    currentMonthMarks.map((mark) => (
                      <div key={mark.id} className="text-xs text-newyellow-hover flex justify-between">
                        <span>{format(new Date(new Date(mark.data).getTime() + new Date(mark.data).getTimezoneOffset() * 60000), "dd/MM")}</span>
                        <span className='px-1'>{` - `}</span>
                        <span>{mark.horario.slice(0, 5)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-zinc-400 text-center py-2">
                      Nenhuma presença registrada neste mês
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter className="flex gap-3 px-6">
          <Button variant="outline" className="bg-zinc-900" onClick={onCloseAction}>
            Cancelar
          </Button>
          <Button
            className={`p-2 rounded-md bg-newyellow text-black font-medium text-sm [&:hover]:bg-newyellow-hover [&:hover]:text-white [&:focus]:!bg-newyellow-focus [&:focus]:text-black ${(isPendingNew || isPendingUpdate) && 'cursor-not-allowed opacity-75'}`}
            onClick={() => sendInfoAluno()}
            disabled={!needThisInformation}
          >
            {(isPendingNew || isPendingUpdate) && (
              <Loader className='animate-spin w-4 h-4'/>
            )}
            {!(isPendingNew || isPendingUpdate) && (
              <>
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
