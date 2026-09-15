"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Cliente } from "@/types/cliente";
import type { Produto } from "@/types/produto";
import { calculateSaleTotal } from "@/lib/calculations/sales";
import { saleSchema, type SaleFormData } from "@/lib/validations/sale-schema";
import { formatCurrency } from "@/lib/formatters";
import { Card } from "@/components/ui/card";

export function SaleForm({ customers, products }: { customers: Cliente[]; products: Produto[] }) {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, control, setError, formState: { errors, isSubmitting }, reset } = useForm<z.input<typeof saleSchema>, unknown, SaleFormData>({ resolver: zodResolver(saleSchema), defaultValues: { quantidade: 1, forma_pagamento: "pix" } });
  const selectedProductId = useWatch({ control, name: "id_produto" });
  const quantity = Number(useWatch({ control, name: "quantidade" })) || 0;
  const selectedProduct = products.find((product) => product.id_produto === selectedProductId);
  const total = useMemo(() => calculateSaleTotal(quantity, selectedProduct?.preco ?? 0), [quantity, selectedProduct]);

  function onSubmit(data: SaleFormData) {
    setSuccess(false);
    if (selectedProduct && data.quantidade > selectedProduct.estoque) {
      setError("quantidade", { message: `Estoque disponível: ${selectedProduct.estoque} unidade(s)` });
      return;
    }
    setSuccess(true);
    reset({ quantidade: 1, forma_pagamento: "pix" });
  }

  return <Card><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Nova venda</p><h2 className="mt-1 text-2xl font-bold">Registrar venda</h2></div><span className="text-sm text-slate-400">Simulação local</span></div>{success && <p role="status" className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300">Venda validada com sucesso. A persistência será conectada ao banco em uma próxima etapa.</p>}<form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5 md:grid-cols-2"><Field label="Cliente" error={errors.id_cliente?.message}><select {...register("id_cliente")} className="field" defaultValue=""><option value="" disabled>Selecione um cliente</option>{customers.map((customer) => <option key={customer.id_cliente} value={customer.id_cliente}>{customer.nome}</option>)}</select></Field><Field label="Produto" error={errors.id_produto?.message}><select {...register("id_produto")} className="field" defaultValue=""><option value="" disabled>Selecione um produto</option>{products.map((product) => <option key={product.id_produto} value={product.id_produto}>{product.nome} · {formatCurrency(product.preco)}</option>)}</select></Field><Field label="Quantidade" error={errors.quantidade?.message}><input {...register("quantidade", { valueAsNumber: true })} type="number" min="1" className="field" /></Field><Field label="Forma de pagamento" error={errors.forma_pagamento?.message}><select {...register("forma_pagamento")} className="field"><option value="pix">Pix</option><option value="credito">Cartão de crédito</option><option value="debito">Cartão de débito</option><option value="boleto">Boleto</option></select></Field><div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 md:col-span-2"><div className="flex items-center justify-between"><span className="text-sm text-slate-400">Total da venda</span><strong className="text-2xl text-cyan-300">{formatCurrency(total)}</strong></div>{selectedProduct && <p className="mt-2 text-xs text-slate-400">{quantity} × {formatCurrency(selectedProduct.preco)} · estoque disponível: {selectedProduct.estoque}</p>}</div><button disabled={isSubmitting} type="submit" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2">{isSubmitting ? "Validando..." : "Validar e registrar venda"}</button></form></Card>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-slate-200">{label}<div className="mt-2">{children}</div>{error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}</label>; }
