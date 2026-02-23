import { z } from 'zod';

export interface Mark {
  idAluno: number | undefined;
  idTurma: string;
  data: string;
  horario: string ;
}

export const markSchema = z.object({
  id: z.number(),
  idAluno: z.number(),
  idTurma: z.string(),
  nome: z.string(),
  data: z.string(),
  horario: z.string(),
});

export const markSchemaResponse = z.object({
  id: z.number()
});

export const markAllGetSchemaResponse = z.object({
  success: z.boolean(),
  data: z.array(markSchema),
});

export type MarkSchemaGet = z.infer<typeof markAllGetSchemaResponse>;

export type MarkSchema = z.infer<typeof markSchema>;

export type MarkSchemaResponse = z.infer<typeof markSchemaResponse>;
