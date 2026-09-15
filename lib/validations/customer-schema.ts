import { z } from "zod";

export const customerSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo"),
  cidade: z.string().trim().min(2, "Informe a cidade"),
  estado: z.string().trim().length(2, "Informe a UF com 2 letras").toUpperCase(),
  email: z.string().trim().email("Informe um e-mail válido"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
