import { z } from "zod";

export const productSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome do produto"),
  categoria: z.string().trim().min(2, "Informe a categoria"),
  preco: z.coerce.number().nonnegative("O preço não pode ser negativo"),
  custo: z.coerce.number().nonnegative("O custo não pode ser negativo"),
  estoque: z.coerce.number().int("Use um número inteiro").nonnegative("O estoque não pode ser negativo"),
  descricao: z.string().trim().min(5, "Informe uma descrição"),
});

export type ProductFormData = z.infer<typeof productSchema>;
