"use client";

import { useMemo, useState } from "react";
import type { Produto } from "@/types/produto";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const sortOptions = [
  { value: "relevance", label: "Mais relevantes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "stock", label: "Maior estoque" },
];

export function ProductCatalog({ products }: { products: Produto[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("relevance");
  const categories = ["Todas", ...Array.from(new Set(products.map((product) => product.categoria)))];

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesSearch = !term || `${product.nome} ${product.categoria} ${product.descricao}`.toLowerCase().includes(term);
      const matchesCategory = category === "Todas" || product.categoria === category;
      return matchesSearch && matchesCategory;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.preco - b.preco;
      if (sort === "price-desc") return b.preco - a.preco;
      if (sort === "stock") return b.estoque - a.estoque;
      return 0;
    });
  }, [category, products, search, sort]);

  return (
    <>
      <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_190px_190px]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome, categoria ou descrição..." aria-label="Buscar produtos" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoria" className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400">
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar produtos" className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400">
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
      <p className="mt-5 text-sm text-slate-400">{filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}</p>
      {filteredProducts.length === 0 ? <Card className="mt-5 text-center"><h2 className="text-xl font-semibold">Nenhum produto encontrado</h2><p className="mt-2 text-slate-400">Tente mudar o termo de busca ou selecionar outra categoria.</p><button onClick={() => { setSearch(""); setCategory("Todas"); }} className="mt-5 text-sm font-semibold text-cyan-300 hover:text-cyan-200">Limpar filtros</button></Card> : <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filteredProducts.map((product) => <Card key={product.id_produto} className="flex flex-col"><div className="flex items-start justify-between gap-4"><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">{product.categoria}</span><span className="text-sm text-amber-300">★ {product.avaliacao}</span></div><h2 className="mt-5 text-xl font-semibold">{product.nome}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{product.descricao}</p><div className="mt-6 flex items-end justify-between"><div><p className="text-2xl font-bold text-white">{formatCurrency(product.preco)}</p><p className="mt-1 text-xs text-slate-500">Cadastrado em {formatDate(product.data_cadastro)}</p></div><span className={`text-right text-sm font-medium ${product.estoque <= 5 ? "text-amber-300" : "text-emerald-300"}`}>{product.estoque <= 5 && "Estoque baixo · "}{product.estoque} un.</span></div></Card>)}</div>}
    </>
  );
}
