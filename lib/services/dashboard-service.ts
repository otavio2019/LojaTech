import type { DashboardData, DashboardProduct, DashboardSale } from "@/types/dashboard";
import { getProducts, getProductsFromDatabase } from "@/lib/services/product-service";
import { getSales, getSalesFromDatabase } from "@/lib/services/sales-service";

export async function getDashboardData(): Promise<DashboardData> {
  const [sales, products] = await Promise.all([
    getSalesFromDatabase(),
    getProductsFromDatabase(),
  ]);

  const dashboardSales = sales.map((sale): DashboardSale => ({
    id_venda: sale.id_venda,
    data_venda: sale.data_venda,
    id_produto: sale.id_produto,
    quantidade: sale.quantidade,
    valor_total: sale.valor_total,
    forma_pagamento: sale.forma_pagamento,
  }));

  const dashboardProducts = products.map((product): DashboardProduct => ({
    id_produto: product.id_produto,
    nome: product.nome,
    categoria: product.categoria,
    estoque: product.estoque,
  }));

  return {
    summary: {
      totalSales: dashboardSales.length,
      revenue: dashboardSales.reduce((total, sale) => total + sale.valor_total, 0),
      units: dashboardSales.reduce((total, sale) => total + sale.quantidade, 0),
    },
    sales: dashboardSales,
    products: dashboardProducts,
  };
}

export function getMockDashboardData(): DashboardData {
  const sales = getSales();
  const products = getProducts();
  return {
    summary: {
      totalSales: sales.length,
      revenue: sales.reduce((total, sale) => total + sale.valor_total, 0),
      units: sales.reduce((total, sale) => total + sale.quantidade, 0),
    },
    sales: sales.map((sale) => ({
      id_venda: sale.id_venda,
      data_venda: sale.data_venda,
      id_produto: sale.id_produto,
      quantidade: sale.quantidade,
      valor_total: sale.valor_total,
      forma_pagamento: sale.forma_pagamento,
    })),
    products: products.map((product) => ({
      id_produto: product.id_produto,
      nome: product.nome,
      categoria: product.categoria,
      estoque: product.estoque,
    })),
  };
}
