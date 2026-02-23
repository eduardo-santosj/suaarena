import { useQuery } from '@tanstack/react-query';

import { Paths } from '@/types/enums/Paths';
import { QueryKeys } from '@/types/enums/QueryKeys';

import { AlunosSchema } from '@/types/model/alunos';
import { api } from '../api';

type ExtendAlunosResponse = AlunosSchema & { hasNextPage: boolean };
type AlunosQueryParams = {
  page?: number;
  status?: string;
  nome?: string;
  perPage?: number;
  idTurma?: string;
};

const fetchAlunos = async ({
  page = 1,
  status,
  nome,
  perPage = 20,
  idTurma,
}: AlunosQueryParams): Promise<ExtendAlunosResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (status) params.append('status', status);
  if (nome) params.append('nome', nome);
  if (perPage) params.append('perPage', perPage.toString());
  if (idTurma) params.append('idTurma', idTurma.toString());

  const { data } = await api.get<AlunosSchema>(
    `${Paths.ALUNOS}?${params.toString()}`,
  );
  const hasNextPage = data.page * data.perPage < data.totalItems;

  return {
    ...data,
    hasNextPage,
  };
};

export const useAlunos = ({
  page = 1,
  status,
  nome,
  perPage = 20,
  idTurma,
}: AlunosQueryParams) => {
  return useQuery<ExtendAlunosResponse>({
    queryKey: [
      QueryKeys.GetAlunos,
      page, status, nome, perPage, idTurma, // adiciona os filtros aqui
    ],
    queryFn: () =>
      fetchAlunos({ page, status, nome, perPage, idTurma }),
  });
};
