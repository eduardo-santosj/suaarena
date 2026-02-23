'use client';

import { useQuadras } from '@/api/quadras/useQuadras';
import { DataTable } from '@/components/dataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, Edit2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DialogQuadras } from './components';

interface Quadra {
  id: number;
  nome: string;
  descricao: string;
  ativa: boolean;
  total_reservas: number;
}

type InfoDialogQuadra = {
  open: boolean;
  type: string;
  quadra?: Quadra;
};

export default function QuadrasPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [filtros, setFiltros] = useState({ nome: '' });
  const [openDialogQuadra, setOpenDialogQuadra] = useState<InfoDialogQuadra>({
    open: false,
    type: '',
  });

  const { data: quadrasData, isLoading } = useQuadras();
  const quadras = quadrasData?.data || [];

  async function handleEdit(quadra: Quadra) {
    setOpenDialogQuadra({ open: true, type: 'edit', quadra });
  }

  async function handleNewQuadra() {
    setOpenDialogQuadra({ open: true, type: 'new' });
  }

  const filteredData = quadras.filter(quadra => 
    quadra.nome.toLowerCase().includes(filtros.nome.toLowerCase())
  );

  const columns = useMemo<ColumnDef<Quadra>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Nome da Quadra
          </div>
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-sm leading-5 text-zinc-100">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'descricao',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Descrição
          </div>
        ),
        cell: ({ getValue }) => {
          const descricao = getValue<string>();
          return (
            <span className="font-medium text-sm leading-5 text-zinc-100">
              {descricao || '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'ativa',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Status
          </div>
        ),
        cell: ({ getValue }) => (
          <Badge variant={getValue<boolean>() ? 'default' : 'secondary'}>
            {getValue<boolean>() ? 'Ativa' : 'Inativa'}
          </Badge>
        ),
      },
      {
        accessorKey: 'total_reservas',
        header: () => (
          <div className="flex items-center cursor-pointer">
            Reservas
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
          <div className="flex space-x-2">
            <Button
              className="rounded size-8 bg-newyellow [&>svg]:stroke-black [&:hover]:bg-newyellow-hover [&:focus-visible]:bg-newyellow-focus disabled:cursor-no-drop"
              variant="ghost"
              onClick={() => handleEdit(row.original)}
            >
              <Edit2 />
            </Button>
            <Button
              className="rounded size-8 bg-blue-500 [&>svg]:stroke-white [&:hover]:bg-blue-600 [&:focus-visible]:bg-blue-700 disabled:cursor-no-drop"
              variant="ghost"
              onClick={() => router.push(`/quadras/calendario?quadra=${row.original.id}`)}
            >
              <Calendar />
            </Button>
          </div>
        ),
      },
    ],
    [router],
  );

  if (!isAdmin()) {
    return <div>Acesso negado. Apenas administradores podem acessar esta página.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Lista de Quadras</h1>
      <div className="flex justify-between flex-col lg:flex-row">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Button 
            variant="outline"
            className="bg-transparent border-zinc-800 p-2 text-zinc-50 [&:hover]:bg-newyellow-hover [&:hover]:text-black focus-visible:bg-zinc-100 focus-visible:text-black"
            onClick={() => router.push('/quadras/calendario')}
          >
            <Calendar className="h-4 w-4 mr-2" /> Calendário
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Input
            placeholder="Nome da quadra"
            onChange={e => setFiltros({ ...filtros, nome: e.target.value })}
            value={filtros.nome}
            className="border sm:w-[180px] lg:w-[209px] md:w-[263px] bg-zinc-900 border-zinc-700 p-2 text-zinc-50 [&:hover]:bg-zinc-700"
          />
          <Button
            variant="outline"
            className="bg-transparent border-zinc-800 p-2 text-zinc-50 [&:hover]:bg-newyellow-hover [&:hover]:text-black focus-visible:bg-zinc-100 focus-visible:text-black disabled:cursor-no-drop"
            onClick={() => handleNewQuadra()}
          >
            <PlusCircle /> Nova Quadra
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredData}
        isLoadingData={isLoading}
        isErrorData={false}
        isLenghtNill={filteredData.length === 0}
        errorMessage="Nenhuma quadra encontrada"
        minLengthSkeleton={5}
      />
      
      <DialogQuadras
        open={openDialogQuadra.open}
        title={openDialogQuadra.type}
        quadraEdit={openDialogQuadra.quadra}
        onCloseAction={() => setOpenDialogQuadra({ open: false, type: '' })}
      />
    </div>
  );
}