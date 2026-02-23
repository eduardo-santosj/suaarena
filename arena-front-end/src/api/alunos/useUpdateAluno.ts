import { useMutation } from '@tanstack/react-query';

import { z } from 'zod';

import { queryClient } from '@/lib/reactQuery';
import { Paths } from '@/types/enums/Paths';

import { QueryKeys } from '@/types/enums/QueryKeys';

import { Aluno, alunoSchema } from '@/types/model/alunos';
import { api } from '../api';

type UpdateAlunoParams = {
  alunoId: string;
  updatedAlunoResult: Partial<Aluno>;
};

async function updateAluno({ alunoId, updatedAlunoResult }: UpdateAlunoParams) {
  const { data } = await api.put<Promise<Aluno>>(`${Paths.ALUNOS}/${alunoId}`, {
    ...updatedAlunoResult,
  });

  try {
    alunoSchema.safeParse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error)
    }
  }

  return data;
}

export const useUpdateAluno = () => {
  return useMutation({
    mutationFn: updateAluno,
    onError: (error: Error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetAlunos],
      });
    },
  });
};
