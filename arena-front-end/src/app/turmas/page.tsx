
'use client';
import { useTurmas } from '@/api/alunos/useTurma';
import { useTurmaId } from '@/api/alunos/useTurmaId';
import { DataTable } from '@/components/dataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Turma } from '@/types/model/turma';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, PlusCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DialogTurmas } from './components';

type InfoDialogTurma = {
  open: boolean;
  type: string;
  turmaId: string;
};

export default function TurmasPage() {
  const [filtros, setFiltros] = useState({ nome: '' });
  const [openDialogTurma, setOpenDialogTurma] = useState<InfoDialogTurma>({
    open: false,
    type: '',
    turmaId: '',
  });

  const { data: turmasData } = useTurmas();
  const { data: turmaEdit } = useTurmaId(openDialogTurma.turmaId);

  async function handleEdit(turma: Turma) {
    setOpenDialogTurma({ open: true, turmaId: turma.id.toString(), type: 'edit' });
  }

  async function handleNewTurma() {
    setOpenDialogTurma({ open: true, turmaId: '', type: 'new' });
  }

  const currentPageData = turmasData?.data ?? [];
  const filteredData = currentPageData.filter(turma => 
    turma.nome.toLowerCase().includes(filtros.nome.toLowerCase())
  );

  const columns = useMemo<ColumnDef<Turma>[]>(
    () => {
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      
      return [
      {
        accessorKey: 'nome',
        header: () => (
          <div className="flex items-center cursor-pointer">
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
        accessorKey: 'dias_semana',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Dias da Semana
          </div>
        ),
        cell: ({ row }) => {
          let dias = [];
          if (row.original.dias_semana) {
            try {
              dias = typeof row.original.dias_semana === 'string' 
                ? JSON.parse(row.original.dias_semana)
                : row.original.dias_semana;
            } catch {
              dias = [];
            }
          }
          return (
            <span className="font-medium text-sm leading-5 text-zinc-100">
              {Array.isArray(dias) ? dias.map(dia => diasSemana[dia]).join(', ') : 'N/A'}
            </span>
          );
        },
      },
      {
        accessorKey: 'horario',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Horário
          </div>
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-sm leading-5 text-zinc-100">
            {getValue<string>()}
          </span>
        ),
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
      ];
    },
    [],
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Lista de Turmas</h1>
      
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Input
          placeholder="Nome da turma"
          onChange={e => setFiltros({ ...filtros, nome: e.target.value })}
          value={filtros.nome}
          className="border sm:w-[180px] lg:w-[209px] md:w-[263px] bg-zinc-900 border-zinc-700 p-2 text-zinc-50 [&:hover]:bg-zinc-700"
        />
        <Button
          variant="outline"
          className="bg-transparent border-zinc-800 p-2 text-zinc-50 [&:hover]:bg-newyellow-hover [&:hover]:text-black focus-visible:bg-zinc-100 focus-visible:text-black disabled:cursor-no-drop"
          onClick={() => handleNewTurma()}
        >
          <PlusCircle /> Nova Turma
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredData || []}
        isLoadingData={!turmasData}
        isErrorData={!turmasData}
        isLenghtNill={filteredData.length === 0}
        errorMessage="Nenhuma turma encontrada"
        minLengthSkeleton={5}
      />

      {openDialogTurma.open && (
        <DialogTurmas
          open={openDialogTurma.open}
          title={openDialogTurma.type}
          turmaEdit={turmaEdit}
          onCloseAction={() =>
            setOpenDialogTurma({ open: false, type: '', turmaId: '' })
          }
        />
      )}
    </div>
  );
}
