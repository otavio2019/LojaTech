import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getProductsFromDatabase } from "@/lib/services/product-service";
import { getSalesSummaryFromDatabase } from "@/lib/services/sales-service";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export default async function Home() {
  const products = await getProductsFromDatabase();
  const summary = await getSalesSummaryFromDatabase();

  return (
    <main className="flex-1">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">Tecnologia sem complicação</p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-6xl">Tecnologia que acompanha o seu ritmo.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Conheça a LojaTech, uma experiência de loja moderna com produtos selecionados e dados organizados para decisões melhores.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/store/produtos" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300">Ver produtos</Link>
            <Link href="/store/vendas" className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white hover:border-cyan-400 hover:text-cyan-300">Acompanhar vendas</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-blue-500/5 p-8 shadow-2xl shadow-cyan-950/40">
          <p className="text-sm text-slate-300">Visão rápida da operação</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <Metric label="Faturamento" value={formatCurrency(summary.revenue)} />
            <Metric label="Vendas" value={formatNumber(summary.totalSales)} />
            <Metric label="Unidades" value={formatNumber(summary.units)} />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 flex items-end justify-between"><div><p className="text-sm text-cyan-400">Destaques</p><h2 className="mt-1 text-3xl font-bold">Produtos em evidência</h2></div><Link href="/store/produtos" className="text-sm text-slate-300 hover:text-cyan-300">Ver catálogo →</Link></div>
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((product) => <Card key={product.id_produto}><p className="text-sm text-cyan-400">{product.categoria}</p><h3 className="mt-3 text-xl font-semibold">{product.nome}</h3><p className="mt-3 text-2xl font-bold">{formatCurrency(product.preco)}</p><p className="mt-2 text-sm text-slate-400">{product.estoque} unidades em estoque</p></Card>)}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-xs uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-xl font-bold text-white">{value}</p></div>; }
