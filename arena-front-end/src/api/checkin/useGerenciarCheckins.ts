import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

interface CheckinPendente {
  id: number;
  idAluno: number;
  nome: string;
  data: string;
  status_checkin: string;
}

const fetchCheckinsPendentes = async (idTurma: string) => {
  const { data } = await api.get(`/checkin/pendentes/${idTurma}`);
  return data;
};

const aprovarCheckin = async ({ id, status }: { id: number; status: 'confirmado' | 'rejeitado' }) => {
  const { data } = await api.put(`/checkin/aprovar/${id}`, { status });
  return data;
};

export const useCheckinsPendentes = (idTurma: string) => {
  return useQuery<{ success: boolean; data: CheckinPendente[] }>({
    queryKey: ['checkins-pendentes', idTurma],
    queryFn: () => fetchCheckinsPendentes(idTurma),
    enabled: !!idTurma,
  });
};

export const useAprovarCheckin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: aprovarCheckin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins-pendentes'] });
    },
  });
};