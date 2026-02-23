import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

interface VagasInfo {
  capacidadeMaxima: number;
  checkinsPendentes: number;
  vagasDisponiveis: number;
  turmaLotada: boolean;
}

interface Turma {
  id: number;
  nome: string;
  horario: string;
  capacidade_maxima: number;
}

const fetchVagas = async (idTurma: number) => {
  const { data } = await api.get(`/checkin/vagas/${idTurma}`);
  return data;
};

const fazerCheckin = async ({ idTurma }: { idTurma: number }) => {
  const { data } = await api.post('/checkin/confirmar', { idTurma, presente: true });
  return data;
};

const verificarCheckin = async (idTurma: number) => {
  const { data } = await api.get(`/checkin/status/${idTurma}`);
  return data;
};

const fetchTurmasDia = async (data: string) => {
  const { data: response } = await api.get(`/checkin/turmas-dia?data=${data}`);
  return response;
};

export const useVagas = (idTurma: number) => {
  return useQuery<VagasInfo>({
    queryKey: ['vagas', idTurma],
    queryFn: () => fetchVagas(idTurma),
    enabled: !!idTurma,
  });
};

export const useStatusCheckin = (idTurma: number) => {
  return useQuery<{ success: boolean; jaFezCheckin: boolean }>({
    queryKey: ['status-checkin', idTurma],
    queryFn: () => verificarCheckin(idTurma),
    enabled: !!idTurma,
  });
};

export const useTurmasDia = (data: string) => {
  return useQuery<{ success: boolean; data: Turma[] }>({
    queryKey: ['turmas-dia', data],
    queryFn: () => fetchTurmasDia(data),
  });
};

export const useFazerCheckin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fazerCheckin,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vagas', variables.idTurma] });
    },
  });
};