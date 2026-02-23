import { useQuery } from '@tanstack/react-query';

import { Paths } from '@/types/enums/Paths';

import { QueryKeys } from '@/types/enums/QueryKeys';

import { AlunosAllGetSchemaResponse } from '@/types/model/alunos';
import { api } from '../api';


const fetchAllAlunos = async () => {
  const { data } = await api.get<AlunosAllGetSchemaResponse>(
    `${Paths.ALUNOS}/all`,
  );

  return {
    ...data
  };
};

export const useAllAlunos = () => {
  return useQuery<AlunosAllGetSchemaResponse>({
    queryKey: [
      QueryKeys.GetAllAlunos,
    ],
    queryFn: () =>
      fetchAllAlunos(),
  });
};
