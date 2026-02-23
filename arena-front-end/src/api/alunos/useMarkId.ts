import { useQuery } from '@tanstack/react-query';

import { Paths } from '@/types/enums/Paths';

import { QueryKeys } from '@/types/enums/QueryKeys';

import { MarkSchema, MarkSchemaGet } from '@/types/model/mark';
import { api } from '../api';

const getMarksId = async (alunoId: string): Promise<MarkSchema[] | null> => {
  if (!alunoId) return null;

  const { data } = await api.get<MarkSchemaGet>(`${Paths.MARK}/${alunoId}`);

  return data.data;
};

export const useMarksId = (alunoId: string) =>
  useQuery<MarkSchema[] | null, Error>({
    queryKey: [QueryKeys.GetMarksId, alunoId],
    queryFn: () => getMarksId(alunoId),
  });
