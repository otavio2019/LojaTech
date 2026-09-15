import { ProductCatalog } from "@/components/products/product-catalog";
import { getProducts } from "@/lib/services/product-service";

export default function ProdutosPage() {
  const products = getProducts();
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Catálogo</p><h1 className="mt-3 text-4xl font-bold">Produtos</h1><p className="mt-3 text-slate-400">Encontre o equipamento ideal para o seu setup.</p></div><ProductCatalog products={products} /></main>;
}
