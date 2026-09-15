import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getProductByIdFromDatabase } from "@/lib/services/product-service";
import { formatCurrency, formatDate } from "@/lib/formatters";

export function generateStaticParams() {
  return ["prod-001", "prod-002", "prod-003"].map((id) => ({ id }));
}

export default async function ProdutoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdFromDatabase(id);
  if (!product) notFound();
  const margin = ((product.preco - product.custo) / product.preco) * 100;

  return <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16"><Link href="/store/produtos" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">← Voltar para produtos</Link><div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]"><section><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">{product.categoria}</span><h1 className="mt-5 text-4xl font-bold text-white">{product.nome}</h1><p className="mt-5 text-lg leading-8 text-slate-300">{product.descricao}</p><div className="mt-8 flex items-center gap-4"><span className="text-3xl font-bold text-cyan-300">{formatCurrency(product.preco)}</span><span className="text-amber-300">★ {product.avaliacao}</span></div><div className="mt-8 flex flex-wrap gap-3"><Link href="/store/vendas" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300">Registrar venda</Link><Link href="/store/produtos" className="rounded-xl border border-white/15 px-5 py-3 font-semibold hover:border-cyan-400 hover:text-cyan-300">Continuar navegando</Link></div></section><Card><p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Informações</p><dl className="mt-5 space-y-5"><Info label="Estoque" value={`${product.estoque} unidades`} highlight={product.estoque <= 5} /><Info label="Custo unitário" value={formatCurrency(product.custo)} /><Info label="Margem estimada" value={`${margin.toFixed(1).replace(".", ",")}%`} /><Info label="Data de cadastro" value={formatDate(product.data_cadastro)} /></dl></Card></div></main>;
}

function Info({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) { return <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"><dt className="text-sm text-slate-400">{label}</dt><dd className={`text-right text-sm font-semibold ${highlight ? "text-amber-300" : "text-white"}`}>{value}</dd></div>; }
