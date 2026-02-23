import { useMutation } from '@tanstack/react-query';


import { Paths } from '@/types/enums/Paths';


import { queryClient } from '@/lib/reactQuery';
import { QueryKeys } from '@/types/enums/QueryKeys';
import { Mark, MarkSchemaResponse } from '@/types/model/mark';
import { api } from '../api';

async function markNew(markNew: Mark) {

  const { data } = await api.post<Promise<MarkSchemaResponse>>( `${Paths.MARK}`, markNew);

  return data;
}

export const useNewMark = () =>
  useMutation({
    mutationFn: markNew,
    onError: (error) => {
      if (error instanceof Error) {
        console.log(error)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
          queryKey: [QueryKeys.PostMark],
      });
    },
  });
