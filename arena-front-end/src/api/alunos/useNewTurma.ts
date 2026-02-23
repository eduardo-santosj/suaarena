import { useMutation, useQueryClient } from '@tanstack/react-query';

import { z } from 'zod';

import { Paths } from '@/types/enums/Paths';

import { turmaPostSchemaResponse, TurmaSchemaPost } from '@/types/model/turma';
import { api } from '../api';

export interface Turma {
  nome: string;
  horario: string;
}

async function turmaNew(turmaNew: Turma) {
  const { data } = await api.post<Promise<TurmaSchemaPost>>( `${Paths.TURMAS}`, turmaNew);

  try {
    turmaPostSchemaResponse.safeParse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.flatten().fieldErrors);
    }
  }

  return data;
}

export const useTurmaNew = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: turmaNew,
    onError: (error) => {
      if (error instanceof Error) {
        console.log(error);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });
};
