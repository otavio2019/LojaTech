import produtos from "@/data/mock/produtos.json";
import type { Produto } from "@/types/produto";

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
