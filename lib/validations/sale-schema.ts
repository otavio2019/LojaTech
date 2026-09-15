import { z } from "zod";

export const saleSchema = z.object({
  id_cliente: z.string().min(1, "Selecione um cliente"),
  id_produto: z.string().min(1, "Selecione um produto"),
  quantidade: z.coerce.number().int("Informe uma quantidade inteira").positive("A quantidade deve ser maior que zero"),
  forma_pagamento: z.enum(["pix", "credito", "debito", "boleto"], { message: "Selecione uma forma de pagamento" }),
});

export type SaleFormData = z.infer<typeof saleSchema>;
