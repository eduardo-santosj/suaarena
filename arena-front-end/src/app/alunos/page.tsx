
'use client';
import { useAlunos } from '@/api/alunos/useAluno';
import { useAlunoId } from '@/api/alunos/useAlunoId';
import { useTurmas } from '@/api/alunos/useTurma';
import { usePlanos } from '@/api/planos/usePlanos';
import { useUpdateAluno } from '@/api/alunos/useUpdateAluno';
import { DataTable } from '@/components/dataTable';
import { SelectTurma } from '@/components/selectTurmas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import { useAlert } from '@/hooks/useAlerts';
import { Aluno } from '@/types/model/alunos';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, PlusCircle } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { SelectStatus } from './components';
import { DialogAlunos } from './components/dialogAlunos';

type InfoDialogClient = {
  open: boolean;
  type: string;
  alunoId: string;
};

export default function AlunosPage() {
  const alert = useAlert();

  const [filtros, setFiltros] = useState({ nome: '', status: '', idTurma: '', perPage: 20 });
  const [currentPage, setCurrentPage] = useState(1);

  const [openDialogAluno, setopenDialogAluno] = useState<InfoDialogClient>({
    open: false,
    type: '',
    alunoId: '',
  });
  
  const alunos = useAlunos({
    page: currentPage,
    status: filtros.status,
    nome: filtros.nome,
    perPage: filtros.perPage,
    idTurma: filtros.idTurma,
  });

  const {data: turmasData } = useTurmas();
  const {data: planosData } = usePlanos();

  const { mutate: onUpdateAluno } = useUpdateAluno();
  const { data: alunoEdit } = useAlunoId(openDialogAluno.alunoId);

  async function handleEdit(aluno: Aluno) {
    setopenDialogAluno({ open: true, alunoId: aluno.id.toString(), type: 'edit' });
  }

  async function handleNewAluno() {
    setopenDialogAluno({ open: true, alunoId: '', type: 'new' });
  }

  const validateOpenDialog =
    (openDialogAluno.type === 'edit' && !!alunoEdit) || openDialogAluno.type === 'new';

  const currentPageData = alunos.data?.data ?? [];


const updateStatus = useCallback((alunoId: string, updatedAlunoResult: Partial<Aluno>) => {
    const data = {
      alunoId,
      updatedAlunoResult,
    };
    onUpdateAluno( data, {
      onSuccess: (response) => {
        if (response) {
          alert.show('success', 'Status do Aluno atualizado com sucesso!');
        } else {
          alert.show('error', 'Erro ao atualizar status do Aluno!');
        }
      },
      onError: () => {
        alert.show('error', 'Erro ao criar Aluno!');
      }
    });
  }, [alert, onUpdateAluno],
  );


  const columns = useMemo<ColumnDef<Aluno>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: () => (
          <div
            className="flex items-center cursor-pointer"
          >
            Nome
          </div>
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-sm leading-5 text-zinc-100">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'Turma',
        header: () => (
          <div
            className="flex items-center cursor-pointer"
          >
            Turma
          </div>
        ),
        cell: ({ row }) => {
          return (
            <span className="font-medium text-sm leading-5 text-zinc-100">
              {row.original.nomeTurma}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: () => (
          <div
            className="flex items-center cursor-pointer"
          >
            Status
          </div>
        ),
        cell: ({ row }) => {
          const toggleStatus = () => {
            updateStatus(row.original.id.toString(), { status: row.original.status === 1 ? 0 : 1 });
          };
          return (
            <span className="font-medium text-sm leading-5 text-zinc-100">
              <Switch
                id={`switch-${row.original.id}`}
                checked={Boolean(row.original.status)}
                onCheckedChange={toggleStatus}
                className='data-[state=checked]:bg-newyellow'
              />
            </span>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: () => <div className="cursor-default">Ações</div>,
        meta: { className: 'sm:w-[98px] w-[101px]' },
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button
              className="rounded size-8 bg-newyellow [&>svg]:stroke-black [&:hover]:bg-newyellow-hover [&:focus-visible]:bg-newyellow-focus disabled:cursor-no-drop"
              variant="ghost"
              onClick={() => handleEdit(row.original)}
            >
              <Edit2 />
            </Button>
          </div>
        ),
      },
    ],
    [updateStatus],
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Lista de Alunos</h1>
      <div className="flex justify-between flex-col lg:flex-row">
        <div className="mb-4 grid grid-cols-2 lg:flex flex-wrap items-center justify-between gap-2 ">
          <SelectStatus onChange={value => setFiltros({ ...filtros, status: value })} />
          {!turmasData ? (
            <Button
              disabled
              className="bg-zinc-900 border-zinc-800 p-2 text-zinc-50 [&:hover]:bg-zinc-700 flex items-center justify-between"
            >
              Carregando Turmas...
            </Button>
          ) : (
            <SelectTurma turmas={turmasData?.data || []} onChange={value => setFiltros({ ...filtros, idTurma: value })} />
          )}
        
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Input
            placeholder="Nome"
            onChange={e => setFiltros({ ...filtros, nome: e.target.value })}
            value={filtros.nome}
            className="border sm:w-[180px] lg:w-[209px] md:w-[263px] bg-zinc-900 border-zinc-700 p-2 text-zinc-50 [&:hover]:bg-zinc-700"
          />
          <Button
            variant="outline"
            className="bg-transparent border-zinc-800 p-2 text-zinc-50 [&:hover]:bg-newyellow-hover [&:hover]:text-black focus-visible:bg-zinc-100 focus-visible:text-black disabled:cursor-no-drop"
            onClick={() => handleNewAluno()}
          >
            <PlusCircle /> Novo Aluno
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={currentPageData || []}
        isLoadingData={currentPageData.length === 0}
        isErrorData={currentPageData.length === 0 && !alunos.data}
        isLenghtNill={currentPageData.length === 0}
        errorMessage="Nenhum aluno encontrado"
        minLengthSkeleton={5}
      />

      {alunos.data && typeof alunos.data.totalPages === 'number' && alunos.data.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
            <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
          </PaginationItem>

          {alunos.data && typeof alunos.data.totalPages === 'number' &&
            Array.from({ length: alunos.data.totalPages }).map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink onClick={() => setCurrentPage(index + 1)}>{index + 1}</PaginationLink>
              </PaginationItem>
            ))
          }
         
          <PaginationItem aria-disabled={!alunos.data?.hasNextPage}>
            <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      )}

      {validateOpenDialog && (
        <DialogAlunos
          open={openDialogAluno.open}
          title={openDialogAluno.type}
          AlunoId={openDialogAluno.alunoId}
          userEdit={alunoEdit || undefined}
          onCloseAction={() =>
            setopenDialogAluno({ open: false, type: '', alunoId: '' })
          }
          turmas={turmasData?.data || []}
          planos={planosData?.data || []}
        />

      )}
    </div>
  );
}
