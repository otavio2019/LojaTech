import { Card } from "@/components/ui/card";
import { SaleForm } from "@/components/sales/sale-form";
import { getSalesFromDatabase, getSalesSummaryFromDatabase } from "@/lib/services/sales-service";
import { getProductsFromDatabase } from "@/lib/services/product-service";
import { getCustomersFromDatabase } from "@/lib/services/customer-service";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatters";

export default async function VendasPage() {
  const sales = await getSalesFromDatabase();
  const summary = await getSalesSummaryFromDatabase();
  const customers = await getCustomersFromDatabase();
  const products = await getProductsFromDatabase();
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Administração</p><h1 className="mt-3 text-4xl font-bold">Vendas</h1><div className="mt-8 grid gap-4 sm:grid-cols-3"><Card><p className="text-sm text-slate-400">Faturamento</p><p className="mt-2 text-2xl font-bold">{formatCurrency(summary.revenue)}</p></Card><Card><p className="text-sm text-slate-400">Pedidos</p><p className="mt-2 text-2xl font-bold">{formatNumber(summary.totalSales)}</p></Card><Card><p className="text-sm text-slate-400">Unidades vendidas</p><p className="mt-2 text-2xl font-bold">{formatNumber(summary.units)}</p></Card></div><div className="mt-8"><SaleForm customers={customers} products={products} /></div><Card className="mt-8 overflow-x-auto p-0"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Venda</th><th className="px-5 py-4">Cliente</th><th className="px-5 py-4">Produto</th><th className="px-5 py-4">Data</th><th className="px-5 py-4">Total</th></tr></thead><tbody className="divide-y divide-white/5">{sales.map((sale) => <tr key={sale.id_venda} className="hover:bg-white/[0.03]"><td className="px-5 py-4 font-medium text-cyan-300">{sale.id_venda}</td><td className="px-5 py-4 text-white">{customers.find((customer) => customer.id_cliente === sale.id_cliente)?.nome ?? "Cliente não encontrado"}</td><td className="px-5 py-4 text-slate-300">{products.find((product) => product.id_produto === sale.id_produto)?.nome ?? "Produto não encontrado"}</td><td className="px-5 py-4 text-slate-400">{formatDate(sale.data_venda)}</td><td className="px-5 py-4 font-semibold text-white">{formatCurrency(sale.valor_total)}</td></tr>)}</tbody></table></Card></main>;
}
