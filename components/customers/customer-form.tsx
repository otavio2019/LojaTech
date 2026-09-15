"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { customerSchema, type CustomerFormData } from "@/lib/validations/customer-schema";
import { Card } from "@/components/ui/card";

export function CustomerForm() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.input<typeof customerSchema>, unknown, CustomerFormData>({ resolver: zodResolver(customerSchema), defaultValues: { estado: "PB" } });
  async function onSubmit(data: CustomerFormData) {
    setMessage(null);
    const response = await fetch("/api/clientes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setMessage({ type: "error", text: result.error ?? "Não foi possível cadastrar o cliente." }); return; }
    setMessage({ type: "success", text: "Cliente cadastrado com sucesso no Supabase." });
    reset({ estado: "PB" });
  }
  return <Card><p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Novo cliente</p><h2 className="mt-1 text-2xl font-bold">Cadastrar cliente</h2>{message && <p role="status" className={`mt-5 rounded-xl border p-3 text-sm ${message.type === "success" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-rose-400/20 bg-rose-400/10 text-rose-300"}`}>{message.text}</p>}<form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5 md:grid-cols-2"><Field label="Nome completo" error={errors.nome?.message}><input {...register("nome")} className="field" placeholder="Ex.: Ana Beatriz Lima" /></Field><Field label="E-mail" error={errors.email?.message}><input {...register("email")} type="email" className="field" placeholder="ana@email.com" /></Field><Field label="Cidade" error={errors.cidade?.message}><input {...register("cidade")} className="field" placeholder="João Pessoa" /></Field><Field label="UF" error={errors.estado?.message}><input {...register("estado")} maxLength={2} className="field uppercase" placeholder="PB" /></Field><button disabled={isSubmitting} type="submit" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50 md:col-span-2">{isSubmitting ? "Salvando..." : "Cadastrar cliente"}</button></form></Card>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-slate-200">{label}<div className="mt-2">{children}</div>{error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}</label>; }
