import vendas from "@/data/mock/vendas.json";
import type { Venda } from "@/types/venda";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getSalesFromDatabase(): Promise<Venda[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return getSales();
  const { data, error } = await supabase.from("vendas").select("*").order("data_venda", { ascending: false });
  if (error) {
    console.warn("Supabase indisponível para vendas; usando dados mockados.", error.message);
    return getSales();
  }
  return (data ?? []) as Venda[];
}

export async function getSalesSummaryFromDatabase() {
  const items = await getSalesFromDatabase();
  return {
    totalSales: items.length,
    revenue: items.reduce((total, venda) => total + venda.valor_total, 0),
    units: items.reduce((total, venda) => total + venda.quantidade, 0),
  };
}

export function getSales(): Venda[] {
  return vendas as Venda[];
}

export function getSalesSummary() {
  const items = getSales();
  return {
    totalSales: items.length,
    revenue: items.reduce((total, venda) => total + venda.valor_total, 0),
    units: items.reduce((total, venda) => total + venda.quantidade, 0),
  };
}
