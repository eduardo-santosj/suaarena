import { z } from 'zod';

export interface Aluno {
  id: number;
  nome: string;
  cpf?: string;
  email?: string;
  status: number;
  idTurma: number;
  nomeTurma: string;
  idPlano?: number;
  nomePlano?: string;
  valor_pago: string;
}

export interface AlunoPages {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  data: Aluno[];
}

export const alunoSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cpf: z.string().optional(),
  email: z.string().optional(),
  status: z.number(),
  idTurma: z.number(),
  nomeTurma: z.string(),
  idPlano: z.number().optional(),
  nomePlano: z.string().optional(),
  valor_pago: z.string(),
});

export const alunosSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  data: z.array(alunoSchema),
});

export const alunosSchemaResponse = z.object({
  id: z.number(),
});

export const alunosPostSchemaResponse = z.object({
  success: z.boolean(),
  id: z.number(),
});

export const alunoGetSchemaResponse = z.object({
  success: z.boolean(),
  data: alunoSchema,
});

export const alunosAllGetSchemaResponse = z.object({
  success: z.boolean(),
  data: z.array(alunoSchema),
});

export type AlunosSchema = z.infer<typeof alunosSchema>;
export type AlunosSchemaResponse = z.infer<typeof alunosSchemaResponse>;
export type AlunosPostSchemaResponse = z.infer<typeof alunosPostSchemaResponse>;
export type AlunosGetSchemaResponse = z.infer<typeof alunoGetSchemaResponse>;
export type AlunosAllGetSchemaResponse = z.infer<typeof alunosAllGetSchemaResponse>;
