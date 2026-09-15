import clientes from "@/data/mock/clientes.json";
import type { Cliente } from "@/types/cliente";

export function getCustomers(): Cliente[] {
  return clientes as Cliente[];
}

export function getCustomerById(id: string): Cliente | undefined {
  return getCustomers().find((cliente) => cliente.id_cliente === id);
}
