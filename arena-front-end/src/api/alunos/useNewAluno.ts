import { useMutation } from '@tanstack/react-query';

import { z } from 'zod';

import { Paths } from '@/types/enums/Paths';


import { queryClient } from '@/lib/reactQuery';
import { QueryKeys } from '@/types/enums/QueryKeys';
import { Aluno, alunosPostSchemaResponse, AlunosSchema } from '@/types/model/alunos';
import { api } from '../api';

async function alunoNew(alunoNew: Aluno) {

  const { data } = await api.post<Promise<AlunosSchema>>( `${Paths.ALUNOS}`, alunoNew);

  try {
    alunosPostSchemaResponse.safeParse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.flatten().fieldErrors);
    }
  }

  return data;
}

export const useAlunoNew = () =>
  useMutation({
    mutationFn: alunoNew,
    onError: (error) => {
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
