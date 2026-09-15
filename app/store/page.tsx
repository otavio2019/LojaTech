import Link from "next/link";
import { getProductsFromDatabase } from "@/lib/services/product-service";
import { formatCurrency } from "@/lib/formatters";
import { Card } from "@/components/ui/card";

export default async function StorePage() {
  const products = await getProductsFromDatabase();
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">LojaTech</p><h1 className="mt-3 text-4xl font-bold">Tudo para seu setup</h1><p className="mt-4 max-w-2xl text-slate-300">Produtos selecionados para produtividade, criatividade e diversão.</p><Link className="mt-8 inline-block text-cyan-300 hover:text-cyan-200" href="/store/produtos">Explorar catálogo completo →</Link><div className="mt-10 grid gap-5 md:grid-cols-3">{products.map((product) => <Card key={product.id_produto}><h2 className="text-xl font-semibold">{product.nome}</h2><p className="mt-2 text-sm text-slate-400">{product.descricao}</p><p className="mt-5 text-2xl font-bold text-cyan-300">{formatCurrency(product.preco)}</p></Card>)}</div></main>;
}
