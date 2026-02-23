import { useQuery } from '@tanstack/react-query';

import { Paths } from '@/types/enums/Paths';

import { QueryKeys } from '@/types/enums/QueryKeys';

import { Aluno, AlunosGetSchemaResponse } from '@/types/model/alunos';
import { api } from '../api';

const getClientId = async (alunoId: string): Promise<Aluno | null> => {
  if (!alunoId) return null;

  const { data } = await api.get<AlunosGetSchemaResponse>(`${Paths.ALUNOS}/${alunoId}`);

  return data.data;
};

export const useAlunoId = ( alunoId: string) =>
  useQuery<Aluno | null, Error>({
    queryKey: [QueryKeys.GetAlunos, alunoId],
    queryFn: () => getClientId(alunoId),
  });
