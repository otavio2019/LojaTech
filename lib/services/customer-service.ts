import clientes from "@/data/mock/clientes.json";
import type { Cliente } from "@/types/cliente";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getCustomersFromDatabase(): Promise<Cliente[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return getCustomers();
  const { data, error } = await supabase.from("clientes").select("*").order("nome");
  if (error) {
    console.warn("Supabase indisponível para clientes; usando dados mockados.", error.message);
    return getCustomers();
  }
  return (data ?? []) as Cliente[];
}

export function getCustomers(): Cliente[] {
  return clientes as Cliente[];
}

export function getCustomerById(id: string): Cliente | undefined {
  return getCustomers().find((cliente) => cliente.id_cliente === id);
}
