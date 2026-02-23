
'use client';
import { useAllAlunos } from '@/api/alunos/useAlunoAll';
import { useNewMark } from '@/api/alunos/useNewMark';
import { useTurmas } from '@/api/alunos/useTurma';
import { SelectTurma } from '@/components/selectTurmas';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAlert } from '@/hooks/useAlerts';
import { cn } from '@/lib/utils';
import { Aluno } from '@/types/model/alunos';
import { ptBR } from 'date-fns/locale';
import { Check, ChevronsUpDown, Loader } from 'lucide-react';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

export default function PresencasPage() {
  const [alunoId, setAlunoId] = useState<string>('');
  const [turmaId, setTurmaId] = useState<string>('');
  const [data, setData] = useState<Date>(new Date());

  const [searchTerm, setSearchTerm] = useState('');
  const alert = useAlert();

  const {data: getAll } = useAllAlunos();

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const listAlunos = getAll?.data?.map((aluno: Aluno) => ({
    value: aluno.nome,
    label: aluno.nome,
  }))

  const { mutate: markNew, isPending: isPendingMark } = useNewMark();

  const registrarPresenca = async () => {
    const dataSend = {
      idAluno: getAll?.data?.find(aluno => aluno.nome === alunoId)?.id,
      idTurma: turmaId,
      data: data.toISOString().split('T')[0],
      horario: turmasData?.data.find(turma => turma.id.toString() === turmaId)?.horario || ''
    }

    markNew(dataSend, {
      onSuccess: () => {
        alert.show('success', 'Presença registrada com sucesso!');
      },
      onError: () => {
        alert.show('error','Erro ao tentar registrar a presença, tente novamente.');
      },
    })
  };

  const {data: turmasData } = useTurmas();



  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Registrar Presença</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">Aluno</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      aria-expanded={open}
                      className="w-full justify-between bg-zinc-800 border-zinc-700 text-zinc-50 [&:hover]:bg-zinc-700"
                    >
                      {value
                        ? listAlunos?.find((aluno) => aluno.value === value)?.label
                        : "Selecione um aluno..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Buscar aluno..." 
                        className="h-9" 
                        value={searchTerm} 
                        onValueChange={(value) => setSearchTerm(value)}
                      />
                      <CommandList>
                        <CommandGroup>
                          {listAlunos
                            ?.filter((aluno) => {
                              const termo = searchTerm.toLowerCase()
                              return (
                                aluno.label.toLowerCase().includes(termo) ||
                                aluno.value.toString().includes(termo)
                              )
                            }).map((aluno) => (
                            <CommandItem
                              key={aluno.value}
                              value={aluno.value}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue)
                                setOpen(false)
                                setAlunoId(currentValue)
                              }}
                            >
                              {aluno.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === aluno.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">Turma</label>
                {!turmasData ? (
                  <Button
                    disabled
                    className="w-full bg-zinc-800 border-zinc-700 text-zinc-50 [&:hover]:bg-zinc-700"
                  >
                    Carregando Turmas...
                  </Button>
                ) : (
                  <SelectTurma turmas={turmasData?.data || []} onChange={value => setTurmaId(value)} />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Data</label>
              <div className="[&_[data-selected-single=true]]:!bg-newyellow [&_[data-selected-single=true]]:!text-black">
                <Calendar
                  mode="single"
                  selected={data}
                  onSelect={setData}
                  className="rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-50"
                  captionLayout="dropdown"
                  locale={ptBR}
                  classNames={{
                    caption: "flex justify-center pt-1 relative items-center mb-4 text-zinc-50",
                    caption_dropdowns: "flex justify-center gap-2",
                    dropdown_month: "px-3 py-1 text-sm font-medium border border-zinc-600 rounded-md bg-zinc-700 text-zinc-50",
                    dropdown_year: "px-3 py-1 text-sm font-medium border border-zinc-600 rounded-md bg-zinc-700 text-zinc-50",
                    nav_button: "border-zinc-600 text-zinc-50 [&:hover]:bg-zinc-700",
                    day: "text-zinc-50 [&:hover]:bg-zinc-700",
                    day_today: "bg-zinc-700 text-zinc-50",
                  }}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <Button
              className="px-6 py-2 bg-newyellow text-black font-medium [&:hover]:bg-newyellow-hover [&:hover]:text-white [&:focus]:!bg-newyellow-focus [&:focus]:text-black disabled:cursor-not-allowed disabled:opacity-75"
              onClick={registrarPresenca}
              disabled={isPendingMark || !alunoId || !turmaId || !data}
            >
              {isPendingMark && <Loader className="w-4 h-4 animate-spin mr-2" />}
              Registrar Presença
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
