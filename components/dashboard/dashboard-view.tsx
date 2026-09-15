"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardData } from "@/types/dashboard";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Card } from "@/components/ui/card";

const paymentLabels: Record<string, string> = { pix: "Pix", credito: "Crédito", debito: "Débito", boleto: "Boleto" };
const colors = ["#22d3ee", "#60a5fa", "#a78bfa", "#34d399", "#f59e0b"];

export function DashboardView({ data }: { data: DashboardData }) {
  const [period, setPeriod] = useState("todos");
  const filteredSales = useMemo(() => {
    if (period === "todos") return data.sales;
    const days = Number(period);
    const limit = new Date();
    limit.setDate(limit.getDate() - days);
    return data.sales.filter((sale) => new Date(`${sale.data_venda}T00:00:00`) >= limit);
  }, [data.sales, period]);

  const summary = useMemo(() => ({
    totalSales: filteredSales.length,
    revenue: filteredSales.reduce((total, sale) => total + sale.valor_total, 0),
    units: filteredSales.reduce((total, sale) => total + sale.quantidade, 0),
  }), [filteredSales]);

  const salesByDate = useMemo(() => Object.entries(filteredSales.reduce<Record<string, number>>((acc, sale) => {
    acc[sale.data_venda] = (acc[sale.data_venda] ?? 0) + sale.valor_total;
    return acc;
  }, {})).sort(([a], [b]) => a.localeCompare(b)).map(([date, revenue]) => ({ date: date.slice(5).replace("-", "/"), revenue })), [filteredSales]);

  const topProducts = useMemo(() => {
    const quantities = filteredSales.reduce<Record<string, number>>((acc, sale) => {
      acc[sale.id_produto] = (acc[sale.id_produto] ?? 0) + sale.quantidade;
      return acc;
    }, {});
    return Object.entries(quantities).map(([id, units]) => ({ name: data.products.find((product) => product.id_produto === id)?.nome ?? id, units })).sort((a, b) => b.units - a.units).slice(0, 5);
  }, [data.products, filteredSales]);

  const paymentMix = useMemo(() => Object.entries(filteredSales.reduce<Record<string, number>>((acc, sale) => {
    acc[sale.forma_pagamento] = (acc[sale.forma_pagamento] ?? 0) + sale.valor_total;
    return acc;
  }, {})).map(([name, value]) => ({ name: paymentLabels[name] ?? name, value })), [filteredSales]);

  const lowStock = data.products.filter((product) => product.estoque <= 5).sort((a, b) => a.estoque - b.estoque);

  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Visão gerencial</p><h1 className="mt-3 text-4xl font-bold">Dashboard</h1><p className="mt-3 text-slate-400">Acompanhe o desempenho da LojaTech com dados do Supabase.</p></div>
      <label className="text-sm text-slate-400">Período<select value={period} onChange={(event) => setPeriod(event.target.value)} className="field mt-2 min-w-44"><option value="todos">Todo o período</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option><option value="365">Último ano</option></select></label>
    </div>
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Faturamento" value={formatCurrency(summary.revenue)} /><Metric label="Pedidos" value={formatNumber(summary.totalSales)} /><Metric label="Unidades vendidas" value={formatNumber(summary.units)} /></div>
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]"><Card><h2 className="text-lg font-semibold">Faturamento por dia</h2><div className="mt-5 h-72">{salesByDate.length ? <ResponsiveContainer width="100%" height="100%"><LineChart data={salesByDate}><CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} /><XAxis dataKey="date" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `R$${value}`} /><Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} /><Line type="monotone" dataKey="revenue" name="Faturamento" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: "#22d3ee" }} /></LineChart></ResponsiveContainer> : <EmptyState text="Sem vendas no período selecionado." />}</div></Card><Card><h2 className="text-lg font-semibold">Formas de pagamento</h2><div className="mt-5 h-72">{paymentMix.length ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={paymentMix} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={4}>{paymentMix.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} /></PieChart></ResponsiveContainer> : <EmptyState text="Sem pagamentos no período selecionado." />}</div><div className="flex flex-wrap gap-3 text-xs text-slate-400">{paymentMix.map((item, index) => <span key={item.name} className="flex items-center gap-2"><i className="size-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />{item.name}</span>)}</div></Card></div>
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]"><Card><h2 className="text-lg font-semibold">Produtos mais vendidos</h2><div className="mt-5 h-72">{topProducts.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={topProducts} layout="vertical" margin={{ left: 12, right: 12 }}><CartesianGrid stroke="rgba(255,255,255,.08)" horizontal={false} /><XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} /><YAxis type="category" dataKey="name" width={130} stroke="#cbd5e1" fontSize={11} /><Tooltip formatter={(value) => `${value} un.`} contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} /><Bar dataKey="units" name="Unidades" fill="#60a5fa" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer> : <EmptyState text="Sem vendas no período selecionado." />}</div></Card><Card><h2 className="text-lg font-semibold">Estoque baixo</h2><div className="mt-5 space-y-3">{lowStock.length ? lowStock.map((product) => <div key={product.id_produto} className="flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/5 p-3"><div><p className="font-medium text-white">{product.nome}</p><p className="text-xs text-slate-400">{product.categoria}</p></div><strong className="text-amber-300">{product.estoque} un.</strong></div>) : <p className="text-sm text-slate-400">Nenhum produto com estoque baixo.</p>}</div></Card></div>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <Card><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-white">{value}</p></Card>; }
function EmptyState({ text }: { text: string }) { return <div className="grid h-full place-items-center text-sm text-slate-500">{text}</div>; }
