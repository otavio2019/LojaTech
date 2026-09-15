"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productSchema, type ProductFormData } from "@/lib/validations/product-schema";
import { Card } from "@/components/ui/card";

export function ProductForm() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.input<typeof productSchema>, unknown, ProductFormData>({ resolver: zodResolver(productSchema), defaultValues: { estoque: 0, preco: 0, custo: 0 } });
  async function onSubmit(data: ProductFormData) {
    setMessage(null);
    const response = await fetch("/api/produtos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setMessage({ type: "error", text: result.error ?? "Não foi possível cadastrar o produto." }); return; }
    setMessage({ type: "success", text: "Produto cadastrado com sucesso no Supabase." });
    reset({ estoque: 0, preco: 0, custo: 0 });
  }
  return <Card><p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Novo produto</p><h2 className="mt-1 text-2xl font-bold">Cadastrar produto</h2>{message && <p role="status" className={`mt-5 rounded-xl border p-3 text-sm ${message.type === "success" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-rose-400/20 bg-rose-400/10 text-rose-300"}`}>{message.text}</p>}<form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5 md:grid-cols-2"><Field label="Nome" error={errors.nome?.message}><input {...register("nome")} className="field" placeholder="Ex.: Webcam Full HD" /></Field><Field label="Categoria" error={errors.categoria?.message}><input {...register("categoria")} className="field" placeholder="Periféricos" /></Field><Field label="Preço de venda" error={errors.preco?.message}><input {...register("preco", { valueAsNumber: true })} type="number" min="0" step="0.01" className="field" /></Field><Field label="Custo" error={errors.custo?.message}><input {...register("custo", { valueAsNumber: true })} type="number" min="0" step="0.01" className="field" /></Field><Field label="Estoque inicial" error={errors.estoque?.message}><input {...register("estoque", { valueAsNumber: true })} type="number" min="0" step="1" className="field" /></Field><Field label="Descrição" error={errors.descricao?.message}><input {...register("descricao")} className="field" placeholder="Descrição do produto" /></Field><button disabled={isSubmitting} type="submit" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50 md:col-span-2">{isSubmitting ? "Salvando..." : "Cadastrar produto"}</button></form></Card>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-slate-200">{label}<div className="mt-2">{children}</div>{error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}</label>; }
