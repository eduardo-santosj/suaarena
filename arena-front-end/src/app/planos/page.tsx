'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DataTable } from '@/components/dataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, PlusCircle } from 'lucide-react';
import { DialogPlanos } from './components';
import { usePlanos } from '@/api/planos/usePlanos';

interface Plano {
  id: number;
  nome: string;
  treinos_por_semana: number;
  valor: number;
  ativo: boolean;
  total_alunos: number;
}

type InfoDialogPlano = {
  open: boolean;
  type: string;
  planoId: string;
};

export default function PlanosPage() {
  const { isAdmin } = useAuth();
  const [filtros, setFiltros] = useState({ nome: '' });
  const [openDialogPlano, setOpenDialogPlano] = useState<InfoDialogPlano>({
    open: false,
    type: '',
    planoId: '',
  });

  const { data: planosData, isLoading } = usePlanos();
  const planos = planosData?.data || [];

  async function handleEdit(plano: Plano) {
    setOpenDialogPlano({ open: true, planoId: plano.id.toString(), type: 'edit' });
  }

  async function handleNewPlano() {
    setOpenDialogPlano({ open: true, planoId: '', type: 'new' });
  }

  const filteredData = planos.filter(plano => 
    plano.nome.toLowerCase().includes(filtros.nome.toLowerCase())
  );

  const columns = useMemo<ColumnDef<Plano>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Nome do Plano
          </div>
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-sm leading-5 text-zinc-100">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'treinos_por_semana',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Treinos/Semana
          </div>
        ),
        cell: ({ getValue }) => (
          <Badge variant="outline">
            {getValue<number>()} treinos
          </Badge>
        ),
      },
      {
        accessorKey: 'valor',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Valor
          </div>
        ),
        cell: ({ getValue }) => {
          const valor = getValue<number>();
          return (
            <span className="font-medium text-sm leading-5 text-zinc-100">
              {valor ? `R$ ${valor.toFixed(2)}` : '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'ativo',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Status
          </div>
        ),
        cell: ({ getValue }) => (
          <Badge variant={getValue<boolean>() ? 'default' : 'secondary'}>
            {getValue<boolean>() ? 'Ativo' : 'Inativo'}
          </Badge>
        ),
      },
      {
        accessorKey: 'total_alunos',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Alunos
          </div>
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-sm leading-5 text-zinc-100">
            {getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'actions',
        header: () => <div className="cursor-default">Ações</div>,
        meta: { className: 'sm:w-[98px] w-[101px]' },
        cell: ({ row }) => (
          <Button
            className="rounded size-8 bg-newyellow [&>svg]:stroke-black [&:hover]:bg-newyellow-hover [&:focus-visible]:bg-newyellow-focus disabled:cursor-no-drop"
            variant="ghost"
            onClick={() => handleEdit(row.original)}
          >
            <Edit2 />
          </Button>
        ),
      },
    ],
    [],
  );

  if (!isAdmin()) {
    return <div>Acesso negado. Apenas administradores podem acessar esta página.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Lista de Planos</h1>
      <div className="flex justify-between flex-col lg:flex-row">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {/* Espaço para filtros adicionais se necessário */}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Input
            placeholder="Nome do plano"
            onChange={e => setFiltros({ ...filtros, nome: e.target.value })}
            value={filtros.nome}
            className="border sm:w-[180px] lg:w-[209px] md:w-[263px] bg-zinc-900 border-zinc-700 p-2 text-zinc-50 [&:hover]:bg-zinc-700"
          />
          <Button
            variant="outline"
            className="bg-transparent border-zinc-800 p-2 text-zinc-50 [&:hover]:bg-newyellow-hover [&:hover]:text-black focus-visible:bg-zinc-100 focus-visible:text-black disabled:cursor-no-drop"
            onClick={() => handleNewPlano()}
          >
            <PlusCircle /> Novo Plano
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredData}
        isLoadingData={isLoading}
        isErrorData={false}
        isLenghtNill={filteredData.length === 0}
        errorMessage="Nenhum plano encontrado"
        minLengthSkeleton={5}
      />
      
      <DialogPlanos
        open={openDialogPlano.open}
        title={openDialogPlano.type}
        onCloseAction={() => setOpenDialogPlano({ open: false, type: '', planoId: '' })}
      />
    </div>
  );
}