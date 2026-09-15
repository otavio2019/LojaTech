import vendas from "@/data/mock/vendas.json";
import type { Venda } from "@/types/venda";

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
