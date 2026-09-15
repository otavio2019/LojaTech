import produtos from "@/data/mock/produtos.json";
import type { Produto } from "@/types/produto";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getProductsFromDatabase(): Promise<Produto[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return getProducts();
  const { data, error } = await supabase.from("produtos").select("*").order("nome");
  if (error) {
    console.warn("Supabase indisponível para produtos; usando dados mockados.", error.message);
    return getProducts();
  }
  return (data ?? []) as Produto[];
}

export async function getProductByIdFromDatabase(id: string): Promise<Produto | undefined> {
  const products = await getProductsFromDatabase();
  return products.find((product) => product.id_produto === id);
}

export function getProducts(): Produto[] {
  return produtos as Produto[];
}

export function getProductById(
  id: string
): Produto | undefined {
  return getProducts().find(
    (produto) => produto.id_produto === id
  );
}

export function searchProducts(
  search: string
): Produto[] {
  const term = search.toLowerCase().trim();

  if (!term) {
    return getProducts();
  }

  return getProducts().filter((produto) =>
    `${produto.nome} ${produto.categoria} ${produto.descricao}`
      .toLowerCase()
      .includes(term)
  );
}
