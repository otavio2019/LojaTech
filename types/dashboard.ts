export interface DashboardSummary {
  totalSales: number;
  revenue: number;
  units: number;
}

export interface DashboardSale {
  id_venda: string;
  data_venda: string;
  id_produto: string;
  quantidade: number;
  valor_total: number;
  forma_pagamento: string;
}

export interface DashboardProduct {
  id_produto: string;
  nome: string;
  categoria: string;
  estoque: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  sales: DashboardSale[];
  products: DashboardProduct[];
}
