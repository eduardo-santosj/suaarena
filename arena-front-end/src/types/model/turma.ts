import { z } from 'zod';

export interface Turma {
  id: number;
  nome: string;
  horario: string;
  capacidade_maxima: number;
  dias_semana: number[];
}

export const turmaSchema = z.object({
  id: z.number(),
  nome: z.string(),
  horario: z.string(),
  capacidade_maxima: z.number(),
  dias_semana: z.array(z.number()),
});

export const turmaSchemaResponse = z.object({
  data: z.array(turmaSchema)
});

export const turmaSchemaPost = z.object({
  id: z.number().optional(),
});

export const turmaPostSchemaResponse = z.object({
  success: z.boolean(),
  id: z.number(),
});

export type TurmaSchema = z.infer<typeof turmaSchema>;
export type TurmaSchemaPost = z.infer<typeof turmaSchemaPost>;

export type TurmaSchemaResponse = z.infer<typeof turmaSchemaResponse>;
