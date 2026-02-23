import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { Turma } from '@/types/model/turma';

const fetchTurmaById = async (id: string): Promise<Turma> => {
  const { data } = await api.get(`/turmas/${id}`);
  return data.data;
};

export const useTurmaId = (id: string) => {
  return useQuery<Turma>({
    queryKey: ['turma', id],
    queryFn: () => fetchTurmaById(id),
    enabled: !!id && id !== '',
  });
};