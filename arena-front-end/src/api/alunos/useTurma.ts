import { useQuery } from '@tanstack/react-query';

import { Paths } from '@/types/enums/Paths';
import { QueryKeys } from '@/types/enums/QueryKeys';

import { TurmaSchemaResponse } from '@/types/model/turma';
import { api } from '../api';

type ExtendTurmaResponse = TurmaSchemaResponse


const fetchTurmas = async (): Promise<ExtendTurmaResponse> => {
  const { data } = await api.get<TurmaSchemaResponse>(`${Paths.TURMAS}`);
  return data;
};

export const useTurmas = () => {
  return useQuery<ExtendTurmaResponse>({
    queryKey: [
      QueryKeys.GetTurmas,
    ],
    queryFn: fetchTurmas,
  });
};
