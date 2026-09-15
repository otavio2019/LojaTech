import { ProductCatalog } from "@/components/products/product-catalog";
import { ProductForm } from "@/components/products/product-form";
import { getProductsFromDatabase } from "@/lib/services/product-service";
import { getAuthenticatedUser } from "@/lib/supabase/auth-server";

export default async function ProdutosPage() {
  const products = await getProductsFromDatabase();
  const user = await getAuthenticatedUser();
  return <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Catálogo</p><h1 className="mt-3 text-4xl font-bold">Produtos</h1><p className="mt-3 text-slate-400">Encontre o equipamento ideal para o seu setup.</p></div>{user && <div className="mt-8"><ProductForm /></div>}<ProductCatalog products={products} /></main>;
}
